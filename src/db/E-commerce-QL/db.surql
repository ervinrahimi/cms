// Create a schemafull table Shop Category with name "ShopCategory"
DEFINE TABLE ShopCategory SCHEMAFULL 
    PERMISSIONS
        FOR select, create, update, delete
        WHERE id = $auth.id; 
// Create id field on ShopCategory table with assertation string datatype
DEFINE FIELD id ON ShopCategory 
    TYPE string 
    ASSERT $value != NONE;
// Create name field on ShopCategory table with assertation string datatype
DEFINE FIELD name ON ShopCategory 
    TYPE string 
    ASSERT $value != NONE;
// Create parent_id field on ShopCategory table with relation to ShopCategory table
DEFINE FIELD parent_id ON ShopCategory
    TYPE option<record<ShopCategory>>
    ASSERT $value == NONE;
// Create slug field on ShopCategory table with assertation string datatype
DEFINE FIELD slug ON ShopCategory 
    TYPE string 
    ASSERT $value != NONE;
// Create created_at field on ShopCategory table with datetime datatype
DEFINE FIELD created_at ON ShopCategory 
    TYPE datetime;
// Create updated_at field on ShopCategory table with datetime datatype
DEFINE FIELD updated_at ON ShopCategory 
    TYPE datetime 
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_ShopCategory_id ON ShopCategory 
    FIELDS id UNIQUE;
// Define index slug field for unique record
DEFINE INDEX idx_ShopCategory_slug ON ShopCategory 
    FIELDS slug UNIQUE;

// -------------------------------------------------------------------------------------------

// Create a schemafull table Shop Order with name "ShopOrder"
DEFINE TABLE ShopOrder SCHEMAFULL 
    PERMISSIONS
        FOR select, create, update, delete
        WHERE id = $auth.id; 
// Create id field on ShopOrder table with assertation string datatype
DEFINE FIELD id ON ShopOrder 
    TYPE string 
    ASSERT $value != NONE;
// Create user_id field on ShopOrder table with assertation and have relation with User table
DEFINE FIELD user_id ON ShopOrder 
    TYPE array<record<User>> 
    ASSERT $value != NONE;
// Create shipping_address_id field on ShopOrder table with assertation and have relation with ShopShippingAddress table
DEFINE FIELD shipping_address_id ON ShopOrder 
    TYPE record<ShopShippingAddress> 
    ASSERT $value != NONE;
// Create orderDate field on ShopOrder table with assertation datetime datatype
DEFINE FIELD orderDate ON ShopOrder 
    TYPE datetime 
    ASSERT $value != NONE;
// Create totalAmount field on ShopOrder table with assertation number datatype
DEFINE FIELD totalAmount ON ShopOrder 
    TYPE number 
    ASSERT $value != NONE;
// Create status field on ShopOrder table with assertation string datatype
DEFINE FIELD status ON ShopOrder 
    TYPE string 
    ASSERT $value IN ["Pending","Shipped","Delivered","Cancelled"];
// Create created_at field on ShopOrder table with datetime datatype
DEFINE FIELD created_at ON ShopOrder 
    TYPE datetime;
// Create updated_at field on ShopOrder table with datetime datatype
DEFINE FIELD updated_at ON ShopOrder 
    TYPE datetime 
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_ShopOrder_id ON ShopOrder 
    FIELDS id UNIQUE;

// -------------------------------------------------------------------------------------------

// Create a schemafull table Shop Order Details with name "ShopOrderDetails"
DEFINE TABLE ShopOrderDetails SCHEMAFULL 
    PERMISSIONS
        FOR select, create, update, delete
        WHERE id = $auth.id; 
// Create id field on ShopOrderDetails table with assertation string datatype
DEFINE FIELD id ON ShopOrderDetails 
    TYPE string 
    ASSERT $value != NONE;
// Create order_id field on ShopOrderDetails table with assertation and have relation with ShopOrder table
DEFINE FIELD order_id ON ShopOrderDetails 
    TYPE array<record<ShopOrder>> 
    ASSERT $value != NONE;
// Create product_id field on ShopOrderDetails table with assertation and have relation with ShopProduct table
DEFINE FIELD product_id ON ShopOrderDetails 
    TYPE array<record<ShopProduct>> 
    ASSERT $value != NONE;
