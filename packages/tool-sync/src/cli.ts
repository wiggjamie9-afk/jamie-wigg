#!/usr/bin/env node

import { program } from 'commander';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { scrapPublicAPIs } from './scraper.js';
import { buildToolRegistry } from './builder.js';
import { validateRegistry, ValidationResult } from './validator.js';
import { validateRegistry as validateSchema, ToolRegistryEntry } from './schema.js';
import type { BuiltRegistry } from './types.js';

const DEFAULT_OUTPUT_PATH = join(process.cwd(), 'packages/aria-core/data/tool-registry.json');

program.version('1.0.0');

program
  .command('sync')
  .description('Sync public-apis to Aria tool registry')
  .option('-o, --output <path>', 'Output path', DEFAULT_OUTPUT_PATH)
  .option('--skip-validation', 'Skip health checks')
  .option('--sample-size <n>', 'Sample size for validation', '15')
  .option('-v, --verbose', 'Verbose output')
  .action(async (opts) => {
    const startTime = Date.now();

    try {
      console.log('🚀 Starting tool registry sync...\n');

      // Step 1: Scrape
      const rawAPIs = await scrapPublicAPIs(opts.verbose);

      // Step 2: Build registry
      const registry = await buildToolRegistry(rawAPIs, opts.verbose);

      // Step 3: Validate (optional)
      let validationResult: ValidationResult = { valid: true, errors: [], warnings: [], tested: 0 };
      if (!opts.skipValidation) {
        console.log();
        validationResult = await validateRegistry(
          registry,
          parseInt(opts.sampleSize, 10),
          opts.verbose
        );
      }

      // Step 4: Write output
      const registryJSON = {
        version: registry.version,
        lastSync: registry.lastSync.toISOString(),
        categories: registry.categories,
        byId: Object.fromEntries(registry.byId),
      };

      writeFileSync(opts.output, JSON.stringify(registryJSON, null, 2));
      console.log(`\n💾 Registry written to ${opts.output}`);

      // Summary
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`\n✅ Sync complete in ${duration}s`);
      console.log(`   Tools: ${registry.byId.size}`);
      console.log(`   Categories: ${Object.keys(registry.categories).length}`);
      console.log(`   Validation: ${validationResult.errors.length} errors, ${validationResult.warnings.length} warnings`);

      if (!validationResult.valid) {
        console.log(`\n⚠️  Validation errors (first 5):`);
        validationResult.errors.slice(0, 5).forEach((e) => {
          console.log(`   ${e.toolId}: ${e.error}`);
        });
      }

      process.exit(validationResult.valid ? 0 : 1);
    } catch (err) {
      console.error('❌ Sync failed:', err);
      process.exit(1);
    }
  });

program
  .command('validate')
  .description('Validate existing registry')
  .option('-i, --input <path>', 'Registry path', DEFAULT_OUTPUT_PATH)
  .option('--sample-size <n>', 'Sample size for validation', '15')
  .option('-v, --verbose', 'Verbose output')
  .action(async (opts) => {
    try {
      console.log('🔍 Validating registry...\n');

      const registryJSON = JSON.parse(readFileSync(opts.input, 'utf-8'));

      // Validate the on-disk JSON shape (byId is an object here) against the schema
      const schemaResult = validateSchema(registryJSON);
      if (!schemaResult.success) {
        console.error('❌ Schema validation failed:');
        console.error(schemaResult.error.errors);
        process.exit(1);
      }

      // Reconstruct the in-memory registry (byId as a Map) for endpoint checks
      const registry: BuiltRegistry = {
        version: registryJSON.version,
        lastSync: new Date(registryJSON.lastSync),
        categories: registryJSON.categories,
        byId: new Map(Object.entries(registryJSON.byId)) as Map<string, ToolRegistryEntry>,
      };

      // Validate endpoints
      const result = await validateRegistry(registry, parseInt(opts.sampleSize, 10), opts.verbose);

      if (!result.valid) {
        console.log(`\n⚠️  ${result.errors.length} validation errors`);
        result.errors.slice(0, 5).forEach((e) => {
          console.log(`   ${e.toolId}: ${e.error}`);
        });
      }

      console.log(`\n✅ Validation complete: ${result.tested} endpoints tested`);
      process.exit(result.valid ? 0 : 1);
    } catch (err) {
      console.error('❌ Validation failed:', err);
      process.exit(1);
    }
  });

program
  .command('info')
  .description('Display registry info')
  .option('-i, --input <path>', 'Registry path', DEFAULT_OUTPUT_PATH)
  .action((opts) => {
    try {
      const registryJSON = JSON.parse(readFileSync(opts.input, 'utf-8'));
      const registry: BuiltRegistry = {
        version: registryJSON.version,
        lastSync: new Date(registryJSON.lastSync),
        categories: registryJSON.categories,
        byId: new Map(Object.entries(registryJSON.byId)) as Map<string, ToolRegistryEntry>,
      };

      console.log('\n📊 Registry Info:');
      console.log(`   Version: ${registry.version}`);
      console.log(`   Last Sync: ${registry.lastSync.toISOString()}`);
      console.log(`   Total Tools: ${registry.byId.size}`);
      console.log(`   Categories: ${Object.keys(registry.categories).length}`);

      console.log('\n📂 Categories:');
      Object.entries(registry.categories)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 20)
        .forEach(([cat, stats]) => {
          console.log(`   ${cat}: ${stats.count} tools`);
        });

      console.log();
    } catch (err) {
      console.error('❌ Failed to read registry:', err);
      process.exit(1);
    }
  });

program.parse(process.argv);
