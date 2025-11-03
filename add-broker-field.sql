-- Add broker field to Agent table for multi-broker support
ALTER TABLE "Agent"
  ADD COLUMN IF NOT EXISTS "broker" TEXT NOT NULL DEFAULT 'simulation';

-- Update comment for lastSyncAt to reflect multi-broker
COMMENT ON COLUMN "Agent"."lastSyncAt" IS 'Last sync with broker (not just Alpaca)';

-- Update comments for deprecated fields
COMMENT ON COLUMN "Agent"."isLive" IS 'DEPRECATED: Use broker field instead. True if broker != simulation';
COMMENT ON COLUMN "Agent"."alpacaAccountId" IS 'DEPRECATED: Broker-specific identifier';

-- Set broker values based on agent names
-- Top 3 AI models get Alpaca paper trading (3 account limit)
-- Others use simulation
UPDATE "Agent"
SET "broker" = CASE
  WHEN "name" = 'DeepSeek' THEN 'alpaca'        -- Alpaca Paper Account #1
  WHEN "name" = 'GPT-4o Mini' THEN 'alpaca'     -- Alpaca Paper Account #2
  WHEN "name" = 'Claude Haiku' THEN 'alpaca'    -- Alpaca Paper Account #3
  WHEN "name" = 'Grok' THEN 'simulation'        -- Simulation
  WHEN "name" = 'Gemini Flash' THEN 'simulation' -- Simulation
  WHEN "name" = 'Qwen' THEN 'simulation'        -- Simulation
  ELSE 'simulation'
END;

-- Update isLive to match broker field
UPDATE "Agent"
SET "isLive" = CASE
  WHEN "broker" = 'simulation' THEN false
  ELSE true
END;
