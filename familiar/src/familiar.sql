create database if not exists Familiar;
use Familiar;

-- Users table (giữ nguyên như cũ)
CREATE TABLE users
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    first_name          VARCHAR(50)         NOT NULL,
    last_name           VARCHAR(50)         NOT NULL,
    email               VARCHAR(100) UNIQUE NOT NULL,
    profile_picture_url VARCHAR(255),
    bio                 TEXT,
    date_of_birth       DATE,
    gender              VARCHAR(10),
    occupation          VARCHAR(30),
    address             VARCHAR(100),
    is_deleted          BOOLEAN   DEFAULT FALSE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Accounts table (giữ nguyên như cũ)
CREATE TABLE accounts
(
    id    INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT                ,
    username      VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255)       NOT NULL,
    is_active     BOOLEAN                            DEFAULT TRUE,
    status        enum ('normal','warned','blocked') DEFAULT 'normal',
    lock_time     TIMESTAMP                          DEFAULT NULL,
    is_deleted    BOOLEAN                            DEFAULT FALSE,
    last_login    TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Roles table (giữ nguyên như cũ)
CREATE TABLE roles
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(20) UNIQUE NOT NULL
);

-- Account_Roles table (giữ nguyên như cũ)
CREATE TABLE account_roles
(
    id int auto_increment primary key,
    account_id INT NOT NULL,
    role_id    INT NOT NULL,

    FOREIGN KEY (account_id) REFERENCES accounts (id),
    FOREIGN KEY (role_id) REFERENCES roles (id)
);


-- Icons table (mới)
CREATE TABLE icons
(
    id    INT AUTO_INCREMENT PRIMARY KEY,
    icon_url   VARCHAR(255) NOT NULL,
    icon_name  VARCHAR(50)  NOT NULL,
    icon_type  VARCHAR(20)  NOT NULL,
    is_deleted BOOLEAN   DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Posts table (cập nhật)
CREATE TABLE posts
(
    id    INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    content    TEXT,
    is_deleted BOOLEAN   DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Post_Icons table (mới)
CREATE TABLE post_icons
(
    id int auto_increment primary key,
    post_id INT NOT NULL,
    icon_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts (id),
    FOREIGN KEY (icon_id) REFERENCES icons (id)
);

-- Attachments table (giữ nguyên như cũ)
CREATE TABLE attachments
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id       INT          NOT NULL,
    file_url      VARCHAR(255) NOT NULL,
    file_name     VARCHAR(255) NOT NULL,
    file_type     VARCHAR(100),
    file_size     INT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
);

-- Comments table (cập nhật)
CREATE TABLE comments
(
    id        INT AUTO_INCREMENT PRIMARY KEY,
    post_id           INT  NOT NULL,
    user_id           INT  NOT NULL,
    parent_comment_id INT,
    content           TEXT NOT NULL,
    level             INT       DEFAULT 0,
    is_deleted        BOOLEAN   DEFAULT FALSE,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (parent_comment_id) REFERENCES comments (id)
);

-- Comment_Icons table (mới)
CREATE TABLE comment_icons
(
    id int auto_increment primary key,
    comment_id INT NOT NULL,
    icon_id    INT NOT NULL,
    FOREIGN KEY (comment_id) REFERENCES comments (id),
    FOREIGN KEY (icon_id) REFERENCES icons (id)
);

-- Likes table (cập nhật)
CREATE TABLE likes
(
    id    INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    post_id    INT,
    comment_id INT,
    icon_id    INT,
    is_active  BOOLEAN   DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (post_id) REFERENCES posts (id),
    FOREIGN KEY (comment_id) REFERENCES comments (id),
    FOREIGN KEY (icon_id) REFERENCES icons (id),
    UNIQUE KEY unique_like_post (user_id, post_id),
    UNIQUE KEY unique_like_comment (user_id, comment_id)
);

-- Friendships table (giữ nguyên như cũ)
CREATE TABLE friendships
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id1      INT NOT NULL,
    user_id2      INT NOT NULL,
    is_deleted    BOOLEAN   DEFAULT FALSE,
    is_accepted   BOOLEAN   DEFAULT FALSE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id1) REFERENCES users (id),
    FOREIGN KEY (user_id2) REFERENCES users (id),
    UNIQUE KEY unique_friendship (user_id1, user_id2)
);


-- Messages table (cập nhật)
CREATE TABLE messages
(
    id     INT AUTO_INCREMENT PRIMARY KEY,
    sender_user_id INT  NOT NULL,
    receiver_user_id INT  NOT NULL,
    content        TEXT NOT NULL,
    message_type   VARCHAR(20) DEFAULT 'TEXT',
    is_read        BOOLEAN     DEFAULT FALSE,
    is_deleted     BOOLEAN     DEFAULT FALSE,
    created_at     TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (receiver_user_id) REFERENCES users (id),
    FOREIGN KEY (sender_user_id) REFERENCES users (id)
);

