import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function main() {
  const { count, error } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true });
    
  if (error) {
    console.error("Error:", error);
  } else {
    console.log(`TOTAL QUESTIONS IN DATABASE: ${count}`);
  }
}

main();
