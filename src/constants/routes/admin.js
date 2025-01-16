/**
 * Root routes constant
 * Contains admin panel routes
 * @type {string{}}
 */

// Main route
const MAIN = '/admin'
const PRODUCT_MAIN = MAIN + '/product'

export const ADMIN_ROUTES = {
  MAIN: MAIN,
  PRODUCT: {
    MAIN: PRODUCT_MAIN,
    CREATE: PRODUCT_MAIN + '/new',
    UPDATE: PRODUCT_MAIN + '/edit',
  },
}