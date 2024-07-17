/*
  Warnings:

  - You are about to drop the column `currentToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "currentToken",
ADD COLUMN     "refreshToken" TEXT;
