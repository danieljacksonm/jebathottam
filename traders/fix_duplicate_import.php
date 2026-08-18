<?php
/**
 * ONE-TIME fix: same data showing 3 times after Excel/SQL import.
 *
 * Cause: tables imported without PRIMARY KEY, then history SQL imported
 * more than once. REPLACE becomes INSERT → every row copied again.
 * Excel JOIN then shows each line 3 times.
 *
 * Open once in browser (logged-in GST session optional — run from hosting):
 *   /fix_duplicate_import.php
 * Delete this file after it says OK.
 */
include __DIR__ . '/config.php';
require_once __DIR__ . '/auth_helper.php';
requireSection('gst');

header('Content-Type: text/plain; charset=utf-8');

function tableExists(mysqli $conn, $table)
{
    $t = $conn->real_escape_string($table);
    $r = $conn->query("SHOW TABLES LIKE '$t'");
    return $r && $r->num_rows > 0;
}

function hasPrimaryKey(mysqli $conn, $table)
{
    $t = $conn->real_escape_string($table);
    $r = $conn->query("SHOW KEYS FROM `$t` WHERE Key_name = 'PRIMARY'");
    return $r && $r->num_rows > 0;
}

function countDupIds(mysqli $conn, $table)
{
    $r = $conn->query("SELECT COUNT(*) AS c FROM (
        SELECT id FROM `$table` GROUP BY id HAVING COUNT(*) > 1
    ) t");
    return $r ? (int) $r->fetch_assoc()['c'] : 0;
}

function countRows(mysqli $conn, $table)
{
    $r = $conn->query("SELECT COUNT(*) AS c FROM `$table`");
    return $r ? (int) $r->fetch_assoc()['c'] : 0;
}

/**
 * Keep one row per id. Works even when PRIMARY KEY is missing.
 */
function dedupeById(mysqli $conn, $table)
{
    $table = preg_replace('/[^a-z0-9_]/i', '', $table);
    if ($table === '') {
        throw new Exception('Bad table name');
    }

    $before = countRows($conn, $table);
    $dupGroups = countDupIds($conn, $table);
    if ($dupGroups === 0) {
        return ['table' => $table, 'before' => $before, 'after' => $before, 'removed' => 0, 'dup_groups' => 0];
    }

    $tmp = $table . '_dedup_tmp';
    $conn->query("DROP TABLE IF EXISTS `$tmp`");

    // One row per id (any matching row is fine — they are copies)
    if (!$conn->query("CREATE TABLE `$tmp` AS SELECT * FROM `$table` GROUP BY id")) {
        // Strict ONLY_FULL_GROUP_BY: build column list with ANY_VALUE
        $colsRes = $conn->query("SHOW COLUMNS FROM `$table`");
        if (!$colsRes) {
            throw new Exception("SHOW COLUMNS failed for $table: " . $conn->error);
        }
        $parts = [];
        while ($c = $colsRes->fetch_assoc()) {
            $name = $c['Field'];
            if (strcasecmp($name, 'id') === 0) {
                $parts[] = '`id`';
            } else {
                $parts[] = "ANY_VALUE(`$name`) AS `$name`";
            }
        }
        $conn->query("DROP TABLE IF EXISTS `$tmp`");
        $sql = "CREATE TABLE `$tmp` AS SELECT " . implode(', ', $parts) . " FROM `$table` GROUP BY id";
        if (!$conn->query($sql)) {
            throw new Exception("Dedup create failed for $table: " . $conn->error);
        }
    }

    if (!$conn->query("TRUNCATE TABLE `$table`")) {
        throw new Exception("TRUNCATE failed for $table: " . $conn->error);
    }
    if (!$conn->query("INSERT INTO `$table` SELECT * FROM `$tmp`")) {
        throw new Exception("INSERT back failed for $table: " . $conn->error);
    }
    $conn->query("DROP TABLE IF EXISTS `$tmp`");

    $after = countRows($conn, $table);
    return [
        'table' => $table,
        'before' => $before,
        'after' => $after,
        'removed' => $before - $after,
        'dup_groups' => $dupGroups,
    ];
}

function ensurePrimaryKey(mysqli $conn, $table)
{
    $table = preg_replace('/[^a-z0-9_]/i', '', $table);
    if (hasPrimaryKey($conn, $table)) {
        return "OK: `$table` already has PRIMARY KEY";
    }
    // Remove any leftover duplicate ids first
    dedupeById($conn, $table);
    if (!$conn->query("ALTER TABLE `$table` ADD PRIMARY KEY (`id`)")) {
        return "FAIL: `$table` PRIMARY KEY — " . $conn->error;
    }
    // Best-effort auto increment
    @$conn->query("ALTER TABLE `$table` MODIFY `id` INT NOT NULL AUTO_INCREMENT");
    return "FIXED: `$table` PRIMARY KEY added";
}

$tables = ['products', 'bills', 'bill_items'];

echo "YEGOVA TRADERS — fix duplicate import data\n";
echo "==========================================\n\n";

try {
    foreach ($tables as $t) {
        if (!tableExists($conn, $t)) {
            echo "SKIP: `$t` not found\n";
            continue;
        }
        $rows = countRows($conn, $t);
        $dups = countDupIds($conn, $t);
        $pk = hasPrimaryKey($conn, $t) ? 'yes' : 'NO';
        echo "BEFORE `$t`: rows=$rows duplicate_id_groups=$dups primary_key=$pk\n";
    }

    echo "\n--- Deduplicating ---\n";
    foreach ($tables as $t) {
        if (!tableExists($conn, $t)) {
            continue;
        }
        $info = dedupeById($conn, $t);
        echo "{$info['table']}: {$info['before']} → {$info['after']} (removed {$info['removed']}, groups {$info['dup_groups']})\n";
    }

    echo "\n--- Ensuring PRIMARY KEY ---\n";
    foreach ($tables as $t) {
        if (!tableExists($conn, $t)) {
            continue;
        }
        echo ensurePrimaryKey($conn, $t) . "\n";
    }

    echo "\n--- AFTER ---\n";
    foreach ($tables as $t) {
        if (!tableExists($conn, $t)) {
            continue;
        }
        $rows = countRows($conn, $t);
        $dups = countDupIds($conn, $t);
        $pk = hasPrimaryKey($conn, $t) ? 'yes' : 'NO';
        echo "AFTER `$t`: rows=$rows duplicate_id_groups=$dups primary_key=$pk\n";
    }

    echo "\nDONE. Open Excel report again — rows should not repeat 3 times.\n";
    echo "Delete this file (fix_duplicate_import.php) from the server.\n";
} catch (Exception $e) {
    http_response_code(500);
    echo "ERROR: " . $e->getMessage() . "\n";
}
