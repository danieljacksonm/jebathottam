import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * GET /api/db-check - Test database connection (no auth).
 * Returns { ok: true } or { ok: false, error: "..." }.
 * Use this to verify DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DB_SSL.
 */
export async function GET() {
  try {
    await query('SELECT 1');
    return NextResponse.json({ ok: true, message: 'Database connected.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const code = err && typeof err === 'object' && 'code' in err ? (err as { code: string }).code : '';
    console.error('DB check failed:', err);
    return NextResponse.json(
      {
        ok: false,
        error: message,
        code: code || undefined,
        hint: getHint(message, code),
      },
      { status: 503 }
    );
  }
}

function getHint(message: string, code: string): string {
  const m = (message + code).toLowerCase();
  if (m.includes('enotfound') || m.includes('getaddrinfo')) {
    return 'Hostname not found (DNS). Check DB_HOST for typos. Copy the exact host from your provider (e.g. IONOS → Database → Connection data). If deploying to Vercel, ensure the host is a public hostname.';
  }
  if (m.includes('econnrefused') || m.includes('connection refused')) {
    return 'Server not reachable. Check DB_HOST and DB_PORT (default 3306). Ensure MySQL is running and allows remote connections.';
  }
  if (m.includes('etimedout') || m.includes('timeout')) {
    return 'Connection timed out. Check DB_HOST, firewall, and that your host (e.g. Vercel) can reach the database server.';
  }
  if (m.includes('access denied') || m.includes('er_access_denied')) {
    return 'Wrong DB_USER or DB_PASSWORD. Check credentials in your env.';
  }
  if (m.includes('unknown database') || m.includes('er_bad_db')) {
    return 'Database name not found. Set DB_NAME to an existing database and run database/schema.sql.';
  }
  if (m.includes('ssl') || m.includes('tls')) {
    return 'SSL issue. For IONOS set DB_SSL=false. For PlanetScale set DB_SSL=true.';
  }
  return 'Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in .env (and DB_PORT if not 3306, DB_SSL=false for IONOS).';
}
