-- DropIndex
DROP INDEX `view_settings_user_id_key` ON `view_settings`;

-- AlterTable
ALTER TABLE `view_settings` ADD COLUMN `view_type` CHAR(1) NULL;
