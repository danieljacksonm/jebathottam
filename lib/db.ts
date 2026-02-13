import mysql from 'mysql2/promise';

// Database connection pool
let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    const useSSL = process.env.DB_SSL === 'true' || process.env.DATABASE_URL?.includes('sslaccept');
    const baseConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ministry_platform',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    };
    pool = mysql.createPool({
      ...baseConfig,
      ...(useSSL && {
        ssl: { rejectUnauthorized: true },
      }),
    });
  }
  return pool;
}

// Helper function to execute queries
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T> {
  const connection = getDbPool();
  const [results] = await connection.execute(sql, params);
  return results as T;
}

// Helper function for transactions
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const pool = getDbPool();
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
