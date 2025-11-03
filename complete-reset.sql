-- Complete reset: Clear all trading history and performance data
-- This resets all agents to $10,000 with zero history

-- Delete all performance tracking data
DELETE FROM "PerformancePoint";

-- Delete all trading decisions
DELETE FROM "Decision";

-- Delete all trades
DELETE FROM "Trade";

-- Delete all positions
DELETE FROM "Position";

-- Reset all agents to $10,000 starting balance
UPDATE "Agent"
SET
  "accountValue" = 10000,
  "cashBalance" = 10000,
  "startingValue" = 10000,
  "lastSyncAt" = NOW();

-- Confirm the reset
SELECT name, broker, "isLive", "accountValue", "cashBalance", "startingValue"
FROM "Agent"
ORDER BY name;
