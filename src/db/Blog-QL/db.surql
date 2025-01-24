// Create a schemafull table User with name "User"
DEFINE TABLE User SCHEMAFULL 
    PERMISSIONS
        FOR select, create, update, delete
        WHERE id = $auth.id; 
// Create id field on User table with assertion string datatype
DEFINE FIELD id ON User 
    TYPE string 
    ASSERT $value != NONE;
// Create clerk_id field on User table with assertion string datatype
DEFINE FIELD clerk_id ON User 
    TYPE string 
    ASSERT $value != NONE;
// Create created_at field on User table with assertion datetime datatype
DEFINE FIELD created_at ON User 
    TYPE datetime DEFAULT time::now();
// Create updated_at field on User table with datetime datatype
DEFINE FIELD updated_at ON User 
    TYPE datetime 
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_User_id ON User 
    FIELDS id UNIQUE;
// Define index clerk_id field for unique record
DEFINE INDEX idx_User_clerk_id ON User 
    FIELDS clerk_id UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table category with name "BlogCategory"
DEFINE TABLE BlogCategory SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        WHERE id = $auth.id;
// Create id field on BlogCategory table with assertion string datatype
DEFINE FIELD id ON BlogCategory 
    TYPE string 
    ASSERT $value != NONE;
// Define parent_id field to establish parent-child relationship
DEFINE FIELD parent_id ON BlogCategory 
    TYPE record<BlogCategory>;
// Create title field on BlogCategory table with assertion string datatype
DEFINE FIELD title ON BlogCategory 
    TYPE string 
    ASSERT $value != NONE;
// Create slug field on BlogCategory table with assertion string datatype
DEFINE FIELD slug ON BlogCategory
    TYPE string 
    ASSERT $value != NONE;
// Create description field on BlogCategory table with assertion string datatype
DEFINE FIELD description ON BlogCategory 
    TYPE string 
    ASSERT $value != NONE;
// Create created_at field on BlogCategory table with datetime datatype
DEFINE FIELD created_at ON BlogCategory 
    TYPE datetime DEFAULT time::now();
// Create updated_at field on BlogCategory table with datetime datatype
DEFINE FIELD updated_at ON BlogCategory 
    TYPE datetime 
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_BlogCategory_id ON BlogCategory 
    FIELDS id UNIQUE;
// Define index slug field for unique record
DEFINE INDEX idx_BlogCategory_slug ON BlogCategory 
    FIELDS slug UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table tag with name "BlogTag"
DEFINE TABLE BlogTag SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        WHERE id = $auth.id;
// Create id field on BlogTag table with assertion string datatype
DEFINE FIELD id ON BlogTag 
    TYPE string 
    ASSERT $value != NONE;
// Create slug field on BlogTag table with assertion string datatype
DEFINE FIELD slug ON BlogTag
    TYPE string 
    ASSERT $value != NONE; 
// Create name field on BlogTag table with assertion string datatype
DEFINE FIELD name ON BlogTag
    TYPE string
    ASSERT $value != NONE;
// Create created_at field on BlogTag table with datetime datatype
DEFINE FIELD created_at ON BlogTag
    TYPE datetime DEFAULT time::now();
// Create updated_at field on BlogTag table with datetime datatype
DEFINE FIELD updated_at ON BlogTag
    TYPE datetime
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_BlogTag_id ON BlogTag 
    FIELDS id UNIQUE;
// Define index slug field for unique record
DEFINE INDEX idx_BlogTag_slug ON BlogTag 
    FIELDS slug UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table post with name "BlogPost"
DEFINE TABLE BlogPost SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        WHERE id = $auth.id;
// Create id field on BlogPost table with assertion string datatype
DEFINE FIELD id ON BlogPost 
    TYPE string 
    ASSERT $value != NONE;
// Create title field on BlogPost table with assertion string datatype
DEFINE FIELD title ON BlogPost 
    TYPE string 
    ASSERT $value != NONE;
// Create content field on BlogPost table with assertion string datatype
DEFINE FIELD content ON BlogPost 
    TYPE string 
    ASSERT $value != NONE;
// Create slug field on BlogPost table with assertion string datatype
DEFINE FIELD slug ON BlogPost
    TYPE string 
    ASSERT $value != NONE; 
// Create author field on BlogPost table with assertion and have relation with User table 
DEFINE FIELD author ON BlogPost
    TYPE record<User>
    ASSERT $value != NONE;
// Create categories field on BlogPost table with assertion and have relation with BlogCategory table
DEFINE FIELD categories ON BlogPost
    TYPE array<record<BlogCategory>>;
// Create likes field on BlogPost table with assertion and have relation with BlogLike table
DEFINE FIELD likes ON BlogPost
    TYPE array<record<BlogLike>>;
// Create comments field on BlogPost table with assertion and have relation with BlogComment table
DEFINE FIELD comments ON BlogPost
    TYPE array<record<BlogComment>>;
