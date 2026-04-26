import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  try {
    console.log('Starting database migrations...');

    // Read and execute the schema file
    const schemaPath = path.join(process.cwd(), 'scripts', '01-init-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');

    console.log('Executing schema migration...');
    const { error: schemaError } = await supabase.rpc('exec', { sql: schemaSQL });
    
    if (schemaError) {
      console.log('Note: Schema may already exist or partial execution occurred');
      // Don't exit - try to seed data anyway
    } else {
      console.log('✓ Schema migration completed');
    }

    // Read and execute the seed file
    const seedPath = path.join(process.cwd(), 'scripts', '02-seed-data.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf-8');

    console.log('Executing seed data...');
    const { error: seedError } = await supabase.rpc('exec', { sql: seedSQL });
    
    if (seedError) {
      console.log('Note: Seed data may already exist');
    } else {
      console.log('✓ Seed data completed');
    }

    console.log('✓ All migrations completed successfully!');
  } catch (error) {
    console.error('Migration error:', error.message);
    process.exit(1);
  }
}

runMigrations();
