const localhost = 'http://127.0.0.1:8000'

const apiURL = '/api'

export const endpoint = `${localhost}${apiURL}`

export const productListURL = `${endpoint}/products/`;
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