// Create quantity field on ShopOrderDetails table with assertation number datatype
DEFINE FIELD quantity ON ShopOrderDetails 
    TYPE number 
    ASSERT $value != NONE;
// Create pricePerUnit field on ShopOrderDetails table with assertation number datatype
DEFINE FIELD pricePerUnit ON ShopOrderDetails 
    TYPE number 
    ASSERT $value != NONE;
// Create totalPrice field on ShopOrderDetails table with assertation number datatype
DEFINE FIELD totalPrice ON ShopOrderDetails 
    TYPE number 
    ASSERT $value != NONE;
// Create created_at field on ShopOrderDetails table with datetime datatype
DEFINE FIELD created_at ON ShopOrderDetails 
    TYPE datetime;
// Create updated_at field on ShopOrderDetails table with datetime datatype
DEFINE FIELD updated_at ON ShopOrderDetails 
    TYPE datetime 
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_ShopOrderDetails_id ON ShopOrderDetails 
    FIELDS id UNIQUE;

// ------------------------------------------------------------------------------------------

// Create a schemafull table Shop Payment with name "ShopPayment"
DEFINE TABLE ShopPayment SCHEMAFULL 
    PERMISSIONS
        FOR select, create, update, delete
        WHERE id = $auth.id; 
// Create id field on ShopPayment table with assertation string datatype
DEFINE FIELD id ON ShopPayment 
    TYPE string 
    ASSERT $value != NONE;
// Create order_id field on ShopPayment table with assertation and have relation with ShopOrder table
DEFINE FIELD order_id ON ShopPayment 
    TYPE array<record<ShopOrder>> 
    ASSERT $value != NONE;
// Create product_id field on ShopPayment table with assertation and have relation with ShopProduct table
DEFINE FIELD product_id ON ShopPayment 
    TYPE array<record<ShopProduct>> 
    ASSERT $value != NONE;
// Create paymentDate field on ShopPayment table with assertation datetime datatype
DEFINE FIELD paymentDate ON ShopPayment 
    TYPE datetime 
    ASSERT $value != NONE;
// Create paymentMethod field on ShopPayment table with assertation string datatype
DEFINE FIELD paymentMethod ON ShopPayment 
    TYPE string 
    ASSERT $value IN ["Credit Card","PayPal","etc."];
// Create amount field on ShopPayment table with assertation number datatype
DEFINE FIELD amount ON ShopPayment 
    TYPE number 
    ASSERT $value != NONE;
// Create created_at field on ShopPayment table with datetime datatype
DEFINE FIELD created_at ON ShopPayment 
    TYPE datetime;
// Create updated_at field on ShopPayment table with datetime datatype
DEFINE FIELD updated_at ON ShopPayment 
    TYPE datetime VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_ShopPayment_id ON ShopPayment 
    FIELDS id UNIQUE;

// ------------------------------------------------------------------------------------------

// Create a schemafull table Shop Payment with name "ShopPayment"
DEFINE TABLE ShopInventory SCHEMAFULL 
    PERMISSIONS
        FOR select, create, update, delete
        WHERE id = $auth.id; 
// Create id field on ShopInventory table with assertation string datatype
DEFINE FIELD id ON ShopInventory 
    TYPE string 
    ASSERT $value != NONE;
// Create product_id field on ShopInventory table with assertation and have relation with ShopProduct table
DEFINE FIELD product_id ON ShopInventory 
    TYPE array<record<ShopProduct>> 
    ASSERT $value != NONE;
// Create quantity field on ShopInventory table with assertation number datatype
DEFINE FIELD quantity ON ShopInventory 
    TYPE number 
    ASSERT $value != NONE;
// Create wareHouseLocation field on ShopInventory table with assertation string datatype
DEFINE FIELD wareHouseLocation ON ShopInventory 
    TYPE string 
    ASSERT $value != NONE;
// Create created_at field on ShopInventory table with datetime datatype
DEFINE FIELD created_at ON ShopInventory 
    TYPE datetime;
// Create updated_at field on ShopInventory table with datetime datatype
DEFINE FIELD updated_at ON ShopInventory 
    TYPE datetime 
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_ShopInventory_id ON ShopInventory 
    FIELDS id UNIQUE;

// ------------------------------------------------------------------------------------------

// Create a schemafull table Shop Product with name "ShopProduct"
DEFINE TABLE ShopProduct SCHEMAFULL 
    PERMISSIONS
        FOR select, create, update, delete
        WHERE id = $auth.id; 
