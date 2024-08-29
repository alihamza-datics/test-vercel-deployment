-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `Messages_threadId_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `Products_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `threads` DROP FOREIGN KEY `Threads_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Threads` ADD CONSTRAINT `Threads_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_threadId_fkey` FOREIGN KEY (`threadId`) REFERENCES `Threads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
