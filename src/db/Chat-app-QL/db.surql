/* -- Customer Table --

This table stores customer information. Each customer has a unique ID and a clerk user ID.
The table also tracks the creation timestamp. */

DEFINE TABLE ChatUser SCHEMAFULL
      PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON TABLE ChatUser TYPE string ASSERT $value != NONE;
DEFINE FIELD clerk_id ON TABLE ChatUser TYPE string ASSERT $value != NONE;
DEFINE FIELD name ON TABLE ChatUser TYPE string;
DEFINE FIELD email ON TABLE ChatUser TYPE string ASSERT string::is::email($value);
DEFINE FIELD created_at ON TABLE ChatUser TYPE datetime;

DEFINE INDEX idx_ChatUser_id ON TABLE ChatUser FIELDS id UNIQUE;

/* -- Admin Table --

This table stores admin information. Each chat has a unique ID and is linked to a customer.
The table also tracks the status, start, and end timestamps. */

DEFINE TABLE ChatAdmin SCHEMAFULL
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON TABLE ChatAdmin TYPE string ASSERT $value != NONE;
DEFINE FIELD image ON TABLE ChatAdmin TYPE option<string>;
DEFINE FIELD clerk_id ON TABLE ChatAdmin TYPE string ASSERT $value != NONE;
DEFINE FIELD firstname ON TABLE ChatAdmin TYPE string;
DEFINE FIELD lastname ON TABLE ChatAdmin TYPE string;
DEFINE FIELD email ON TABLE ChatAdmin TYPE string ASSERT string::is::email($value);
DEFINE FIELD created_at ON TABLE ChatAdmin TYPE datetime;
DEFINE FIELD updated_at ON TABLE ChatAdmin TYPE datetime VALUE time::now();

DEFINE INDEX idx_ChatAdmin_id ON TABLE ChatAdmin FIELDS id UNIQUE;

/* -- Chat Table --

This table stores chat information. Each chat has a unique ID and is linked to a customer.
The table also tracks the status, start, and end timestamps. */

DEFINE TABLE Chat SCHEMAFULL
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON TABLE Chat TYPE string ASSERT $value != NONE;
DEFINE FIELD user_id ON TABLE Chat TYPE record<ChatUser>;
DEFINE FIELD admin_id ON TABLE Chat TYPE option<record<ChatAdmin>>;
DEFINE FIELD status ON TABLE Chat TYPE string ASSERT $value IN ["pending", "active", "viewed", "closed"];
DEFINE FIELD started_at ON TABLE Chat TYPE datetime;
DEFINE FIELD ended_at ON TABLE Chat TYPE option<datetime>;
DEFINE FIELD created_at ON TABLE Chat TYPE datetime;
DEFINE FIELD updated_at ON TABLE Chat TYPE datetime VALUE time::now();

DEFINE INDEX idx_Chat_id ON Chat FIELDS id UNIQUE;

/* -- Message Table --

This table stores message information. Each message has a unique ID and is linked to a chat.
The table also tracks the sender ID, content, and sent timestamp. */

DEFINE TABLE Message SCHEMAFULL
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON TABLE Message TYPE string ASSERT $value != NONE;
DEFINE FIELD chat_id ON TABLE Message TYPE record<Chat>;
DEFINE FIELD content ON TABLE Message TYPE string;
DEFINE FIELD sender_id ON TABLE Message TYPE record;
DEFINE FIELD sent_at ON TABLE Message TYPE datetime;
DEFINE FIELD created_at ON TABLE Message TYPE datetime VALUE time::now();

DEFINE INDEX idx_Message_id ON TABLE Message FIELDS id UNIQUE;

/* -- Feedback Table --

This table stores feedback information. Each feedback has a unique ID and is linked to a chat.
The table also tracks the rating, comment, and submitted timestamp. */

DEFINE TABLE Feedback SCHEMAFULL
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON TABLE Feedback TYPE string ASSERT $value != NONE;
DEFINE FIELD chat_id ON TABLE Feedback TYPE record<Chat>;
DEFINE FIELD rating ON TABLE Feedback TYPE int ASSERT $value >= 1 AND $value <= 5;
DEFINE FIELD comment ON TABLE Feedback TYPE string;
DEFINE FIELD submitted_at ON TABLE Feedback TYPE datetime;
DEFINE FIELD created_at ON TABLE Feedback TYPE datetime;
DEFINE FIELD updated_at ON TABLE Feedback TYPE datetime VALUE time::now();

DEFINE INDEX idx_Feedback_id ON TABLE Feedback FIELDS id UNIQUE;
DEFINE INDEX idx_Feedback_chat_id ON TABLE Feedback FIELDS chat_id UNIQUE;