import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Card,
  Comment,
  Container,
  Divider,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Label,
  Menu,
  Message,
  Segment
} from "semantic-ui-react";
import axios from "axios";
import { productDetailURL, productListURL, addToCartURL } from "../constants";
import { authAxios } from "../utils";
import { fetchCart } from "../store/actions/cart";
import PropTypes from "prop-types";

class ProductDetail extends Component {
  state = {
    loading: false,
    error: null,
    data: [],
    formData: {},
    ads: null,
    msg: null
  };

  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchCart: PropTypes.func.isRequired,
    loading: PropTypes.bool
  };

  componentDidMount() {
    const {
      match: { params }
    } = this.props;
    this.handleFetchItem(params.productID);
  }

  handleFetchItem = itemID => {
    this.setState({ loading: true });
    axios
      .get(productDetailURL(itemID))
      .then(res => {
        this.setState({ data: res.data, loading: false });
        axios
          .get(productListURL(1, 5, "", res.data.category.slice(0, 1)))
          .then(res => {
            this.setState({ ads: res.data, loading: false });
          })
          .catch(err => {
            this.setState({ error: err });
          });
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  handleFormatData = formData => {
    return Object.keys(formData).map(key => {
      return formData[key];
    });
  };

  handleClick = (name, id) => {
    const { formData } = this.state;
    const updatedFormData = {
      ...formData,
      [name]: id
    };
    this.setState({ formData: updatedFormData });
  };

  handleAddToCart = slug => {
    this.setState({ loading: true, error: null, msg: null });
    const { formData } = this.state;
    const variations = this.handleFormatData(formData);
    authAxios
      .post(addToCartURL, { slug, variations })
      .then(res => {
        console.log(res);
        this.props.fetchCart();
        this.setState({ loading: false });
      })
      .catch(err => {
        this.setState({
          error: err,
          msg: "Please specify the required variations"
        });
      });
  };

  renderLabelColor = value => {
    switch (value) {
      case "New":
        return "orange";
      case "Out of Stock":
        return "grey";
      case "Popular":
        return "violet";
      case "Clearance":
        return "red";
    }
  };

  render() {
    const { data, error, formData, ads, msg } = this.state;
    const item = data;
    return (
      <Container style={{ margin: "5em 0" }}>
        {error && (
          <Message
            error
            header="There was some errors with your submission"
            content={msg}
          />
        )}
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Card fluid image={item.image} />
            </Grid.Column>
            <Grid.Column>
              {item.label && (
                <Label
                  as="a"
                  color={this.renderLabelColor(item.label)}
                  size="huge"
                  ribbon="right"
                >
                  {item.label}
                </Label>
              )}
              <Header size="huge" textAlign="center">
                {item.title}
              </Header>
              <Header size="medium" textAlign="center">
                {item.category} - {item.origin}
              </Header>
              <Header size="large" textAlign="center">
                {item.description}
              </Header>
              <Divider />
              <Form style={{ marginTop: "8em" }}>
                {item.variations &&
                  item.variations.map(variation => {
                    const name = variation.name.toLowerCase();
                    return (
                      <Form.Field
                        key={variation.id}
                        style={{ textAlign: "center" }}
                      >
                        <Header as="h3">* {variation.name}:</Header>
                        <Menu secondary>
                          {variation.item_variations.map(item_variation => {
                            return (
                              <Menu.Item
                                key={item_variation.id}
                                name={name}
                                active={item_variation.id === formData[name]}
                                onClick={() =>
                                  this.handleClick(name, item_variation.id)
                                }
                              >
                                {item_variation.value}
                              </Menu.Item>
                            );
                          })}
                        </Menu>
                      </Form.Field>
                    );
                  })}

                <Form.Button
                  floated="right"
                  color="olive"
                  icon
                  labelPosition="right"
                  onClick={() => this.handleAddToCart(item.slug)}
                >
                  Add to Cart <Icon name="cart plus" />
                </Form.Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Segment style={{ padding: "8em 0em" }} vertical>
          <Header size="large" style={{ marginBottom: "2em" }}>
            People also viewed:{" "}
          </Header>
          <Grid
            container
            relaxed
            columns={4}
            style={{ display: "flex", overflowX: "auto", flexWrap: "nowrap" }}
          >
            <Grid.Row>
              {ads &&
                ads.results.map(item => {
                  if (item.id === data.id) return;
                  return (
                    <Grid.Column key={item.id}>
                      <Card
                        as={Link}
                        to={`/products/${item.id}/`}
                        onClick={() => {
                          this.handleFetchItem(item.id);
                        }}
                      >
                        <Image
                          size="medium"
                          src={item.image}
                          wrapped
                          ui={false}
                        />
                        <Card.Content>
                          <Card.Header>{item.title}</Card.Header>
                        </Card.Content>
                      </Card>
                    </Grid.Column>
                  );
                })}
            </Grid.Row>
          </Grid>
        </Segment>

        <Comment.Group style={{ marginTop: "5em" }}>
          <Comment>
            <Comment.Avatar
              as="a"
              src="https://react.semantic-ui.com/images/avatar/small/stevie.jpg"
            />
            <Comment.Content>
              <Comment.Author>Stevie Feliciano</Comment.Author>
              <Comment.Metadata>
                <div>2 days ago</div>
                <div>
                  <Icon name="star" />5 Faves
                </div>
              </Comment.Metadata>
              <Comment.Text>
                Hey guys, I hope this example comment is helping you read this
                documentation.
              </Comment.Text>
            </Comment.Content>
          </Comment>
        </Comment.Group>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCart: () => dispatch(fetchCart())
  };
};

export default withRouter(connect(null, mapDispatchToProps)(ProductDetail));
