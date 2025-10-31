-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "accountValue" DOUBLE PRECISION NOT NULL DEFAULT 10000,
    "cashBalance" DOUBLE PRECISION NOT NULL DEFAULT 10000,
    "startingValue" DOUBLE PRECISION NOT NULL DEFAULT 10000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "side" TEXT NOT NULL DEFAULT 'LONG',
    "quantity" DOUBLE PRECISION NOT NULL,
    "entryPrice" DOUBLE PRECISION NOT NULL,
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "unrealizedPnL" DOUBLE PRECISION NOT NULL,
    "unrealizedPnLPercent" DOUBLE PRECISION NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "realizedPnL" DOUBLE PRECISION,
    "reasoning" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Decision" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "portfolioValue" DOUBLE PRECISION NOT NULL,
    "cashBalance" DOUBLE PRECISION NOT NULL,
    "action" TEXT NOT NULL,
    "symbol" TEXT,
    "quantity" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION NOT NULL,
    "reasoning" TEXT NOT NULL,
    "riskAssessment" TEXT NOT NULL,
    "targetPrice" DOUBLE PRECISION,
    "stopLoss" DOUBLE PRECISION,
    "marketDataSnapshot" TEXT NOT NULL,

    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformancePoint" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountValue" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PerformancePoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockPrice" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "change" DOUBLE PRECISION NOT NULL,
    "changePercent" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "symbols" TEXT NOT NULL,
    "sentiment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Position_agentId_idx" ON "Position"("agentId");

-- CreateIndex
CREATE INDEX "Trade_agentId_idx" ON "Trade"("agentId");

-- CreateIndex
CREATE INDEX "Trade_timestamp_idx" ON "Trade"("timestamp");

-- CreateIndex
CREATE INDEX "Decision_agentId_idx" ON "Decision"("agentId");

-- CreateIndex
CREATE INDEX "Decision_timestamp_idx" ON "Decision"("timestamp");

-- CreateIndex
CREATE INDEX "PerformancePoint_agentId_idx" ON "PerformancePoint"("agentId");

-- CreateIndex
CREATE INDEX "PerformancePoint_timestamp_idx" ON "PerformancePoint"("timestamp");

-- CreateIndex
CREATE INDEX "StockPrice_symbol_idx" ON "StockPrice"("symbol");

-- CreateIndex
CREATE INDEX "StockPrice_timestamp_idx" ON "StockPrice"("timestamp");

-- CreateIndex
CREATE INDEX "NewsItem_publishedAt_idx" ON "NewsItem"("publishedAt");

-- CreateIndex
CREATE INDEX "NewsItem_symbols_idx" ON "NewsItem"("symbols");

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformancePoint" ADD CONSTRAINT "PerformancePoint_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
