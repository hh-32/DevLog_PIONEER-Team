/*
  Warnings:

  - A unique constraint covering the columns `[githubId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `githubId` VARCHAR(191) NULL,
    ADD COLUMN `githubRepo` VARCHAR(191) NULL,
    ADD COLUMN `githubToken` TEXT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_githubId_key` ON `User`(`githubId`);
