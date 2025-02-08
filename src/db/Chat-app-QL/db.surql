/* -- Customers Table --

This table stores customer information. Each customer has a unique ID and a clerk user ID.
The table also tracks the creation timestamp. */

DEFINE TABLE customers SCHEMAFULL
      PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD customer_id ON customers TYPE string ASSERT string::is::uuid($value);
DEFINE FIELD clerk_user_id ON customers TYPE string;
DEFINE FIELD name ON customers TYPE string;
DEFINE FIELD email ON customers TYPE string ASSERT string::is::email($value);
DEFINE FIELD created_at ON customers TYPE datetime;

/* -- Chats Table --

This table stores chat information. Each chat has a unique ID and is linked to a customer.
The table also tracks the status, start, and end timestamps. */

DEFINE TABLE chats SCHEMAFULL
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD chat_id ON chats TYPE string ASSERT string::is::uuid($value);
DEFINE FIELD customer_id ON chats TYPE record<customers>;
DEFINE FIELD status ON chats TYPE string ASSERT $value IN ["active", "viewed", "closed"];
DEFINE FIELD started_at ON chats TYPE datetime;
DEFINE FIELD ended_at ON chats TYPE datetime;

DEFINE INDEX idx_chats_chat_id ON chats FIELDS chat_id UNIQUE;
DEFINE INDEX idx_chats_customer_id ON chats FIELDS customer_id UNIQUE;

/* -- Messages Table --

This table stores message information. Each message has a unique ID and is linked to a chat.
The table also tracks the sender ID, content, and sent timestamp. */

DEFINE TABLE messages SCHEMAFULL
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD message_id ON messages TYPE string ASSERT string::is::uuid($value);
DEFINE FIELD chat_id ON messages TYPE record<chats>;
DEFINE FIELD sender_id ON messages TYPE string;
DEFINE FIELD content ON messages TYPE string;
DEFINE FIELD sent_at ON messages TYPE datetime;

DEFINE INDEX idx_messages_message_id ON messages FIELDS message_id UNIQUE;
DEFINE INDEX idx_messages_chat_id ON messages FIELDS chat_id UNIQUE;
DEFINE INDEX idx_messages_sender_id ON messages FIELDS sender_id UNIQUE;

/* -- Feedback Table --

This table stores feedback information. Each feedback has a unique ID and is linked to a chat.
The table also tracks the rating, comment, and submitted timestamp. */

DEFINE TABLE feedback SCHEMAFULL
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD feedback_id ON feedback TYPE string ASSERT string::is::uuid($value);
DEFINE FIELD chat_id ON feedback TYPE record<chats>;
DEFINE FIELD rating ON feedback TYPE int ASSERT $value >= 1 AND $value <= 5;
DEFINE FIELD comment ON feedback TYPE string;
DEFINE FIELD submitted_at ON feedback TYPE datetime;

DEFINE INDEX idx_feedback_feedback_id ON feedback FIELDS feedback_id UNIQUE;
DEFINE INDEX idx_feedback_chat_id ON feedback FIELDS chat_id UNIQUE;
