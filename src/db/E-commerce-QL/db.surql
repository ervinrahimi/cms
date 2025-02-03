/* -- User Table --

This table stores user information. Each user has a unique ID and a clerk ID.
The table also tracks the creation and update timestamps. */

DEFINE TABLE User SCHEMAFULL 
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON User TYPE string ASSERT $value != NONE;
DEFINE FIELD clerk_id ON User TYPE string ASSERT $value != NONE;
DEFINE FIELD created_at ON User TYPE datetime;
DEFINE FIELD updated_at ON User TYPE datetime VALUE time::now();

DEFINE INDEX idx_User_id ON User FIELDS id UNIQUE;
DEFINE INDEX idx_User_clerk_id ON User FIELDS clerk_id UNIQUE;

/* -- ShopCategory Table --

This table stores categories for the shop. Each category has a unique ID, name, and slug.
Categories can have a parent category, and the table tracks creation and update timestamps. */

DEFINE TABLE ShopCategory SCHEMAFULL 
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON ShopCategory TYPE string ASSERT $value != NONE;
DEFINE FIELD name ON ShopCategory TYPE string ASSERT $value != NONE;
DEFINE FIELD parent_id ON ShopCategory TYPE option<record<ShopCategory>>;
DEFINE FIELD slug ON ShopCategory TYPE string ASSERT $value != NONE;
DEFINE FIELD created_at ON ShopCategory TYPE datetime;
DEFINE FIELD updated_at ON ShopCategory TYPE datetime VALUE time::now();

DEFINE INDEX idx_ShopCategory_id ON ShopCategory FIELDS id UNIQUE;
DEFINE INDEX idx_ShopCategory_slug ON ShopCategory FIELDS slug UNIQUE;
DEFINE INDEX idx_ShopCategory_parent_id ON ShopCategory FIELDS parent_id;

/* -- ShopOrder Table --

This table stores orders placed by users. Each order has a unique ID, user ID, and order date.
The table also tracks the total amount, status, and creation and update timestamps. */

DEFINE TABLE ShopOrder SCHEMAFULL 
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON ShopOrder TYPE string ASSERT $value != NONE;
DEFINE FIELD user_id ON ShopOrder TYPE record<User> ASSERT $value != NONE;
DEFINE FIELD shipping_address_id ON ShopOrder TYPE option<record<ShopShippingAddress>>;
DEFINE FIELD orderDate ON ShopOrder TYPE datetime ASSERT $value != NONE;
DEFINE FIELD totalAmount ON ShopOrder TYPE number ASSERT $value != NONE;
DEFINE FIELD status ON ShopOrder TYPE string ASSERT $value IN ["Pending","Shipped","Delivered","Cancelled"];
DEFINE FIELD created_at ON ShopOrder TYPE datetime;
DEFINE FIELD updated_at ON ShopOrder TYPE datetime VALUE time::now();

DEFINE INDEX idx_ShopOrder_id ON ShopOrder FIELDS id UNIQUE;
DEFINE INDEX idx_ShopOrder_user_id ON ShopOrder FIELDS user_id UNIQUE;

/* -- ShopOrderDetails Table --

This table stores details of each order. Each detail has a unique ID, order ID, and product ID.
The table also tracks the quantity, price per unit, total price, and any applied discount. */

DEFINE TABLE ShopOrderDetails SCHEMAFULL 
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON ShopOrderDetails TYPE string ASSERT $value != NONE;
DEFINE FIELD order_id ON ShopOrderDetails TYPE record<ShopOrder> ASSERT $value != NONE;
DEFINE FIELD product_id ON ShopOrderDetails TYPE record<ShopProduct> ASSERT $value != NONE;
DEFINE FIELD quantity ON ShopOrderDetails TYPE number ASSERT $value != NONE;
DEFINE FIELD pricePerUnit ON ShopOrderDetails TYPE number ASSERT $value != NONE;
DEFINE FIELD totalPrice ON ShopOrderDetails TYPE number ASSERT $value != NONE;
DEFINE FIELD appliedDiscount ON ShopOrderDetails TYPE number;
DEFINE FIELD created_at ON ShopOrderDetails TYPE datetime;
DEFINE FIELD updated_at ON ShopOrderDetails TYPE datetime VALUE time::now();

