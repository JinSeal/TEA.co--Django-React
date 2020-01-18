import React, { Component } from "react";

import {
  Button,
  Container,
  Dropdown,
  Menu,
  Visibility,
  Segment
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout, authCheckState } from "../store/actions/auth";
import { fetchCart, cartLogout } from "../store/actions/cart";

class Nav extends Component {
  state = {
    fixed: null,
    activeItem: ""
  };

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  componentDidMount() {
    this.props.authCheckState();
    this.props.fetchCart();
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  render() {
    const { fixed, activeItem } = this.state;
    const { authenticated, cart, loading } = this.props;

    return (
      <div>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            inverted
            textAlign="center"
            style={{ padding: "1em 0em" }}
            vertical
          >
            <Menu
              fixed={fixed ? "top" : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size="large"
            >
              <Container>
                <Menu.Item as="h1">TEA.co</Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/"
                  name="home"
                  active={activeItem === "home"}
                  onClick={this.handleItemClick}
                  style={{ color: fixed ? "olive" : null }}
                >
                  Home
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/products"
                  name="products"
                  active={activeItem === "products"}
                  onClick={this.handleItemClick}
                  style={{ color: fixed ? "olive" : null }}
                >
                  Tea
                </Menu.Item>
                <Menu.Item
                  as="a"
                  href="https://github.com/JinSeal/TEA.co--Django-React"
                  target="_blank"
                  style={{ color: fixed ? "olive" : null }}
                >
                  GitHub
                </Menu.Item>

                {authenticated ? (
                  <React.Fragment>
                    <Menu.Item
                      as={Link}
                      to="/profile"
                      position="right"
                      name="profile"
                      active={activeItem === "profile"}
                      onClick={this.handleItemClick}
                      style={{ color: fixed ? "olive" : null }}
                    >
                      Profile
                    </Menu.Item>
                    <Dropdown
                      as="a"
                      loading={loading}
                      text={`${
                        cart !== null ? cart.order_items.length : 0
                      } items`}
                      pointing
                      className="link item"
                      icon="cart"
                    >
                      <Dropdown.Menu>
                        {cart !== null ? (
                          <React.Fragment>
                            {cart.order_items.map(order_item => {
                              return (
                                <Dropdown.Item key={order_item.id}>
                                  {order_item.quantity} x{" "}
                                  {order_item.item.title}
                                </Dropdown.Item>
                              );
                            })}
                            <Dropdown.Divider />
                            <Dropdown.Item
                              icon="arrow right"
                              text="Checkout"
                              onClick={() =>
                                this.props.history.push("/order-summary")
                              }
                            />
                          </React.Fragment>
                        ) : (
                          <Dropdown.Item text="No items in your cart" />
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Item
                      as="a"
                      onClick={() => {
                        this.props.logout();
                        this.props.cartLogout();
                      }}
                    >
                      Logout
                    </Menu.Item>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Menu.Item position="right">
                      <Button as={Link} to="/login" inverted={!fixed}>
                        {" "}
                        Log in
                      </Button>
                      <Button
                        as={Link}
                        to="/signup"
                        inverted={!fixed}
                        color={fixed ? "olive" : null}
                        style={{ marginLeft: "0.5em" }}
                      >
                        Sign Up
                      </Button>
                    </Menu.Item>
                  </React.Fragment>
                )}
              </Container>
            </Menu>
          </Segment>
        </Visibility>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
    loading: state.cart.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout()),
    fetchCart: () => dispatch(fetchCart()),
    authCheckState: () => dispatch(authCheckState()),
    cartLogout: () => dispatch(cartLogout())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Nav));
