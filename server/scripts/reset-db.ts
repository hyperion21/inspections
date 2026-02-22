import * as dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

async function resetDatabase() {
  const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USERNAME,
    password: DB_PASSWORD,
    multipleStatements: true,
  });

  console.log(`Dropping database ${DB_NAME} if exists...`);
  await connection.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\`;`);
  console.log(`Creating database ${DB_NAME}...`);
  await connection.query(`CREATE DATABASE \`${DB_NAME}\`;`);

  await connection.end();
  console.log('Database reset complete ✅');
}

resetDatabase().catch((err) => {
  console.error('Error resetting database:', err);
  process.exit(1);
});