DEFINE INDEX idx_ShopOrderDetails_id ON ShopOrderDetails FIELDS id UNIQUE;
DEFINE INDEX idx_ShopOrderDetails_order_id ON ShopOrderDetails FIELDS order_id UNIQUE;

/* -- ShopPayment Table --

This table stores payment information for orders. Each payment has a unique ID, order ID, and payment date.
The table also tracks the payment method, amount, transaction ID, and any additional metadata. */

DEFINE TABLE ShopPayment SCHEMAFULL 
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON ShopPayment TYPE string ASSERT $value != NONE;
DEFINE FIELD order_id ON ShopPayment TYPE record<ShopOrder> ASSERT $value != NONE;
DEFINE FIELD product_id ON ShopPayment TYPE array<record<ShopProduct>> ASSERT $value != NONE;
DEFINE FIELD paymentDate ON ShopPayment TYPE datetime ASSERT $value != NONE;
DEFINE FIELD paymentMethod ON ShopPayment TYPE string ASSERT $value IN ["Credit Card","PayPal","etc."];
DEFINE FIELD amount ON ShopPayment TYPE number ASSERT $value != NONE;
DEFINE FIELD transaction_id ON ShopPayment TYPE string ASSERT $value != NONE;
DEFINE FIELD created_at ON ShopPayment TYPE datetime;
DEFINE FIELD updated_at ON ShopPayment TYPE datetime VALUE time::now();
DEFINE FIELD metadata ON ShopPayment TYPE object;

DEFINE INDEX idx_ShopPayment_id ON ShopPayment FIELDS id UNIQUE;
DEFINE INDEX idx_ShopPayment_order_id ON ShopPayment FIELDS order_id UNIQUE;

/* -- ShopProduct Table --

This table stores product information. Each product has a unique ID, slug, and name.
The table also tracks the category, description, price, stock, and other product details. */

DEFINE TABLE ShopProduct SCHEMAFULL 
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON ShopProduct TYPE string ASSERT $value != NONE;
DEFINE FIELD slug ON ShopProduct TYPE string ASSERT $value != NONE;
DEFINE FIELD category_id ON ShopProduct TYPE array<record<ShopCategory>> ASSERT $value != NONE;
DEFINE FIELD name ON ShopProduct TYPE string ASSERT $value != NONE;
DEFINE FIELD description ON ShopProduct TYPE string ASSERT $value != NONE;
DEFINE FIELD price ON ShopProduct TYPE number ASSERT $value != NONE;
DEFINE FIELD stock ON ShopProduct TYPE number ASSERT $value != NONE;
DEFINE FIELD is_active ON ShopProduct TYPE bool ASSERT $value != NONE;
DEFINE FIELD product_type ON ShopProduct TYPE string ASSERT $value IN ["physical", "digital"];
DEFINE FIELD coverImage ON ShopProduct TYPE string;
DEFINE FIELD files ON ShopProduct TYPE array<string>;
DEFINE FIELD metadata ON ShopProduct TYPE object;
DEFINE FIELD created_at ON ShopProduct TYPE datetime;
DEFINE FIELD updated_at ON ShopProduct TYPE datetime VALUE time::now();

DEFINE INDEX idx_ShopProduct_id ON ShopProduct FIELDS id UNIQUE;
DEFINE INDEX idx_ShopProduct_slug ON ShopProduct FIELDS slug UNIQUE;
DEFINE INDEX idx_ShopProduct_name ON ShopProduct FIELDS name UNIQUE;
DEFINE INDEX idx_ShopProduct_category_id ON ShopProduct FIELDS category_id UNIQUE;

/* -- ShopDiscount Table --

This table stores discount information for products. Each discount has a unique ID, product ID, and discount code.
The table also tracks the discount percentage, usage limit, and start and end dates. */