// Create id field on ShopProduct table with assertation string datatype
DEFINE FIELD id ON ShopProduct 
    TYPE string 
    ASSERT $value != NONE;
// Create user_id field on ShopProduct table with assertation and have relation with User table
DEFINE FIELD user_id ON ShopProduct 
    TYPE array<record<User>> 
    ASSERT $value != NONE;
// Create category_id field on ShopProduct table with assertation and have relation with ShopCategory table
DEFINE FIELD category_id ON ShopProduct 
    TYPE array<record<ShopCategory>> 
    ASSERT $value != NONE;
// Create name field on ShopProduct table with assertation string datatype
DEFINE FIELD name ON ShopProduct 
    TYPE string 
    ASSERT $value != NONE;
// Create description field on ShopProduct table with assertation string datatype
DEFINE FIELD description ON ShopProduct 
    TYPE string 
    ASSERT $value != NONE;
// Create price field on ShopProduct table with assertation number datatype
DEFINE FIELD price ON ShopProduct 
    TYPE number 
    ASSERT $value != NONE;
// Create stock field on ShopProduct table with assertation number datatype
DEFINE FIELD stock ON ShopProduct 
    TYPE number 
    ASSERT $value != NONE;
// Create created_at field on ShopProduct table with datetime datatype
DEFINE FIELD created_at ON ShopProduct 
    TYPE datetime;
// Create updated_at field on ShopProduct table with datetime datatype
DEFINE FIELD updated_at ON ShopProduct 
    TYPE datetime 
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_ShopProduct_id ON ShopProduct 
    FIELDS id UNIQUE;

// ------------------------------------------------------------------------------------------

// Create a schemafull table Shop Discount with name "ShopDiscount"
DEFINE TABLE ShopDiscount SCHEMAFULL 
    PERMISSIONS
        FOR select, create, update, delete
        WHERE id = $auth.id; 
// Create id field on ShopDiscount table with assertation string datatype
DEFINE FIELD id ON ShopDiscount 
    TYPE string 
    ASSERT $value != NONE;
// Create product_id field on ShopDiscount table with assertation and have relation with ShopProduct table
DEFINE FIELD product_id ON ShopDiscount 
    TYPE array<record<ShopProduct>> 
    ASSERT $value != NONE;
// Create name field on ShopDiscount table with assertation string datatype
DEFINE FIELD name ON ShopDiscount 
    TYPE string 
    ASSERT $value != NONE;
// Create discountCode field on ShopDiscount table with assertation number datatype
DEFINE FIELD discountCode ON ShopDiscount 
    TYPE number 
    ASSERT $value != NONE;
// Create discountPercentage field on ShopDiscount table with assertation number datatype
DEFINE FIELD discountPercentage ON ShopDiscount 
    TYPE number 
    ASSERT $value != NONE;
// Create stock field on ShopDiscount table with assertation number datatype
DEFINE FIELD stock ON ShopDiscount 
    TYPE number 
    ASSERT $value != NONE;
// Create startDate field on ShopDiscount table with assertation datetime datatype
DEFINE FIELD startDate ON ShopDiscount 
    TYPE datetime 
    ASSERT $value != NONE;
// Create endDate field on ShopDiscount table with assertation datetime datatype
DEFINE FIELD endDate ON ShopDiscount 
    TYPE datetime 
    ASSERT $value != NONE;
// Create created_at field on ShopDiscount table with datetime datatype
DEFINE FIELD created_at ON ShopDiscount 
    TYPE datetime;
// Create updated_at field on ShopDiscount table with datetime datatype
DEFINE FIELD updated_at ON ShopDiscount 
    TYPE datetime 
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_ShopDiscount_id ON ShopDiscount 
    FIELDS id UNIQUE;

// ------------------------------------------------------------------------------------------

// Create a schemafull table Shop Cart with name "ShopCart"
DEFINE TABLE ShopCart SCHEMAFULL 
    PERMISSIONS
        FOR select, create, update, delete
        WHERE id = $auth.id; 
// Create id field on ShopCart table with assertation string datatype
DEFINE FIELD id ON ShopCart 
    TYPE string 
    ASSERT $value != NONE;
