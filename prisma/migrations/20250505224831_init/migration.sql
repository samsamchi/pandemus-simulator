-- CreateTable
CREATE TABLE "Simulation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "days" INTEGER NOT NULL DEFAULT 100,
    "infected" DOUBLE PRECISION[],
    "dead" DOUBLE PRECISION[],
    "recovered" DOUBLE PRECISION[],

    CONSTRAINT "Simulation_pkey" PRIMARY KEY ("id")
);
