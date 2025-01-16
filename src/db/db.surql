-- جدول کاربران موقت
DEFINE TABLE user SCHEMAFULL;

DEFINE FIELD id         ON user TYPE string ASSERT $value != none; -- شناسه یکتا
DEFINE FIELD name       ON user TYPE string ASSERT $value != none AND string::len($value) >= 3; -- نام کاربر
DEFINE FIELD email      ON user TYPE string ASSERT $value != none AND string::is::email($value); -- ایمیل کاربر
DEFINE FIELD createdAt  ON user TYPE datetime VALUE time::now();
DEFINE FIELD updatedAt  ON user TYPE datetime VALUE time::now();

-- ایندکس‌ها
DEFINE INDEX idx_user_id    ON user COLUMNS id UNIQUE;
DEFINE INDEX idx_user_email ON user COLUMNS email UNIQUE;

-- جدول پست‌ها
DEFINE TABLE post SCHEMAFULL;

DEFINE FIELD id           ON post TYPE string ASSERT $value != none;
DEFINE FIELD title        ON post TYPE string ASSERT $value != none AND string::len($value) >= 5; -- عنوان پست
DEFINE FIELD content      ON post TYPE string ASSERT $value != none; -- محتوای پست
DEFINE FIELD authorId     ON post TYPE string ASSERT $value != none; -- شناسه کاربر نویسنده
DEFINE FIELD createdAt    ON post TYPE datetime VALUE time::now();
DEFINE FIELD updatedAt    ON post TYPE datetime VALUE time::now();

-- ایندکس‌ها
DEFINE INDEX idx_post_id ON post COLUMNS id UNIQUE;

-- جدول نظرات
DEFINE TABLE comment SCHEMAFULL;

DEFINE FIELD id           ON comment TYPE string ASSERT $value != none;
DEFINE FIELD content      ON comment TYPE string ASSERT $value != none; -- محتوای نظر
DEFINE FIELD authorId     ON comment TYPE string ASSERT $value != none; -- شناسه کاربر نویسنده
DEFINE FIELD postId       ON comment TYPE string ASSERT $value != none; -- شناسه پست مربوطه
DEFINE FIELD createdAt    ON comment TYPE datetime VALUE time::now();
DEFINE FIELD updatedAt    ON comment TYPE datetime VALUE time::now();

-- ایندکس‌ها
DEFINE INDEX idx_comment_id ON comment COLUMNS id UNIQUE;

-- جدول دسته‌بندی‌ها
DEFINE TABLE category SCHEMAFULL;

DEFINE FIELD id           ON category TYPE string ASSERT $value != none;
DEFINE FIELD name         ON category TYPE string ASSERT $value != none AND string::len($value) >= 3; -- نام دسته‌بندی
DEFINE FIELD slug         ON category TYPE string ASSERT $value != none; -- نام یکتا برای دسته‌بندی
DEFINE FIELD createdAt    ON category TYPE datetime VALUE time::now();
DEFINE FIELD updatedAt    ON category TYPE datetime VALUE time::now();

-- ایندکس‌ها
DEFINE INDEX idx_category_id ON category COLUMNS id UNIQUE;
DEFINE INDEX idx_category_slug ON category COLUMNS slug UNIQUE;

-- جدول تگ‌ها
DEFINE TABLE tag SCHEMAFULL;

DEFINE FIELD id           ON tag TYPE string ASSERT $value != none;
DEFINE FIELD name         ON tag TYPE string ASSERT $value != none AND string::len($value) >= 3; -- نام تگ
DEFINE FIELD createdAt    ON tag TYPE datetime VALUE time::now();
DEFINE FIELD updatedAt    ON tag TYPE datetime VALUE time::now();

-- ایندکس‌ها
DEFINE INDEX idx_tag_id ON tag COLUMNS id UNIQUE;