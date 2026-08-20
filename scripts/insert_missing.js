import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const missingQuestions = [
  // 3 missing from Mathematics - Hard
  {
    category: 'Mathematics',
    level: 'Hard',
    question_text: 'What is the sum of the infinite geometric series 1 + 1/2 + 1/4 + 1/8 + ...?',
    options: ['1', '1.5', '2', 'Infinity'],
    correct_answer_index: 2,
    explanation: 'The sum of an infinite geometric series with |r| < 1 is a / (1 - r). Here, a = 1 and r = 1/2, so 1 / (1 - 1/2) = 2.'
  },
  {
    category: 'Mathematics',
    level: 'Hard',
    question_text: 'What is the derivative of f(x) = e^(2x)?',
    options: ['e^(2x)', '2e^(2x)', 'e^x', '2e^x'],
    correct_answer_index: 1,
    explanation: 'Using the chain rule, the derivative of e^(u) is e^(u) * du/dx. Here u = 2x, so the derivative is e^(2x) * 2 = 2e^(2x).'
  },
  {
    category: 'Mathematics',
    level: 'Hard',
    question_text: 'Which of the following numbers is an irrational number?',
    options: ['0', 'Square root of 4', 'Pi', '1/3'],
    correct_answer_index: 2,
    explanation: 'Pi is an irrational number because it cannot be expressed as a simple fraction and its decimal representation never ends or repeats.'
  },
  // 1 missing from Mathematics - Medium
  {
    category: 'Mathematics',
    level: 'Medium',
    question_text: 'If a triangle has sides of length 3, 4, and 5, what type of triangle is it?',
    options: ['Equilateral', 'Isosceles', 'Right-angled', 'Obtuse'],
    correct_answer_index: 2,
    explanation: 'A triangle with side lengths 3, 4, and 5 satisfies the Pythagorean theorem (3^2 + 4^2 = 5^2), making it a right-angled triangle.'
  },
  // 1 missing from Science - Expert
  {
    category: 'Science',
    level: 'Expert',
    question_text: 'Which elementary particle acts as the exchange particle for the strong nuclear force between quarks?',
    options: ['Photon', 'Gluon', 'W Boson', 'Z Boson'],
    correct_answer_index: 1,
    explanation: 'Gluons are the elementary particles that act as the exchange particles for the strong force between quarks, analogous to the exchange of photons in the electromagnetic force.'
  }
];

async function main() {
  console.log("Inserting 5 missing questions...");
  const { data, error } = await supabase.from('questions').insert(missingQuestions);
  
  if (error) {
    console.error("Failed to insert:", error);
  } else {
    console.log("Successfully inserted the 5 missing questions!");
    
    // Verify count
    const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true });
    console.log(`NEW TOTAL QUESTIONS IN DATABASE: ${count}`);
  }
}

main();
