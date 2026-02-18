# Fix phpMyAdmin "controluser" and "daniel@localhost" errors

If phpMyAdmin shows:

- **Access denied for user 'daniel'@'localhost' (using password: YES)**
- **Connection for controluser as defined in your configuration failed.**

phpMyAdmin is trying to use a **control user** (often for bookmarks, relation tables, etc.) named **daniel**, but that MySQL user doesn’t exist or the password doesn’t match.

---

## Option 1: Disable the control user (simplest)

Edit phpMyAdmin’s config so it doesn’t use a control user.

**On the VPS:**

```bash
sudo nano /etc/phpmyadmin/config.inc.php
```

Or, if the config is elsewhere:

```bash
sudo find /etc -name "config.inc.php" 2>/dev/null | xargs grep -l controluser
```

In the file, find the lines for the control user (they may look like):

```php
$cfg['Servers'][$i]['controluser'] = 'daniel';
$cfg['Servers'][$i]['controlpass'] = 'some_password';
```

**Comment them out or set them to empty:**

```php
$cfg['Servers'][$i]['controluser'] = '';
$cfg['Servers'][$i]['controlpass'] = '';
```

Save and reload phpMyAdmin in the browser. You can still use phpMyAdmin normally; only advanced features that need the control user will be disabled.

---

## Option 2: Create the MySQL user phpMyAdmin expects

If you want to keep the control user, create the **daniel** user in MySQL with the **same password** that is in phpMyAdmin’s config.

1. In the config file (above), note the value of `controlpass`.
2. In MySQL (as root or another admin user):

```sql
CREATE USER 'daniel'@'localhost' IDENTIFIED BY 'THE_PASSWORD_FROM_CONFIG';
FLUSH PRIVILEGES;
```

Use the exact password from `controlpass`. Then reload phpMyAdmin.

---

## Summary

- **Option 1:** Set `controluser` and `controlpass` to `''` in phpMyAdmin config → no more controluser/access denied.
- **Option 2:** Create MySQL user `daniel` with the password from the config → controluser works.

Option 1 is enough if you only need to manage databases and run SQL.
