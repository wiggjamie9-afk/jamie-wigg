/**
 * Autonomous Improvement Loop Runner
 * Executes the weekly improvement cycle for all users or a specific user
 */

import { supabase } from '../lib/db';
import { runWeeklyImprovement } from '../lib/autonomous-improvement';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const userId = process.env.USER_ID;

  console.log('🚀 Starting Weekly Autonomous Improvement Loop');
  console.log('='.repeat(60));

  try {
    // Get users to process
    let users: any[] = [];

    if (userId) {
      // Process specific user
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId);

      if (error) throw error;
      users = data || [];

      console.log(`📌 Processing user: ${userId}`);
    } else {
      // Process all active users
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('tier', 'pro'); // Only pro users get autonomous improvements

      if (error) throw error;
      users = data || [];

      console.log(`📌 Processing ${users.length} pro users`);
    }

    const results: any = {
      timestamp: new Date().toISOString(),
      users_processed: users.length,
      total_loops: 0,
      total_experiments: 0,
      total_improvements: 0,
      errors: [],
      user_results: [],
    };

    // Process each user
    for (const user of users) {
      try {
        console.log(`\n👤 Processing ${user.email}...`);

        const result = await runWeeklyImprovement(user.id);

        results.total_loops += result.loopsCreated;
        results.total_experiments += result.experimentsRun;
        results.total_improvements += result.improvementsGenerated;

        results.user_results.push({
          user_id: user.id,
          email: user.email,
          ...result,
        });

        console.log(`   ✅ Completed`);
        console.log(`      - Loops: ${result.loopsCreated}`);
        console.log(`      - Experiments: ${result.experimentsRun}`);
        console.log(`      - Improvements: ${result.improvementsGenerated}`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push({
          user_id: user.id,
          email: user.email,
          error: errorMsg,
        });

        console.error(`   ❌ Error: ${errorMsg}`);
      }
    }

    // Save results
    const resultsDir = path.join(
      __dirname,
      '..',
      'results',
      'improvements'
    );
    fs.mkdirSync(resultsDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultsFile = path.join(resultsDir, `loop-${timestamp}.json`);
    const latestFile = path.join(resultsDir, 'latest.json');

    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    fs.writeFileSync(latestFile, JSON.stringify(results, null, 2));

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ Weekly Autonomous Improvement Loop Complete');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   Total Loops Created: ${results.total_loops}`);
    console.log(`   Total Experiments Run: ${results.total_experiments}`);
    console.log(`   Total Improvements Generated: ${results.total_improvements}`);
    console.log(`   Errors: ${results.errors.length}`);

    if (results.errors.length > 0) {
      console.log('\n⚠️  Errors:');
      for (const error of results.errors) {
        console.log(`   - ${error.email}: ${error.error}`);
      }
    }

    console.log(`\n📁 Results saved to: ${resultsFile}`);
    process.exit(results.errors.length > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