-- Message_Icons table (mới)
CREATE TABLE message_icons
(
    id int primary key auto_increment,
    message_id INT NOT NULL,
    icon_id    INT NOT NULL,
    FOREIGN KEY (message_id) REFERENCES messages (id),
    FOREIGN KEY (icon_id) REFERENCES icons (id)
);

# -- Denunciation Categories table (giữ nguyên như cũ)
# CREATE TABLE denunciation_categories
    # (
          #     id         INT AUTO_INCREMENT PRIMARY KEY,
          #     name       VARCHAR(50) UNIQUE NOT NULL,
    #     is_deleted BOOLEAN DEFAULT FALSE
    # );
#
# -- Punishments table (giữ nguyên như cũ)
# CREATE TABLE punishments
    # (
          #     id                         INT AUTO_INCREMENT PRIMARY KEY,
          #     user_id_denounce           INT          NOT NULL,
          #     content                    VARCHAR(255) NOT NULL,
    #     created_at                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    #     user_id_accused            INT       default NULL,
    #     denunciation_categories_id INT          NOT NULL,
    #     is_deleted                 BOOLEAN   DEFAULT FALSE,
    #     FOREIGN KEY (user_id_denounce) REFERENCES users (user_id),
    #     FOREIGN KEY (user_id_accused) REFERENCES users (user_id),
    #     FOREIGN KEY (denunciation_categories_id) REFERENCES denunciation_categories (id)
    # );

select roles.role_name from accounts
                                join account_roles on accounts.id = account_roles.account_id
                                join roles on account_roles.role_id = roles.id
where accounts.id =10;

-- Thêm các vai trò mặc định (giữ nguyên như cũ)
INSERT INTO roles (role_name)
VALUES ('USER'),
       ('ADMIN');

-- Thêm dữ liệu vào bảng users
INSERT INTO users (first_name, last_name, email, profile_picture_url, bio, date_of_birth, gender, occupation, address)
VALUES
    ('John', 'Doe', 'john.doe@example.com', 'http://example.com/john.jpg', 'I am John', '1990-01-01', 'Male', 'Developer', '123 Main St'),
    ('Jane', 'Smith', 'jane.smith@example.com', 'http://example.com/jane.jpg', 'I am Jane', '1992-05-15', 'Female', 'Designer', '456 Elm St'),
    ('Mike', 'Johnson', 'mike.johnson@example.com', 'http://example.com/mike.jpg', 'I am Mike', '1988-09-30', 'Male', 'Manager', '789 Oak St');

-- Thêm dữ liệu vào bảng accounts
INSERT INTO accounts ( user_id,username, password_hash)
VALUES
    ( 1,'admin', '$2a$10$TAiGrWHCzOq5WJDtYDODZOzVxXvnTzCGwNxJ6xTvVN8f/kpQm0pDO'),
    ( 2,'user', '$2a$10$TAiGrWHCzOq5WJDtYDODZOzVxXvnTzCGwNxJ6xTvVN8f/kpQm0pDO'),
    ( 2,'user2', '$2a$10$TAiGrWHCzOq5WJDtYDODZOzVxXvnTzCGwNxJ6xTvVN8f/kpQm0pDO');

-- Thêm dữ liệu vào bảng account_roles
INSERT INTO account_roles (account_id, role_id)
VALUES
    (1, 1), -- John Doe as USER
    (2, 1), -- Jane Smith as USER
    (3, 2); -- Mike Johnson as ADMIN

-- Thêm dữ liệu vào bảng posts
INSERT INTO posts (user_id, content)
VALUES
    (1, 'This is my first post!'),
    (2, 'Hello world from Jane!'),
    (3, 'Greetings from the admin!');

-- Thêm dữ liệu vào bảng comments
INSERT INTO comments (post_id, user_id, content)
VALUES
    (1, 2, 'Great first post, John!'),
    (2, 3, 'Welcome, Jane!'),
    (3, 1, 'Thanks for the update, admin!');

-- Thêm dữ liệu vào bảng friendships
INSERT INTO friendships (user_id1, user_id2, is_accepted)
VALUES
    (1, 2, TRUE),
    (1, 3, FALSE),
    (2, 3, TRUE);

-- Thêm dữ liệu vào bảng messages
INSERT INTO messages (sender_user_id, receiver_user_id, content)
VALUES
    (1, 2, 'Hey Jane, how are you?'),
    (2, 1, 'Hi John, Im doing great!'),
    (3, 1, 'Hello John, this is an admin message.');

-- Thêm dữ liệu vào bảng icons
INSERT INTO icons (icon_url, icon_name, icon_type)
VALUES
    ('http://example.com/like.png', 'Like', 'Reaction'),
    ('http://example.com/heart.png', 'Heart', 'Reaction'),
    ('http://example.com/laugh.png', 'Laugh', 'Reaction');

-- Thêm dữ liệu vào bảng likes
INSERT INTO likes (user_id, post_id, icon_id)
VALUES
    (1, 2, 1), -- John likes Jane's post with a Like icon
    (2, 1, 2), -- Jane likes John's post with a Heart icon
    (3, 1, 3); -- Admin likes John's post with a Laugh icon

