/*
  Warnings:

  - You are about to alter the column `display` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `messages` MODIFY `display` JSON NULL;
