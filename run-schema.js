import fs from 'fs';
import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres.nakrhewbsnrkctiwprme:Rajvansh@medsage@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres';

async function executeSchema() {
  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL');
    
    const schemaSql = fs.readFileSync('schema.sql', 'utf8');
    await client.query(schemaSql);
    
    console.log('Schema executed successfully!');
  } catch (err) {
    console.error('Error executing schema:', err);
  } finally {
    await client.end();
  }
}

executeSchema();
