-- CreateTable
CREATE TABLE `view_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(50) NOT NULL,
    `view_settings` VARCHAR(1000) NULL,

    UNIQUE INDEX `view_settings_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
