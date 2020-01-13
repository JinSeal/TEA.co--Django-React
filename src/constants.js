export const localhost = 'http://127.0.0.1:8000'

export const production = 'https://tea-ware.heroku.com'

const apiURL = '/api'

export const endpoint = `${production}${apiURL}`

export const productListURL = (page, size, searchValue, category = "", origin = "", label = "") => `${endpoint}/products/?page=${page}&page_size=${size}&search=${searchValue}&category=${category}&origin=${origin}&label=${label}`;
export const productDetailURL = id => `${endpoint}/products/${id}/`;
export const addToCartURL = `${endpoint}/add-to-cart/`;
export const removeOrderItemURL = itemID => `${endpoint}/order-items/${itemID}/delete/`;
export const updateOrderItemQuantityURL = `${endpoint}/order-item/update-quantity/`;
export const orderSummaryURL = `${endpoint}/order-summary/`;
export const handlePaymentURL = `${endpoint}/handle-payment/`;
export const addCouponURL = `${endpoint}/add-coupon/`;
export const addressListURL = addressType => `${endpoint}/address-list/?address_type=${addressType}`;
export const addressCreateURL = `${endpoint}/address-create/`;
export const addressUpdateURL = addressID => `${endpoint}/address/${addressID}/update/`;
export const addressDeleteURL = addressID => `${endpoint}/address/${addressID}/delete/`;
export const countryListURL = `${endpoint}/country-list/`;
export const paymentListURL = `${endpoint}/payment-list/`;
export const userIDURL = `${endpoint}/user-id/`;
export const filterListURL = `${endpoint}/filter-list/`;

