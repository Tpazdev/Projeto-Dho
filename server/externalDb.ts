import sql from 'mssql';

const config: sql.config = {
  server: process.env.EXTERNAL_SQL_SERVER || '',
  port: parseInt(process.env.EXTERNAL_SQL_PORT || '1433'),
  user: process.env.EXTERNAL_SQL_USER || '',
  password: process.env.EXTERNAL_SQL_PASSWORD || '',
  database: process.env.EXTERNAL_SQL_DATABASE || '',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  connectionTimeout: 15000,
  requestTimeout: 15000,
};

let pool: sql.ConnectionPool | null = null;

export async function getExternalDbConnection(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await sql.connect(config);
    console.log('Conexão com banco SQL Server externo estabelecida');
  }
  return pool;
}

export async function queryExternalDb<T = any>(query: string): Promise<T[]> {
  try {
    const connection = await getExternalDbConnection();
    const result = await connection.request().query(query);
    return result.recordset as T[];
  } catch (error) {
    console.error('Erro ao executar query no banco externo:', error);
    throw error;
  }
}

export async function closeExternalDbConnection() {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('Conexão com banco SQL Server externo encerrada');
  }
}

// Fechar conexão quando o processo terminar
process.on('SIGINT', async () => {
  await closeExternalDbConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeExternalDbConnection();
  process.exit(0);
});
