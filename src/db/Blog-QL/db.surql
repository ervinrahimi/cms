/* -- User Table --

This table stores user information. Each user has a unique ID and a clerk ID.
The table also tracks the creation and update timestamps. */

DEFINE TABLE User SCHEMAFULL 
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON User TYPE string ASSERT $value != NONE;
DEFINE FIELD clerk_id ON User TYPE string ASSERT $value != NONE;
DEFINE FIELD created_at ON User TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON User TYPE datetime VALUE time::now();

DEFINE INDEX idx_User_id ON User FIELDS id UNIQUE;
DEFINE INDEX idx_User_clerk_id ON User FIELDS clerk_id UNIQUE;

/* -- BlogCategory Table --

This table stores blog categories. Each category has a unique ID, a title, and a slug.
The table also tracks the creation and update timestamps and supports parent-child relationships. */

DEFINE TABLE BlogCategory SCHEMAFULL
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON BlogCategory TYPE string ASSERT $value != NONE;
DEFINE FIELD parent_id ON BlogCategory TYPE option<record<BlogCategory>> ASSERT $value == NONE;
DEFINE FIELD title ON BlogCategory TYPE string ASSERT $value != NONE;
DEFINE FIELD slug ON BlogCategory TYPE string ASSERT $value != NONE;
DEFINE FIELD description ON BlogCategory TYPE string ASSERT $value != NONE;
DEFINE FIELD created_at ON BlogCategory TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON BlogCategory TYPE datetime VALUE time::now();

DEFINE INDEX idx_BlogCategory_id ON BlogCategory FIELDS id UNIQUE;
DEFINE INDEX idx_BlogCategory_slug ON BlogCategory FIELDS slug UNIQUE;

/* -- BlogTag Table --

This table stores blog tags. Each tag has a unique ID, a name, and a slug.
The table also tracks the creation and update timestamps. */

DEFINE TABLE BlogTag SCHEMAFULL
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON BlogTag TYPE string ASSERT $value != NONE;
DEFINE FIELD slug ON BlogTag TYPE string ASSERT $value != NONE;
DEFINE FIELD name ON BlogTag TYPE string ASSERT $value != NONE;
DEFINE FIELD created_at ON BlogTag TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON BlogTag TYPE datetime VALUE time::now();

DEFINE INDEX idx_BlogTag_id ON BlogTag FIELDS id UNIQUE;
DEFINE INDEX idx_BlogTag_slug ON BlogTag FIELDS slug UNIQUE;

/* -- BlogPost Table --

This table stores blog posts. Each post has a unique ID, a title, content, and a slug.
The table also tracks the creation and update timestamps and supports relationships with users, categories, likes, comments, and tags. */

DEFINE TABLE BlogPost SCHEMAFULL
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON BlogPost TYPE string ASSERT $value != NONE;
DEFINE FIELD title ON BlogPost TYPE string ASSERT $value != NONE;
DEFINE FIELD content ON BlogPost TYPE string ASSERT $value != NONE;
DEFINE FIELD slug ON BlogPost TYPE string ASSERT $value != NONE;
DEFINE FIELD image ON BlogPost TYPE string ASSERT $value == NONE;
DEFINE FIELD author ON BlogPost TYPE record<User> ASSERT $value != NONE;
DEFINE FIELD categories ON BlogPost TYPE array<record<BlogCategory>>;
DEFINE FIELD likes ON BlogPost TYPE array<record<BlogLike>>;
DEFINE FIELD comments ON BlogPost TYPE array<record<BlogComment>>;
DEFINE FIELD tags ON BlogPost TYPE array<record<BlogTag>>;
DEFINE FIELD created_at ON BlogPost TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON BlogPost TYPE datetime VALUE time::now();

DEFINE INDEX idx_BlogPost_id ON BlogPost FIELDS id UNIQUE;
DEFINE INDEX idx_BlogPost_slug ON BlogPost FIELDS slug UNIQUE;

/* -- BlogComment Table --

This table stores blog comments. Each comment has a unique ID, content, and references to the post and user.
The table also tracks the creation and update timestamps and supports parent-child relationships. */

DEFINE TABLE BlogComment SCHEMAFULL
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON BlogComment TYPE string ASSERT $value != NONE;
DEFINE FIELD post_ref ON BlogComment TYPE record<BlogPost> ASSERT $value != NONE;
DEFINE FIELD user_ref ON BlogComment TYPE record<User> ASSERT $value != NONE;
DEFINE FIELD parent_comment_ref ON BlogComment TYPE option<record<BlogComment>> ASSERT $value == NONE;
DEFINE FIELD content ON BlogComment TYPE string ASSERT $value != NONE;
DEFINE FIELD created_at ON BlogComment TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON BlogComment TYPE datetime VALUE time::now();

DEFINE INDEX idx_BlogComment_id ON BlogComment FIELDS id UNIQUE;

/* -- BlogLike Table --

This table stores blog likes. Each like has a unique ID and references to the post and user.
The table also tracks the creation timestamp. */

DEFINE TABLE BlogLike SCHEMAFULL
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON BlogLike TYPE string ASSERT $value != NONE;
DEFINE FIELD post_ref ON BlogLike TYPE record<BlogPost> ASSERT $value != NONE;
DEFINE FIELD user_ref ON BlogLike TYPE record<User> ASSERT $value != NONE;
DEFINE FIELD created_at ON BlogLike TYPE datetime DEFAULT time::now();

DEFINE INDEX idx_likes_id ON BlogLike FIELDS id UNIQUE;
DEFINE INDEX idx_BlogLike_user_ref ON BlogLike FIELDS user_ref UNIQUE;
DEFINE INDEX idx_BlogLike_post_ref ON BlogLike FIELDS post_ref UNIQUE;

/* -- BlogBookmark Table --

This table stores blog bookmarks. Each bookmark has a unique ID and references to the post and user.
The table also tracks the creation timestamp. */

DEFINE TABLE BlogBookmark SCHEMAFULL
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON BlogBookmark TYPE string ASSERT $value != NONE;
DEFINE FIELD user_ref ON BlogBookmark TYPE record<User> ASSERT $value != NONE;
DEFINE FIELD post_ref ON BlogBookmark TYPE record<BlogPost> ASSERT $value != NONE;
DEFINE FIELD created_at ON BlogBookmark TYPE datetime DEFAULT time::now();

DEFINE INDEX idx_BlogBookmark_id ON BlogBookmark FIELDS id UNIQUE;
DEFINE INDEX idx_BlogBookmark_user_ref ON BlogBookmark FIELDS user_ref UNIQUE;
DEFINE INDEX idx_BlogBookmark_post_ref ON BlogBookmark FIELDS post_ref UNIQUE;
