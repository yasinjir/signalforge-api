-- CreateTable
CREATE TABLE "PrdRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "problemStatement" TEXT NOT NULL,
    "goalsText" TEXT NOT NULL,
    "targetUsersText" TEXT NOT NULL,
    "scopeText" TEXT NOT NULL,
    "nonGoalsText" TEXT NOT NULL,
    "successMetricsText" TEXT NOT NULL,
    "risksText" TEXT NOT NULL,
    "openQuestionsText" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PrdRun_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
