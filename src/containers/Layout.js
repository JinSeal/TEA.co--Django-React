import React from "react";
import {
  Button,
  Container,
  Dropdown,
  Grid,
  Header,
  List,
  Menu,
  Visibility,
  Segment
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";
import { fetchCart } from "../store/actions/cart";


class CustomLayout extends React.Component {
  state = {
    fixed: null,
    activeItem: '',
  }

  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })

  componentDidMount() {
    this.props.fetchCart();
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })


  render() {
    const { fixed, activeItem } = this.state
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
            textAlign='center'
            style={{ padding: '1em 0em' }}
            vertical
          >
            <Menu
              fixed={fixed ? 'top' : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size='large'
            >
              <Container>
                <Menu.Item as='h1'>
                  Tea.co
                </Menu.Item>
                <Menu.Item
                  as='a'
                  name='home'
                  // active={activeItem === 'home' || activeItem === ''}
                  onClick={this.handleItemClick} >
                  <Link to="/" style={{ color: fixed ? "olive" : null }}>Home</Link>
                </Menu.Item>
                <Menu.Item
                  as='a'
                  name='products'
                  active={activeItem === 'products'}
                  onClick={this.handleItemClick}
                >
                  <Link to="/products" style={{ color: fixed ? "olive" : null }}>Tea</Link>
                </Menu.Item>


                {authenticated ?
                  <React.Fragment>
                    <Menu.Item
                      as='a'
                      position='right'
                      name='profile'
                      active={activeItem === 'profile'}
                      onClick={this.handleItemClick}
                    >
                      <Link to="/profile" style={{ color: fixed ? "olive" : null }}>Profile</Link>
                    </Menu.Item>
                    <Dropdown as='a' loading={loading} text={`${cart !== null ? cart.order_items.length : 0} items`} pointing className='link item' icon='cart'>
                      <Dropdown.Menu>
                        {cart !== null ?
                          <React.Fragment>
                            {cart.order_items.map(order_item => {
                              return <Dropdown.Item key={order_item.id}>{order_item.quantity} x {order_item.item.title}</Dropdown.Item>
                            })}
                            <Dropdown.Divider />
                            <Dropdown.Item icon='arrow right' text='Checkout' onClick={() => this.props.history.push('/order-summary')} />
                          </React.Fragment>
                          : <Dropdown.Item text='No items in your cart' />
                        }
                      </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Item as='a' onClick={() => this.props.logout()}>
                      Logout
                    </Menu.Item>
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <Menu.Item position='right'>
                      <Link to="/login">
                        <Button as='a' inverted={!fixed} >
                          Log in
                  </Button>
                      </Link>
                      <Link to="/signup">
                        <Button as='a' inverted={!fixed} color={fixed ? "olive" : null} style={{ marginLeft: '0.5em' }}>
                          Sign Up
                  </Button>
                      </Link>
                    </Menu.Item>
                  </React.Fragment>
                }
              </Container>
            </Menu >
          </Segment>
        </Visibility >

        {this.props.children}

        < Segment inverted vertical style={{ padding: '5em 0em' }
        }>
          <Container>
            <Grid divided inverted stackable>
              <Grid.Row>
                <Grid.Column width={3}>
                  <Header inverted as='h4' content='About' />
                  <List link inverted>
                    <List.Item as='a'>Sitemap</List.Item>
                    <List.Item as='a'>Contact Us</List.Item>
                    <List.Item as='a'>Religious Ceremonies</List.Item>
                    <List.Item as='a'>Gazebo Plans</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Header inverted as='h4' content='Services' />
                  <List link inverted>
                    <List.Item as='a'>Banana Pre-Order</List.Item>
                    <List.Item as='a'>DNA FAQ</List.Item>
                    <List.Item as='a'>How To Access</List.Item>
                    <List.Item as='a'>Favorite X-Men</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column width={7}>
                  <Header as='h4' inverted>
                    Footer Header
              </Header>
                  <p>
                    Extra space for a call to action inside the footer that could help re-engage users.
              </p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment >
      </div >
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
    fetchCart: () => dispatch(fetchCart())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CustomLayout)
);

