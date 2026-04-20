git commit -m "Initial commit"-- CreateTable
CREATE TABLE "ProblemExample" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "explanation" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProblemExample_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProblemExample_problemId_idx" ON "ProblemExample"("problemId");

-- AddForeignKey
ALTER TABLE "ProblemExample" ADD CONSTRAINT "ProblemExample_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