DEFINE TABLE ShopDiscount SCHEMAFULL 
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON ShopDiscount TYPE string ASSERT $value != NONE;
DEFINE FIELD product_id ON ShopDiscount TYPE array<record<ShopProduct>> ASSERT $value != NONE;
DEFINE FIELD name ON ShopDiscount TYPE string ASSERT $value != NONE;
DEFINE FIELD usageLimit ON ShopDiscount TYPE number ASSERT $value != NONE;
DEFINE FIELD discountCode ON ShopDiscount TYPE string ASSERT $value != NONE;
DEFINE FIELD discountPercentage ON ShopDiscount TYPE number ASSERT $value != NONE;
DEFINE FIELD startDate ON ShopDiscount TYPE datetime ASSERT $value != NONE;
DEFINE FIELD endDate ON ShopDiscount TYPE datetime ASSERT $value != NONE;
DEFINE FIELD created_at ON ShopDiscount TYPE datetime;
DEFINE FIELD updated_at ON ShopDiscount TYPE datetime VALUE time::now();

DEFINE INDEX idx_ShopDiscount_id ON ShopDiscount FIELDS id UNIQUE;

/* -- ShopCart Table --

This table stores shopping cart information for users. Each cart has a unique ID, user ID, and list of items.
The table also tracks the creation and update timestamps. */

DEFINE TABLE ShopCart SCHEMAFULL 
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON ShopCart TYPE string ASSERT $value != NONE;
DEFINE FIELD user_id ON ShopCart TYPE record<User> ASSERT $value != NONE;
DEFINE FIELD items ON ShopCart TYPE array<object> ASSERT $value != NONE;
DEFINE FIELD created_at ON ShopCart TYPE datetime;
DEFINE FIELD updated_at ON ShopCart TYPE datetime VALUE time::now();

DEFINE INDEX idx_ShopCart_id ON ShopCart FIELDS id UNIQUE;
DEFINE INDEX idx_ShopCart_user_id ON ShopCart FIELDS user_id UNIQUE;

/* -- ShopReview Table --

This table stores reviews for products. Each review has a unique ID, product ID, and user ID.
The table also tracks the rating, comment, and creation and update timestamps. */

DEFINE TABLE ShopReview SCHEMAFULL 
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON ShopReview TYPE string ASSERT $value != NONE;
DEFINE FIELD product_id ON ShopReview TYPE record<ShopProduct> ASSERT $value != NONE;
DEFINE FIELD user_id ON ShopReview TYPE record<User> ASSERT $value != NONE;
DEFINE FIELD rating ON ShopReview TYPE number ASSERT $value >= 1 AND $value <= 5;
DEFINE FIELD comment ON ShopReview TYPE string;
DEFINE FIELD created_at ON ShopReview TYPE datetime;
DEFINE FIELD updated_at ON ShopReview TYPE datetime VALUE time::now();

DEFINE INDEX idx_ShopReview_id ON ShopReview FIELDS id UNIQUE;

/* -- ShopShippingAddress Table --

This table stores shipping addresses for users. Each address has a unique ID, user ID, and postal code.
The table also tracks the address details and creation and update timestamps. */

DEFINE TABLE ShopShippingAddress SCHEMAFULL 
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;

DEFINE FIELD id ON ShopShippingAddress TYPE string ASSERT $value != NONE;
DEFINE FIELD user_id ON ShopShippingAddress TYPE record<User> ASSERT $value != NONE;
DEFINE FIELD address_line1 ON ShopShippingAddress TYPE string ASSERT $value != NONE;
DEFINE FIELD address_line2 ON ShopShippingAddress TYPE string;
DEFINE FIELD city ON ShopShippingAddress TYPE string ASSERT $value != NONE;
DEFINE FIELD state ON ShopShippingAddress TYPE string ASSERT $value != NONE;
DEFINE FIELD postal_code ON ShopShippingAddress TYPE string ASSERT $value != NONE;
DEFINE FIELD country ON ShopShippingAddress TYPE string ASSERT $value != NONE;
DEFINE FIELD created_at ON ShopShippingAddress TYPE datetime;
DEFINE FIELD updated_at ON ShopShippingAddress TYPE datetime VALUE time::now();

DEFINE INDEX idx_ShopShippingAddress_id ON ShopShippingAddress FIELDS id UNIQUE;
DEFINE INDEX idx_ShopShippingAddress_user_id ON ShopShippingAddress FIELDS user_id UNIQUE;
DEFINE INDEX idx_ShopShippingAddress_postal_code ON ShopShippingAddress FIELDS postal_code UNIQUE;
