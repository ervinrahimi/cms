// Create a schemafull table user with name "users"
DEFINE TABLE users SCHEMAFULL 
    PERMISSIONS
        FOR select, create, update, delete
        FULL; 
// Create id field on users table with assertation string datatype
DEFINE FIELD id ON users TYPE string ASSERT $value != NONE;
// Create display_name field on users table with assertation string datatype
DEFINE FIELD display_name ON users 
    TYPE string 
    ASSERT $value != none;
// Create email field on users table with string with assertation email datatype
DEFINE FIELD email ON users 
    TYPE string 
    ASSERT string::is::email($value);
// Create hashed_password field on users table with assertation string datatype
DEFINE FIELD hashed_password ON users 
    TYPE string 
    ASSERT $value != none;
// Create created_at field on users table with assertation datetime datatype
DEFINE FIELD created_at ON users 
    TYPE datetime;
// Create updated_at field on users table with datetime datatype
DEFINE FIELD updated_at ON users 
    TYPE datetime 
    VALUE time::now();
// Define index email field for unique record
DEFINE INDEX idx_users_email ON users FIELDS email UNIQUE;
// Define index id field for unique record
DEFINE INDEX idx_users_id ON users FIELDS id UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table category with name "categories"
DEFINE TABLE categories SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        FULL;
// Create id field on categories table with assertation string datatype
DEFINE FIELD id ON categories TYPE string ASSERT $value != NONE;
// Create title field on categories table with assertation string datatype
DEFINE FIELD title ON categories 
    TYPE string 
    ASSERT $value != none;
// Create slug field on tags table with assertation string datatype
DEFINE FIELD slug ON categories
    TYPE string 
    ASSERT $value != none;
// Create description field on categories table with assertation string datatype
DEFINE FIELD description ON categories 
    TYPE string 
    ASSERT $value != none;
// Create created_at field on categories table with datetime datatype
DEFINE FIELD created_at ON categories 
    TYPE datetime;
// Create updated_at field on categories table with datetime datatype
DEFINE FIELD updated_at ON categories 
    TYPE datetime 
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_categories_id ON categories FIELDS id UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table tag with name "tags"
DEFINE TABLE tags SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        FULL;
// Create id field on tags table with assertation string datatype
DEFINE FIELD id ON tags TYPE string ASSERT $value != NONE;
// Create slug field on tags table with assertation string datatype
DEFINE FIELD slug ON tags
    TYPE string 
    ASSERT $value != none; 
// Create name field on tags table with assertation string datatype
DEFINE FIELD name ON tags
    TYPE string
    ASSERT $value != none;
// Create created_at field on tags table with datetime datatype
DEFINE FIELD created_at ON tags
    TYPE datetime;
// Create updated_at field on tags table with datetime datatype
DEFINE FIELD updated_at ON tags
    TYPE datetime
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_tags_id ON tags FIELDS id UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table post with name "posts"
DEFINE TABLE posts SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        FULL;
// Create id field on posts table with assertation string datatype
DEFINE FIELD id ON posts TYPE string ASSERT $value != NONE;
// Create title field on posts table with assertation string datatype
DEFINE FIELD title ON posts 
    TYPE string 
    ASSERT $value != none;
// Create content field on posts table with assertation string datatype
DEFINE FIELD content ON posts 
    TYPE string 
    ASSERT $value != none;
// Create slug field on posts table with assertation string datatype
DEFINE FIELD slug ON posts
    TYPE string 
    ASSERT $value != none; 
// Create author field on posts table with assertaion and have relation with users table 
DEFINE FIELD author ON posts
    TYPE record<users>
    ASSERT $value != none;
// Create categories field on posts table with assertation and have relation with categories table
DEFINE FIELD categories ON posts
    TYPE array<record<categories>>;
// Create likes field on posts table with assertation and have relation with likes table
DEFINE FIELD likes ON posts
    TYPE array<record<likes>>;
// Create comments field on posts table with assertation and have relation with comments table
DEFINE FIELD comments ON posts
    TYPE array<record<comments>>;
// Create tags field on posts table with assertation and have relation with tags table
DEFINE FIELD tags ON posts
    TYPE array<record<tags>>;
// Create created_at on posts table with datetime datatype
DEFINE FIELD created_at ON posts 
    TYPE datetime;
// Create updated_at on posts table with datetime datatype
DEFINE FIELD updated_at ON posts 
    TYPE datetime 
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_posts_id ON posts FIELDS id UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table comment with name "comments"
DEFINE TABLE comments SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        FULL;
// Create id field on comments table with assertation string datatype
DEFINE FIELD id On comments TYPE string ASSERT $value != NONE;
// Create post_ref field on comments table with assertation and have relation with posts table
DEFINE FIELD post_ref ON comments
    TYPE record<posts>
    ASSERT $value != none;
// Create user_ref field on comments table with assertation and have relation with users table
DEFINE FIELD user_ref ON comments
    TYPE record<users>
    ASSERT $value != none;
// Create content field on comments table with assertation string datatype
DEFINE FIELD content ON comments
    TYPE string
    ASSERT $value != none;
// Create created_at field on comments table with assertation datetime datatype
DEFINE FIELD created_at ON comments
    TYPE datetime;
// Create updated_at field on comments table with assertation datetime datatype
DEFINE FIELD updated_at ON comments
    TYPE datetime
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_comments_id ON comments FIELDS id UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table like with name "likes"
DEFINE TABLE likes SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        FULL;
// Create id field on likes table with assertation string datatype
DEFINE FIELD id ON likes TYPE string ASSERT $value != NONE;
// Create post_ref field on likes table with assertation and have relation with posts table
DEFINE FIELD post_ref ON likes
    TYPE record<posts>
    ASSERT $value != none;
// Create user_ref field on likes table with assertation and have relation with users table
DEFINE FIELD user_ref ON likes
    TYPE record<users>
    ASSERT $value != none;
// Create created_at fieldn on likes table with datetime datatype
DEFINE FIELD created_at ON likes
    TYPE datetime;
// Define index id field for unique record
DEFINE INDEX idx_likes_id ON likes FIELDS id UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table bookmark with name "bookmarks"
DEFINE TABLE bookmarks SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        FULL;
// Create id field on bookmarks table with assertation string datatype
DEFINE FIELD id ON bookmarks TYPE string ASSERT $value != NONE;
// Create user_ref field on bookmarks table with assertation and have relation with users table
DEFINE FIELD user_ref ON bookmarks
    TYPE record<users>
    ASSERT $value != none;
// Create post_ref field on bookmarks table with assertaion and have relation with posts table
DEFINE FIELD post_ref ON bookmarks
    TYPE record<posts>
    ASSERT $value != none;
// Create created_at field on bookmarks table with datetime datatype
DEFINE FIELD created_at ON bookmarks
    TYPE datetime;
// Define index id field for unique record
DEFINE INDEX idx_bookmarks_id ON bookmarks FIELDS id UNIQUE;