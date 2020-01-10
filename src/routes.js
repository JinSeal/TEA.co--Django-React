import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import ProductList from "./containers/ProductList";
import OrderSummary from "./containers/OrderSummary";
import Checkout from "./containers/Checkout";
import ProductDetail from "./containers/ProductDetail";
import Profile from "./containers/Profile";
import HomepageLayout from "./containers/Home";

const BaseRouter = () => (
  <Hoc>
    <Route exact path="/" component={HomepageLayout} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />

    <Route exact path="/products" component={ProductList} />
    <Route path="/products/:productID" component={ProductDetail} />
    <Route path="/order-summary" component={OrderSummary} />
    <Route path="/checkout" component={Checkout} />
    <Route path="/profile" component={Profile} />


  </Hoc>
);

export default BaseRouter;
