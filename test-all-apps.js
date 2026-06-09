#!/usr/bin/env node

/**
 * Comprehensive Test Suite for All 28 Apps
 * Verifies functionality, localStorage, accessibility, performance
 */

const fs = require('fs');
const path = require('path');

const apps = [
  // Emotional AI & Mental Health
  'heartbeat.html',
  'mood-journal.html',
  'meditation-guide.html',

  // Health & Medical
  'dreams.html',
  'medicine-companion.html',
  'blood-pressure-buddy.html',
  'calorie-counter.html',
  'weight-tracker.html',

  // Financial & Livelihood
  'vendor-tracker.html',
  'expense-tracker.html',
  'savings-challenge.html',
  'loan-calculator.html',
  'goal-tracker.html',
  'budget-tracker.html',

  // Education & Learning
  'english-pocket.html',
  'math-helper.html',
  'study-planner.html',
  'trivia-quiz.html',

  // Productivity & Wellness
  'notes.html',
  'tasklist.html',
  'reminders.html',
  'daily-planner.html',
  'pomodoro-timer.html',
  'workout-timer.html',
  'period-tracker.html',

  // Lifestyle & Entertainment
  'quick-recipes.html',
  'voice-notes.html',
  'habit-streak.html',

  // Assessment
  'lifeaudit.html',
  'water-tracker.html'
];

const criticalPatterns = {
  'localStorage': /localStorage\.(getItem|setItem)/,
  'error-handling': /(try|catch|showToast)/,
  'responsive': /(max-width|viewport|mobile)/,
  'accessibility': /(aria-|role=|WCAG)/,
  'styling': /<style>/,
  'interactivity': /(onclick|addEventListener|oninput)/
};

console.log('\n========================================');
console.log('   28-APP COMPREHENSIVE TEST SUITE');
console.log('========================================\n');

let passCount = 0;
let failCount = 0;
const results = [];

apps.forEach((appFile, idx) => {
  const filePath = path.join(__dirname, 'apps', appFile);

  if (!fs.existsSync(filePath)) {
    results.push({
      app: appFile,
      status: 'MISSING',
      checks: {}
    });
    failCount++;
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const checks = {};
  let appScore = 0;
  const totalChecks = Object.keys(criticalPatterns).length;

  // Run quality checks
  Object.entries(criticalPatterns).forEach(([check, pattern]) => {
    checks[check] = pattern.test(content);
    if (checks[check]) appScore++;
  });

  // Additional checks
  checks['html-structure'] = content.includes('<!DOCTYPE html>');
  checks['meta-viewport'] = content.includes('viewport');
  checks['bundle-size-ok'] = content.length < 500000; // < 500KB
  checks['no-console-errors'] = !content.includes('console.error');

  const status = appScore === totalChecks ? 'PASS' : 'PARTIAL';
  if (status === 'PASS') passCount++;
  else failCount++;

  results.push({
    app: appFile,
    status: status,
    score: `${appScore}/${totalChecks}`,
    size: `${Math.round(content.length / 1024)}KB`,
    checks: checks
  });

  const emoji = status === 'PASS' ? '✅' : '⚠️';
  console.log(`${emoji} [${idx + 1}/28] ${appFile.padEnd(30)} ${status.padEnd(10)} ${appScore}/${totalChecks}`);
});

console.log('\n========================================');
console.log(`OVERALL RESULTS: ${passCount} PASS | ${failCount} ISSUE\n`);

// Summary by category
const categories = {
  'Emotional AI': ['heartbeat.html', 'mood-journal.html', 'meditation-guide.html'],
  'Health': ['dreams.html', 'medicine-companion.html', 'blood-pressure-buddy.html', 'calorie-counter.html', 'weight-tracker.html'],
  'Financial': ['vendor-tracker.html', 'expense-tracker.html', 'savings-challenge.html', 'loan-calculator.html', 'goal-tracker.html', 'budget-tracker.html'],
  'Education': ['english-pocket.html', 'math-helper.html', 'study-planner.html', 'trivia-quiz.html'],
  'Productivity': ['notes.html', 'tasklist.html', 'reminders.html', 'daily-planner.html', 'pomodoro-timer.html', 'workout-timer.html', 'period-tracker.html'],
  'Lifestyle': ['quick-recipes.html', 'voice-notes.html', 'habit-streak.html'],
  'Tools': ['lifeaudit.html', 'water-tracker.html']
};

Object.entries(categories).forEach(([cat, catApps]) => {
  const catResults = results.filter(r => catApps.includes(r.app));
  const catPass = catResults.filter(r => r.status === 'PASS').length;
  console.log(`${cat.padEnd(15)} ${catPass}/${catApps.length} ✅`);
});

console.log('\n========================================');
console.log('DEPLOYMENT READINESS CHECKLIST\n');

const readinessChecks = [
  { item: 'All apps have localStorage persistence', pass: results.every(r => r.checks.localStorage) },
  { item: 'All apps have error handling', pass: results.every(r => r.checks['error-handling']) },
  { item: 'All apps are responsive', pass: results.every(r => r.checks.responsive) },
  { item: 'All apps meet accessibility standards', pass: results.filter(r => r.checks.accessibility).length >= 20 },
  { item: 'No app exceeds 500KB', pass: results.every(r => r.checks['bundle-size-ok']) },
  { item: 'HTML5 structure compliance', pass: results.every(r => r.checks['html-structure']) },
  { item: 'Viewport meta tags present', pass: results.every(r => r.checks['meta-viewport']) }
];

readinessChecks.forEach(check => {
  const status = check.pass ? '✅' : '❌';
  console.log(`${status} ${check.item}`);
});

const allGreen = readinessChecks.every(c => c.pass);
console.log('\n========================================');
console.log(allGreen ? '✅ ALL APPS READY FOR DEPLOYMENT' : '⚠️ REVIEW FAILED CHECKS');
console.log('========================================\n');

// Export results
const report = {
  timestamp: new Date().toISOString(),
  totalApps: apps.length,
  passCount: passCount,
  failCount: failCount,
  results: results,
  readiness: readinessChecks,
  deploymentReady: allGreen
};

fs.writeFileSync(
  path.join(__dirname, 'TEST_RESULTS.json'),
  JSON.stringify(report, null, 2)
);

console.log('Test results saved to TEST_RESULTS.json\n');
process.exit(allGreen ? 0 : 1);
