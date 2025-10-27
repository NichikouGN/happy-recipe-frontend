CREATE DATABASE happy_recipe
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE happy_recipe;

-- Users Table
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    profile_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
	is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Posts Table
CREATE TABLE posts (
    post_id CHAR(8) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cook_time INT, -- in minutes
    servings INT,
    difficulty ENUM('easy', 'medium', 'hard'),
    cover_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    deleted_by BIGINT NULL, -- moderator/admin who deleted
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_is_deleted (is_deleted)
);

-- Ingredients Table
CREATE TABLE ingredients (
    ingredient_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id CHAR(8) NOT NULL,
    item_order INT NOT NULL,
    ingredient_text VARCHAR(500) NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id)
);

-- Steps Table
CREATE TABLE steps (
    step_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id CHAR(8) NOT NULL,
    step_number INT NOT NULL, -- order of step
    step_desciption TEXT NOT NULL,
    image_url VARCHAR(500),
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id)
);

-- Post Edit History Table
CREATE TABLE post_edit_history (
    history_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id CHAR(8) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    cook_time INT,
    servings INT,
    difficulty ENUM('easy', 'medium', 'hard'),
    edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_edited_at (edited_at)
);

-- Reactions/Likes Table
CREATE TABLE reactions (
    reaction_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id CHAR(8) NOT NULL,
    user_id BIGINT NOT NULL,
    reaction_type ENUM('like', 'heart', 'yum') DEFAULT 'like',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_post_reaction (user_id, post_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id)
);

-- Comments Table
CREATE TABLE comments (
    comment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id CHAR(8) NOT NULL,
    user_id BIGINT NOT NULL,
    comment_text TEXT NOT NULL,
    parent_comment_id BIGINT NULL, -- for nested replies
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_comment (parent_comment_id)
);

-- Favorites Table (saved recipes)
CREATE TABLE favorites (
    favorite_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    post_id CHAR(8) NOT NULL,
    -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_post_favorite (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_post_id (post_id)
);

-- Moderators Table
CREATE TABLE moderators (
    moderator_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- created_by BIGINT NULL, -- admin who created this moderator
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Admins Table
CREATE TABLE admins (
    admin_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- User Mod Table
CREATE TABLE user_moderation (
    action_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    moderator_id BIGINT NULL, --
    admin_id BIGINT NULL, --
    action_type ENUM('warning', 'ban') NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (moderator_id) REFERENCES moderators(moderator_id) ON DELETE SET NULL,
    FOREIGN KEY (admin_id) REFERENCES admins(admin_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- Posts and comments Moderation Table
CREATE TABLE post_moderation (
	action_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    moderator_id BIGINT NULL,
    admin_id BIGINT NULL,
    target_type ENUM('post', 'comment') NOT NULL,
    target_post_id CHAR(8) NULL,
    target_comment_id BIGINT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (moderator_id) REFERENCES moderators(moderator_id) ON DELETE SET NULL,
    FOREIGN KEY (admin_id) REFERENCES admins(admin_id) ON DELETE SET NULL,
    FOREIGN KEY (target_post_id) REFERENCES posts(post_id) ON DELETE SET NULL,
    FOREIGN KEY (target_comment_id) REFERENCES comments(comment_id) ON DELETE SET NULL,
    INDEX idx_target_post (target_post_id),
    INDEX idx_target_comment (target_comment_id),
    INDEX idx_created_at (created_at)
);

-- Admin Dashboard Stats
CREATE TABLE dashboard_stats (
    stat_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    stat_date DATE UNIQUE NOT NULL,
    total_users INT DEFAULT 0,
    new_users_today INT DEFAULT 0,
    total_posts INT DEFAULT 0,
    new_posts_today INT DEFAULT 0,
    total_comments INT DEFAULT 0,
    total_reactions INT DEFAULT 0,
    active_bans INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_stat_date (stat_date)
);
