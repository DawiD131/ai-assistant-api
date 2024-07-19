-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversation" JSONB NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
