import fetch from 'node-fetch';

async function testChainOfDraft() {
  const problem = "What is the sum of the first 50 even numbers?";
  
  try {
    const response = await fetch('http://localhost:3000/math', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        problem: problem,
        approach: 'CoD',  // Force Chain of Draft approach
        max_words_per_step: 6  // Set strict word limit
      })
    });
    
    const data = await response.json();
    console.log("=== Chain of Draft Demo ===");
    console.log(`Problem: ${problem}`);
    console.log("\nReasoning Steps:");
    console.log(data.reasoning_steps);
    console.log(`\nFinal Answer: ${data.final_answer}`);
    console.log("\nStats:");
    console.log(`- Approach: ${data.approach}`);
    console.log(`- Word limit: ${data.stats.word_limit}`);
    console.log(`- Tokens used: ${data.stats.token_count}`);
    console.log(`- Execution time: ${data.stats.execution_time_ms}ms`);
    console.log(`- Complexity score: ${data.stats.complexity}`);
  } catch (error) {
    console.error("Error testing Chain of Draft:", error);
  }
}

testChainOfDraft();