// Create user_id field on ShopCart table with assertation and have relation with User table
DEFINE FIELD user_id ON ShopCart 
    TYPE array<record<User>> 
    ASSERT $value != NONE;
// Create items field on ShopCart table with assertation array datatype
DEFINE FIELD items ON ShopCart 
    TYPE array 
    ASSERT $value != NONE;
// Create created_at field on ShopCart table with datetime datatype
DEFINE FIELD created_at ON ShopCart 
    TYPE datetime;
// Create updated_at field on ShopCart table with datetime datatype
DEFINE FIELD updated_at ON ShopCart 
    TYPE datetime 
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_ShopCart_id ON ShopCart 
    FIELDS id UNIQUE;

// ------------------------------------------------------------------------------------------

// Create a schemafull table Shop Review with name "ShopReview"
DEFINE TABLE ShopReview SCHEMAFULL 
    PERMISSIONS
        FOR select, create, update, delete
        WHERE id = $auth.id;
// Create id field on ShopReview table with assertation string datatype
DEFINE FIELD id ON ShopReview 
    TYPE string 
    ASSERT $value != NONE;
// Create product_id field on ShopReview table with assertation and have relation with ShopProduct table
DEFINE FIELD product_id ON ShopReview 
    TYPE record<ShopProduct> 
    ASSERT $value != NONE;
// Create user_id field on ShopReview table with assertation and have relation with User table
DEFINE FIELD user_id ON ShopReview 
    TYPE record<User> 
    ASSERT $value != NONE;
// Create rating field on ShopReview table with assertation number datatype
DEFINE FIELD rating ON ShopReview 
    TYPE number 
    ASSERT $value >= 1 AND $value <= 5;
// Create comment field on ShopReview table with assertation string datatype
DEFINE FIELD comment ON ShopReview 
    TYPE string;
// Create created_at field on ShopReview table with datetime datatype
DEFINE FIELD created_at ON ShopReview 
    TYPE datetime;
// Create updated_at field on ShopReview table with datetime datatype
DEFINE FIELD updated_at ON ShopReview 
    TYPE datetime 
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_ShopReview_id ON ShopReview 
    FIELDS id UNIQUE;

// ------------------------------------------------------------------------------------------

// Create a schemafull table Shop Shipping Address with name "ShopShippingAddress"
DEFINE TABLE ShopShippingAddress SCHEMAFULL 
    PERMISSIONS
        FOR select, create, update, delete
        WHERE id = $auth.id;
// Create id field on ShopShippingAddress table with assertation string datatype
DEFINE FIELD id ON ShopShippingAddress 
    TYPE string 
    ASSERT $value != NONE;
// Create user_id field on ShopShippingAddress table with assertation and have relation with User table
DEFINE FIELD user_id ON ShopShippingAddress 
    TYPE record<User> 
    ASSERT $value != NONE;
// Create address_line1 field on ShopShippingAddress table with assertation string datatype
DEFINE FIELD address_line1 ON ShopShippingAddress 
    TYPE string 
    ASSERT $value != NONE;
// Create address_line2 field on ShopShippingAddress table with string datatype
DEFINE FIELD address_line2 ON ShopShippingAddress 
    TYPE string;
// Create city field on ShopShippingAddress table with assertation string datatype
DEFINE FIELD city ON ShopShippingAddress 
    TYPE string 
    ASSERT $value != NONE;
// Create state field on ShopShippingAddress table with assertation string datatype
DEFINE FIELD state ON ShopShippingAddress 
    TYPE string 
    ASSERT $value != NONE;
// Create postal_code field on ShopShippingAddress table with assertation string datatype
DEFINE FIELD postal_code ON ShopShippingAddress 
    TYPE string 
    ASSERT $value != NONE;
// Create country field on ShopShippingAddress table with assertation string datatype
DEFINE FIELD country ON ShopShippingAddress 
    TYPE string 
    ASSERT $value != NONE;
// Create created_at field on ShopShippingAddress table with datetime datatype
DEFINE FIELD created_at ON ShopShippingAddress 
    TYPE datetime;
// Create updated_at field on ShopShippingAddress table with datetime datatype
DEFINE FIELD updated_at ON ShopShippingAddress 
    TYPE datetime 
    VALUE time::now();
// Define index id field for unique record
DEFINE INDEX idx_ShopShippingAddress_id ON ShopShippingAddress 
    FIELDS id UNIQUE;