// Create tags field on BlogPost table with assertion and have relation with BlogTag table
DEFINE FIELD tags ON BlogPost
    TYPE array<record<BlogTag>>;
// Create created_at on BlogPost table with datetime datatype
DEFINE FIELD created_at ON BlogPost 
    TYPE datetime DEFAULT time::now();
// Create updated_at on BlogPost table with datetime datatype
DEFINE FIELD updated_at ON BlogPost 
    TYPE datetime 
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_BlogPost_id ON BlogPost 
    FIELDS id UNIQUE;
// Define index slug field for unique record
DEFINE INDEX idx_BlogPost_slug ON BlogPost 
    FIELDS slug UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table comment with name "BlogComment"
DEFINE TABLE BlogComment SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        WHERE id = $auth.id;
// Create id field on BlogComment table with assertion string datatype
DEFINE FIELD id ON BlogComment 
    TYPE string 
    ASSERT $value != NONE;
// Create post_ref field on BlogComment table with assertion and have relation with BlogPost table
DEFINE FIELD post_ref ON BlogComment
    TYPE record<BlogPost>
    ASSERT $value != NONE;
// Create user_ref field on BlogComment table with assertion and have relation with User table
DEFINE FIELD user_ref ON BlogComment
    TYPE record<User>
    ASSERT $value != NONE;
// Create content field on BlogComment table with assertion string datatype
DEFINE FIELD content ON BlogComment
    TYPE string
    ASSERT $value != NONE;
// Create created_at field on BlogComment table with assertion datetime datatype
DEFINE FIELD created_at ON BlogComment
    TYPE datetime DEFAULT time::now();
// Create updated_at field on BlogComment table with assertion datetime datatype
DEFINE FIELD updated_at ON BlogComment
    TYPE datetime
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_BlogComment_id ON BlogComment 
    FIELDS id UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table like with name "BlogLike"
DEFINE TABLE BlogLike SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        WHERE id = $auth.id;
// Create id field on BlogLike table with assertion string datatype
DEFINE FIELD id ON BlogLike 
    TYPE string 
    ASSERT $value != NONE;
// Create post_ref field on BlogLike table with assertion and have relation with BlogPost table
DEFINE FIELD post_ref ON BlogLike
    TYPE record<BlogPost>
    ASSERT $value != NONE;
// Create user_ref field on BlogLike table with assertion and have relation with User table
DEFINE FIELD user_ref ON BlogLike
    TYPE record<User>
    ASSERT $value != NONE;
// Create created_at field on BlogLike table with datetime datatype
DEFINE FIELD created_at ON BlogLike
    TYPE datetime DEFAULT time::now();
// Define index id field for unique record
DEFINE INDEX idx_likes_id ON BlogLike 
    FIELDS id UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table bookmark with name "BlogBookmark"
DEFINE TABLE BlogBookmark SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        WHERE id = $auth.id;
// Create id field on BlogBookmark table with assertion string datatype
DEFINE FIELD id ON BlogBookmark 
    TYPE string 
    ASSERT $value != NONE;
// Create user_ref field on BlogBookmark table with assertion and have relation with User table
DEFINE FIELD user_ref ON BlogBookmark
    TYPE record<User>
    ASSERT $value != NONE;
// Create post_ref field on BlogBookmark table with assertion and have relation with BlogPost table
DEFINE FIELD post_ref ON BlogBookmark
    TYPE record<BlogPost>
    ASSERT $value != NONE;
// Create created_at field on BlogBookmark table with datetime datatype
DEFINE FIELD created_at ON BlogBookmark
    TYPE datetime DEFAULT time::now();
// Define index id field for unique record
DEFINE INDEX idx_BlogBookmark_id ON BlogBookmark 
    FIELDS id UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table BlogMedia with name "BlogMedia"
DEFINE TABLE BlogMedia SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        WHERE id = $auth.id;
// Create id field on BlogMedia table with assertion string datatype
DEFINE FIELD id ON BlogMedia
    TYPE string
    ASSERT $value != NONE;
// Create post_ref field on BlogMedia table with assertion and have relation with BlogPost table
DEFINE FIELD post_ref ON BlogMedia
    TYPE record<BlogPost>
    ASSERT $value != NONE;
// Create media_url field on BlogMedia table with assertion string datatype
DEFINE FIELD media_url ON BlogMedia
    TYPE array<string>
    ASSERT $value != NONE;
// Create media_type field on BlogMedia table with assertion string datatype
DEFINE FIELD media_type ON BlogMedia
    TYPE string
    ASSERT $value IN ["image", "video"];
// Create created_at field on BlogMedia table with datetime datatype
DEFINE FIELD created_at ON BlogMedia
    TYPE datetime
    DEFAULT time::now();
// Create updated_at field on BlogMedia table with datetime datatype
DEFINE FIELD updated_at ON BlogMedia
    TYPE datetime
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_BlogMedia_id ON BlogMedia
    FIELDS id UNIQUE;