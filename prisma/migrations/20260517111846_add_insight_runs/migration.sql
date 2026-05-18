-- CreateTable
CREATE TABLE "InsightRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "summary" TEXT NOT NULL,
    "themesJson" TEXT NOT NULL,
    "painPointsJson" TEXT NOT NULL,
    "featureRequestsJson" TEXT NOT NULL,
    "repeatedSignalsJson" TEXT NOT NULL,
    "priorityCuesJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InsightRun_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
