-- Add live trading fields to Agent table
ALTER TABLE "Agent"
  ADD COLUMN IF NOT EXISTS "isLive" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "alpacaAccountId" TEXT,
  ADD COLUMN IF NOT EXISTS "lastSyncAt" TIMESTAMP(3);

-- Add comment
COMMENT ON COLUMN "Agent"."isLive" IS 'True if trading via Alpaca';
COMMENT ON COLUMN "Agent"."alpacaAccountId" IS 'Alpaca account identifier';
COMMENT ON COLUMN "Agent"."lastSyncAt" IS 'Last sync with Alpaca';
