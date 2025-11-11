/**
 * Script to add AI strategy selection fields to Decision table
 * Runs SQL migration manually to avoid schema drift issues
 */

import { prisma } from '../lib/prisma';

async function addStrategyFields() {
  try {
    console.log('📝 Adding AI strategy selection fields to Decision table...\n');

    // Add columns using raw SQL (safe - uses IF NOT EXISTS)
    await prisma.$executeRaw`
      ALTER TABLE "Decision"
      ADD COLUMN IF NOT EXISTS "chosenStrategy" TEXT,
      ADD COLUMN IF NOT EXISTS "strategyReasoning" TEXT,
      ADD COLUMN IF NOT EXISTS "strategyConfidence" DOUBLE PRECISION,
      ADD COLUMN IF NOT EXISTS "alternativeStrategy" TEXT
    `;

    console.log('✅ Successfully added strategy selection fields!');
    console.log('\nNew fields:');
    console.log('  • chosenStrategy: TEXT (the strategy AI selected)');
    console.log('  • strategyReasoning: TEXT (why AI chose this strategy)');
    console.log('  • strategyConfidence: FLOAT (confidence in strategy 0-1)');
    console.log('  • alternativeStrategy: TEXT (backup strategy considered)\n');

    // Verify columns were added
    const result = await prisma.$queryRaw<any[]>`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'Decision'
      AND column_name IN ('chosenStrategy', 'strategyReasoning', 'strategyConfidence', 'alternativeStrategy')
    `;

    console.log('✓ Verified columns in database:');
    result.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });

  } catch (error) {
    console.error('❌ Error adding strategy fields:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addStrategyFields();
