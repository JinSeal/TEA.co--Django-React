from django.urls import path
from .views import (
    ItemListView,
    ItemDetailView,
    OrderItemRemoveView,
    AddToCartView,
    OrderQuantityUpdateView,
    OrderDetailView,
    PaymentView,
    PaymentListView,
    AddCouponView,
    AddressListView,
    AddressCreateView,
    AddressUpdateView,
    AddressDeleteView,
    CountryListView,
    UserIDView
)

urlpatterns = [
    path('products/', ItemListView.as_view(), name='product-list'),
    path('products/<pk>/', ItemDetailView.as_view(), name='product-detail'),
    path('add-to-cart/', AddToCartView.as_view(), name='add-to-cart'),
    path('order-items/<pk>/delete/',
         OrderItemRemoveView.as_view(), name='remove-order-item'),
    path('order-item/update-quantity/',
         OrderQuantityUpdateView.as_view(), name='update-order-item-quantity'),
    path('order-summary/', OrderDetailView.as_view(), name='order-summary'),
    path('handle-payment/', PaymentView.as_view(), name='handle-payment'),
    path('add-coupon/', AddCouponView.as_view(), name='add-coupon'),
    path('address-list/', AddressListView.as_view(), name='address-list'),
    path('address-create/', AddressCreateView.as_view(), name='address-create'),
    path('address/<pk>/update/', AddressUpdateView.as_view(), name='address-update'),
    path('address/<pk>/delete/', AddressDeleteView.as_view(), name='address-delete'),
    path('country-list/', CountryListView.as_view(), name='country-list'),
    path('payment-list/', PaymentListView.as_view(), name='payment-list'),
    path('user-id/', UserIDView.as_view(), name='user-id')
]