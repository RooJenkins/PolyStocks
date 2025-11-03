-- Reset all agents to $10,000 and clear trading history
-- This gives everyone a fresh start with the multi-broker setup

-- Delete all trades
DELETE FROM "Trade";

-- Delete all positions
DELETE FROM "Position";

-- Delete all safety violations
DELETE FROM "SafetyViolation";

-- Reset all agents to $10,000 starting balance
UPDATE "Agent"
SET
  "accountValue" = 10000,
  "cashBalance" = 10000,
  "lastSyncAt" = NOW();

-- Confirm the reset
SELECT name, broker, "isLive", "accountValue", "cashBalance"
FROM "Agent"
ORDER BY name;
