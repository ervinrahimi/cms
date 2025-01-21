// Create a schemafull table User with name "User"
DEFINE TABLE User SCHEMAFULL 
    PERMISSIONS
        FOR select, create, update, delete
        FULL; 
// Create id field on User table with assertation string datatype
DEFINE FIELD id ON User TYPE string ASSERT $value != NONE;
// Create clerk_id field on User table with assertation string datatype
DEFINE FIELD clerk_id ON User TYPE string ASSERT $value != NONE;
// Create created_at field on User table with assertation datetime datatype
DEFINE FIELD created_at ON User 
    TYPE datetime;
// Create updated_at field on User table with datetime datatype
DEFINE FIELD updated_at ON User 
    TYPE datetime 
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_User_id ON User FIELDS id UNIQUE;
// Define index clerk_id field for unique record
DEFINE INDEX idx_User_clerk_id ON User FIELDS clerk_id UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table category with name "BlogCategory"
DEFINE TABLE BlogCategory SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        FULL;
// Create id field on BlogCategory table with assertation string datatype
DEFINE FIELD id ON BlogCategory TYPE string ASSERT $value != NONE;
// Create title field on BlogCategory table with assertation string datatype
DEFINE FIELD title ON BlogCategory 
    TYPE string 
    ASSERT $value != none;
// Create slug field on BlogCategory table with assertation string datatype
DEFINE FIELD slug ON BlogCategory
    TYPE string 
    ASSERT $value != none;
// Create description field on BlogCategory table with assertation string datatype
DEFINE FIELD description ON BlogCategory 
    TYPE string 
    ASSERT $value != none;
// Create created_at field on BlogCategory table with datetime datatype
DEFINE FIELD created_at ON BlogCategory 
    TYPE datetime;
// Create updated_at field on BlogCategory table with datetime datatype
DEFINE FIELD updated_at ON BlogCategory 
    TYPE datetime 
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_BlogCategory_id ON BlogCategory FIELDS id UNIQUE;
// Define index slug field for unique record
DEFINE INDEX idx_BlogCategory_slug ON BlogCategory FIELDS slug UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table tag with name "BlogTag"
DEFINE TABLE BlogTag SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        FULL;
// Create id field on BlogTag table with assertation string datatype
DEFINE FIELD id ON BlogTag TYPE string ASSERT $value != NONE;
// Create slug field on BlogTag table with assertation string datatype
DEFINE FIELD slug ON BlogTag
    TYPE string 
    ASSERT $value != none; 
// Create name field on BlogTag table with assertation string datatype
DEFINE FIELD name ON BlogTag
    TYPE string
    ASSERT $value != none;
// Create created_at field on BlogTag table with datetime datatype
DEFINE FIELD created_at ON BlogTag
    TYPE datetime;
// Create updated_at field on BlogTag table with datetime datatype
DEFINE FIELD updated_at ON BlogTag
    TYPE datetime
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_BlogTag_id ON BlogTag FIELDS id UNIQUE;
// Define index slug field for unique record
DEFINE INDEX idx_BlogTag_slug ON BlogTag FIELDS slug UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table post with name "BlogPost"
DEFINE TABLE BlogPost SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        FULL;
// Create id field on BlogPost table with assertation string datatype
DEFINE FIELD id ON BlogPost TYPE string ASSERT $value != NONE;
// Create title field on BlogPost table with assertation string datatype
DEFINE FIELD title ON BlogPost 
    TYPE string 
    ASSERT $value != none;
// Create content field on BlogPost table with assertation string datatype
DEFINE FIELD content ON BlogPost 
    TYPE string 
    ASSERT $value != none;
// Create slug field on BlogPost table with assertation string datatype
DEFINE FIELD slug ON BlogPost
    TYPE string 
    ASSERT $value != none; 
// Create author field on BlogPost table with assertaion and have relation with User table 
DEFINE FIELD author ON BlogPost
    TYPE record<User>
    ASSERT $value != none;
