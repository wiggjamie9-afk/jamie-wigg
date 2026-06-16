import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const migrationsDir = path.join(__dirname, 'migrations');

interface Migration {
  name: string;
  version: number;
}

async function initMigrationTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getMigrations(): Promise<Migration[]> {
  const result = await pool.query(
    'SELECT version, name FROM schema_migrations ORDER BY version'
  );
  return result.rows;
}

async function getAvailableMigrations(): Promise<Migration[]> {
  if (!fs.existsSync(migrationsDir)) {
    return [];
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  return files.map((file, index) => ({
    name: file,
    version: index + 1,
  }));
}

async function runMigration(version: number, name: string, sql: string) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Execute migration SQL
    await client.query(sql);

    // Record migration
    await client.query(
      'INSERT INTO schema_migrations (version, name) VALUES ($1, $2)',
      [version, name]
    );

    await client.query('COMMIT');
    console.log(`✓ Migration ${version}: ${name}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw new Error(`Migration ${version} failed: ${error}`);
  } finally {
    client.release();
  }
}

export async function migrate() {
  try {
    await initMigrationTable();

    const executedMigrations = await getMigrations();
    const availableMigrations = await getAvailableMigrations();

    const lastVersion = executedMigrations.length > 0
      ? executedMigrations[executedMigrations.length - 1].version
      : 0;

    const pendingMigrations = availableMigrations.filter(
      m => m.version > lastVersion
    );

    if (pendingMigrations.length === 0) {
      console.log('✓ Database is up to date');
      return;
    }

    console.log(`Running ${pendingMigrations.length} pending migration(s)...`);

    for (const migration of pendingMigrations) {
      const filePath = path.join(migrationsDir, migration.name);
      const sql = fs.readFileSync(filePath, 'utf8');
      await runMigration(migration.version, migration.name, sql);
    }

    console.log('✓ All migrations completed');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations if this is the main module
if (require.main === module) {
  migrate();
}
