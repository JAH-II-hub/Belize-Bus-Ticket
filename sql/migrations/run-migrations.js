/**
 * Database Migration Runner
 * 
 * This script runs all pending migrations in the sql/migrations directory.
 * Migrations are executed in alphabetical order by filename.
 * 
 * Usage: npm run db:migrate
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'belize_bus_system'
};

// Migrations directory
const MIGRATIONS_DIR = path.join(__dirname);

/**
 * Create migrations table if it doesn't exist
 */
async function createMigrationsTable(connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Migrations table ready');
}

/**
 * Get list of already executed migrations
 */
async function getExecutedMigrations(connection) {
  const [rows] = await connection.execute('SELECT name FROM _migrations ORDER BY id');
  return rows.map(row => row.name);
}

/**
 * Get list of migration files in directory
 */
function getMigrationFiles() {
  const files = fs.readdirSync(MIGRATIONS_DIR);
  return files
    .filter(file => file.endsWith('.sql') && file !== 'run-migrations.js')
    .sort();
}

/**
 * Run a single migration file
 */
async function runMigration(connection, filename) {
  const filePath = path.join(MIGRATIONS_DIR, filename);
  const sql = fs.readFileSync(filePath, 'utf8');
  
  // Split SQL statements by semicolon (basic approach)
  const statements = sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
  
  // Execute each statement in a transaction
  await connection.query('START TRANSACTION');
  
  try {
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    
    // Record migration as executed
    await connection.execute(
      'INSERT INTO _migrations (name) VALUES (?)',
      [filename]
    );
    
    await connection.query('COMMIT');
    console.log(`✓ Executed: ${filename}`);
    return true;
  } catch (error) {
    await connection.query('ROLLBACK');
    console.error(`✗ Failed: ${filename}`);
    console.error(`  Error: ${error.message}`);
    throw error;
  }
}

/**
 * Main migration runner
 */
async function runMigrations() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Database Migration Runner            ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log(`Database: ${dbConfig.database}@${dbConfig.host}:${dbConfig.port}`);
  console.log('');
  
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database');
    
    // Create migrations table
    await createMigrationsTable(connection);
    
    // Get executed and pending migrations
    const executed = await getExecutedMigrations(connection);
    const allFiles = getMigrationFiles();
    const pending = allFiles.filter(file => !executed.includes(file));
    
    console.log(`Found ${allFiles.length} migration(s)`);
    console.log(`Executed: ${executed.length}`);
    console.log(`Pending: ${pending.length}`);
    console.log('');
    
    if (pending.length === 0) {
      console.log('No pending migrations. Database is up to date.');
      return;
    }
    
    // Run pending migrations
    console.log('Running pending migrations...');
    console.log('');
    
    for (const file of pending) {
      await runMigration(connection, file);
    }
    
    console.log('');
    console.log('All migrations completed successfully!');
    
  } catch (error) {
    console.error('');
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run migrations
runMigrations();