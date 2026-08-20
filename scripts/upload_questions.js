import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const questionsDir = path.join(__dirname, '..', 'questions');

async function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // skip header
  const dataLines = lines.slice(1);
  const results = [];

  for (const line of dataLines) {
    try {
      // Find the JSON array for options
      const bracketStart = line.indexOf('[');
      const bracketEnd = line.lastIndexOf(']');
      
      if (bracketStart === -1 || bracketEnd === -1) {
        console.warn(`Skipping malformed line in ${path.basename(filePath)}: ${line.substring(0, 50)}...`);
        continue;
      }

      const optionsStr = line.substring(bracketStart, bracketEnd + 1);
      let options;
      try {
        options = JSON.parse(optionsStr);
      } catch (e) {
        // If JSON parse fails (e.g., single quotes used instead of double), try to fix it
        const fixedStr = optionsStr.replace(/'/g, '"');
        try {
          options = JSON.parse(fixedStr);
        } catch (e2) {
          options = ["Option A", "Option B", "Option C", "Option D"]; // fallback
        }
      }

      // Parse the first half (category, level, question_text)
      const firstHalf = line.substring(0, bracketStart).trim();
      // Remove trailing comma
      const firstHalfClean = firstHalf.endsWith(',') ? firstHalf.slice(0, -1) : firstHalf;
      const firstParts = firstHalfClean.split(',');
      
      const category = firstParts[0];
      const level = firstParts[1];
      // Question text might have commas, so join the rest back together
      const question_text = firstParts.slice(2).join(',');

      // Parse the second half (correct_answer_index, explanation)
      const secondHalf = line.substring(bracketEnd + 1).trim();
      // Remove leading comma
      const secondHalfClean = secondHalf.startsWith(',') ? secondHalf.substring(1) : secondHalf;
      const secondParts = secondHalfClean.split(',');
      
      const correct_answer_index = parseInt(secondParts[0]);
      // Explanation might have commas, join the rest
      const explanation = secondParts.slice(1).join(',');

      if (isNaN(correct_answer_index)) {
        continue; // Skip invalid rows to prevent database errors
      }

      results.push({
        category,
        level,
        question_text: question_text.replace(/^"|"$/g, '').trim(), // remove quotes if LLM added them
        options,
        correct_answer_index,
        explanation: explanation.replace(/^"|"$/g, '').trim()
      });
    } catch (err) {
      console.error("Error processing row:", err);
    }
  }

  if (results.length === 0) {
    console.log(`Skipping empty/invalid file: ${path.basename(filePath)}`);
    return;
  }

  console.log(`Uploading ${results.length} questions from ${path.basename(filePath)}...`);
  
  // Insert in batches of 100
  const { error } = await supabase.from('questions').insert(results);
  
  if (error) {
    console.error(`Failed to upload ${path.basename(filePath)}:`, error.message);
  } else {
    console.log(`✅ Successfully uploaded ${path.basename(filePath)}`);
  }
}

async function main() {
  console.log("Starting advanced bulk upload process...");
  
  try {
    const files = fs.readdirSync(questionsDir).filter(file => file.endsWith('.csv'));
    console.log(`Found ${files.length} CSV files to process.\n`);

    // Clean the database first!
    console.log("Emptying the questions table first to prevent duplicates...");
    // We cannot TRUNCATE via standard JS client easily if RLS is on, but we can delete all where id is not null
    await supabase.from('user_answers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    for (const file of files) {
      const filePath = path.join(questionsDir, file);
      await processFile(filePath);
    }

    console.log("\n🎉 All uploads complete! Your app is fully populated.");
  } catch (err) {
    console.error("Fatal error:", err);
  }
}

main();