// Create categories field on BlogPost table with assertation and have relation with BlogCategory table
DEFINE FIELD categories ON BlogPost
    TYPE array<record<BlogCategory>>;
// Create likes field on BlogPost table with assertation and have relation with BlogLike table
DEFINE FIELD likes ON BlogPost
    TYPE array<record<BlogLike>>;
// Create comments field on BlogPost table with assertation and have relation with BlogComment table
DEFINE FIELD comments ON BlogPost
    TYPE array<record<BlogComment>>;
// Create tags field on BlogPost table with assertation and have relation with BlogTag table
DEFINE FIELD tags ON BlogPost
    TYPE array<record<BlogTag>>;
// Create created_at on BlogPost table with datetime datatype
DEFINE FIELD created_at ON BlogPost 
    TYPE datetime;
// Create updated_at on BlogPost table with datetime datatype
DEFINE FIELD updated_at ON BlogPost 
    TYPE datetime 
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_BlogPost_id ON BlogPost FIELDS id UNIQUE;
// Define index slug field for unique record
DEFINE INDEX idx_BlogPost_slug ON BlogPost FIELDS slug UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table comment with name "BlogComment"
DEFINE TABLE BlogComment SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        FULL;
// Create id field on BlogComment table with assertation string datatype
DEFINE FIELD id On BlogComment TYPE string ASSERT $value != NONE;
// Create post_ref field on BlogComment table with assertation and have relation with BlogPost table
DEFINE FIELD post_ref ON BlogComment
    TYPE record<BlogPost>
    ASSERT $value != none;
// Create user_ref field on BlogComment table with assertation and have relation with User table
DEFINE FIELD user_ref ON BlogComment
    TYPE record<User>
    ASSERT $value != none;
// Create content field on BlogComment table with assertation string datatype
DEFINE FIELD content ON BlogComment
    TYPE string
    ASSERT $value != none;
// Create created_at field on BlogComment table with assertation datetime datatype
DEFINE FIELD created_at ON BlogComment
    TYPE datetime;
// Create updated_at field on BlogComment table with assertation datetime datatype
DEFINE FIELD updated_at ON BlogComment
    TYPE datetime
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_BlogComment_id ON BlogComment FIELDS id UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table like with name "BlogLike"
DEFINE TABLE BlogLike SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        FULL;
// Create id field on BlogLike table with assertation string datatype
DEFINE FIELD id ON BlogLike TYPE string ASSERT $value != NONE;
// Create post_ref field on BlogLike table with assertation and have relation with BlogPost table
DEFINE FIELD post_ref ON BlogLike
    TYPE record<BlogPost>
    ASSERT $value != none;
// Create user_ref field on BlogLike table with assertation and have relation with User table
DEFINE FIELD user_ref ON BlogLike
    TYPE record<User>
    ASSERT $value != none;
// Create created_at field on BlogLike table with datetime datatype
DEFINE FIELD created_at ON BlogLike
    TYPE datetime;
// Define index id field for unique record
DEFINE INDEX idx_likes_id ON BlogLike FIELDS id UNIQUE;

// ----------------------------------------------------------------------------------------

// Create a schemafull table bookmark with name "BlogBookmark"
DEFINE TABLE BlogBookmark SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
        FULL;
// Create id field on BlogBookmark table with assertation string datatype
DEFINE FIELD id ON BlogBookmark TYPE string ASSERT $value != NONE;
// Create user_ref field on BlogBookmark table with assertation and have relation with User table
DEFINE FIELD user_ref ON BlogBookmark
    TYPE record<User>
    ASSERT $value != none;
// Create post_ref field on BlogBookmark table with assertaion and have relation with BlogPost table
DEFINE FIELD post_ref ON BlogBookmark
    TYPE record<BlogPost>
    ASSERT $value != none;
// Create created_at field on BlogBookmark table with datetime datatype
DEFINE FIELD created_at ON BlogBookmark
    TYPE datetime;
// Define index id field for unique record
DEFINE INDEX idx_BlogBookmark_id ON BlogBookmark FIELDS id UNIQUE;