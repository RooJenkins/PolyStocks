-- Add Alpha Arena columns to Position table
ALTER TABLE "Position" ADD COLUMN IF NOT EXISTS "targetPrice" DOUBLE PRECISION;
ALTER TABLE "Position" ADD COLUMN IF NOT EXISTS "stopLoss" DOUBLE PRECISION;
ALTER TABLE "Position" ADD COLUMN IF NOT EXISTS "invalidationCondition" TEXT;
ALTER TABLE "Position" ADD COLUMN IF NOT EXISTS "entryDecisionId" TEXT;

-- Add Alpha Arena columns to Trade table
ALTER TABLE "Trade" ADD COLUMN IF NOT EXISTS "exitReason" TEXT;
ALTER TABLE "Trade" ADD COLUMN IF NOT EXISTS "decisionId" TEXT;

-- Add Alpha Arena column to Decision table
ALTER TABLE "Decision" ADD COLUMN IF NOT EXISTS "invalidationCondition" TEXT;
