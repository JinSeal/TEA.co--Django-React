import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  Dimmer,
  Divider,
  Form,
  Grid,
  Header,
  Image,
  Label,
  Loader,
  Menu,
  Message,
  Segment,
  Select,
  Table
} from "semantic-ui-react";
import { authAxios } from "../utils";
import axios from "axios";
import {
  addressListURL,
  addressCreateURL,
  addressUpdateURL,
  addressDeleteURL,
  countryListURL,
  userIDURL,
  paymentListURL
} from "../constants";

const UPDATE_FORM = "UPDATE_FORM";
const CREATE_FORM = "CREATE_FORM";

class AddressForm extends Component {
  state = {
    loading: false,
    error: null,
    formData: {
      address_type: "",
      apartment_address: "",
      country: "",
      default: false,
      id: "",
      street_address: "",
      user: 1,
      zip: ""
    },
    saving: false,
    success: false,
    userID: null
  };

  componentDidMount() {
    this.handleFetchUserID();
    const { address, formType } = this.props;
    if (formType === UPDATE_FORM) {
      this.setState({ formData: address });
    }
  }

  handleFetchUserID = () => {
    authAxios
      .get(userIDURL)
      .then(res => this.setState({ userID: res.data.userID }))
      .catch(err => this.setState({ error: err }));
  };

  handleChange = e => {
    const { formData } = this.state;
    const updatedFormdata = {
      ...formData,
      [e.target.name]: e.target.value
    };
    this.setState({
      formData: updatedFormdata
    });
  };

  handleSelectChange = (e, { name, value }) => {
    const { formData } = this.state;
    const updatedFormdata = {
      ...formData,
      [name]: value
    };
    this.setState({
      formData: updatedFormdata
    });
  };
  handleToggleCheckbox = () => {
    this.setState(prevState => ({ checked: !prevState.checked }));

    const { formData } = this.state;
    const updatedFormdata = {
      ...formData,
      default: !formData.default
    };
    this.setState({
      formData: updatedFormdata
    });
  };

  handleSubmit = e => {
    this.setState({ saving: true });
    e.preventDefault();
    const { formType } = this.props;
    if (formType === UPDATE_FORM) {
      this.handleUpdateAddress();
    } else {
      this.handleCreateAddress();
    }
  };

  handleCreateAddress = () => {
    const { activeItem } = this.props;
    const { formData, userID } = this.state;
    authAxios
      .post(addressCreateURL, {
        ...formData,
        user: userID,
        address_type: activeItem === "Billing Address" ? "B" : "S"
      })
      .then(res => {
        this.setState({
          saving: false,
          success: true,
          formData: { default: false }
        });
        this.props.callback();
      })
      .catch(err => {
        this.setState({ error: err, saving: false });
      });
  };

  handleUpdateAddress = () => {
    const { activeItem } = this.props;
    const { formData, userID } = this.state;
    authAxios
      .put(addressUpdateURL(formData.id), {
        ...formData,
        user: userID,
        address_type: activeItem === "Billing Address" ? "B" : "S"
      })
      .then(res => {
        this.setState({
          saving: false,
          success: true,
          formData: { default: false }
        });
        this.props.callback();
      })
      .catch(err => {
        this.setState({ error: err, saving: false });
      });
  };

  render() {
    const { error, formData, saving, success } = this.state;
    const { countries } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} success={success} error={error}>
        <Form.Input
          required
          name="apartment_address"
          value={formData.apartment_address}
          placeholder="Unit number"
          onChange={this.handleChange}
        />
        <Form.Input
          required
          name="street_address"
          value={formData.street_address}
          placeholder="Street address"
          onChange={this.handleChange}
        />
        <Form.Field required>
          <Select
            loading={countries.length < 2}
            clearable
            search
            value={formData.country}
            options={countries}
            name="country"
            placeholder="Country"
            onChange={this.handleSelectChange}
          />
        </Form.Field>
        <Form.Input
          required
          name="zip"
          value={formData.zip}
          placeholder="Post code"
          onChange={this.handleChange}
        />
        <Form.Checkbox
          name="default"
          checked={formData.default}
          label="Make this the default address"
          onChange={this.handleToggleCheckbox}
        />
        {success && (
          <Message
            success
            header="Form Completed"
            content="Your address was saved."
          />
        )}
        {error && (
          <Message
            error
            header="There was an error."
            content={JSON.stringify(error)}
          />
        )}

        <Form.Button disabled={saving} loading={saving}>
          Save
        </Form.Button>
      </Form>
    );
  }
}

class PaymentHistoryForm extends Component {
  state = {
    data: null,
    loading: false,
    error: null
  };

  componentDidMount() {
    this.handleFetchPayments();
  }

  handleFetchPayments = () => {
    this.setState({ loading: true });
    authAxios
      .get(paymentListURL)
      .then(res => {
        this.setState({ loading: false, data: res.data });
        console.log(res.data);
      })
      .catch(err => this.setState({ loading: false, error: err }));
  };

  render() {
    const { loading, error, data } = this.state;
    return (
      <React.Fragment>
        {loading && (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>

            <Image src="/images/wireframe/short-paragraph.png" />
          </Segment>
        )}
        {error && (
          <Message
            error
            header="There was some errors."
            content={JSON.stringify(error)}
          />
        )}
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Payment ID</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data &&
              data.map(payment => {
                return (
                  <Table.Row key={payment.id}>
                    <Table.Cell>{payment.id}</Table.Cell>
                    <Table.Cell>{payment.amount}</Table.Cell>
                    <Table.Cell>
                      {new Date(payment.timestamp).toUTCString()}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table>
      </React.Fragment>
    );
  }
}

class Profile extends Component {
  state = {
    loading: null,
    error: null,
    activeItem: "Billing Address",
    addresses: [],
    countries: [],
    selectedAddress: null
  };

  componentDidMount() {
    this.handleFetchAddresses();
    this.handleFetchCountries();
  }

  handleActiveItem = () => {
    const { activeItem } = this.state;
    switch (activeItem) {
      case "Shipping Address":
        return "Shipping Address";
      case "Payment History":
        return "Payment History";
      default:
        return "Billing Address";
    }
  };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name }, () => {
      this.handleFetchAddresses();
    });
  };

  handleSelectAddress = address => {
    this.setState({ selectedAddress: address });
  };

  handleDeleteAddress = addressID => {
    authAxios
      .delete(addressDeleteURL(addressID))
      .then(res => this.handleCallback())
      .catch(err => this.setState({ error: err }));
  };

  handleFormatCountries = countries => {
    const keys = Object.keys(countries);
    return keys.map(k => {
      return {
        key: k,
        text: countries[k],
        value: k
      };
    });
  };

  handleFetchCountries = () => {
    axios
      .get(countryListURL)
      .then(res =>
        this.setState({ countries: this.handleFormatCountries(res.data) })
      )
      .catch(err => this.setState({ error: err }));
  };

  handleFetchAddresses = () => {
    this.setState({ loaidng: true });
    const { activeItem } = this.state;
    const addressType = activeItem === "Billing Address" ? "B" : "S";
    authAxios
      .get(addressListURL(addressType))
      .then(res => this.setState({ addresses: res.data, loading: false }))
      .catch(err => this.setState({ error: err, loading: false }));
  };

  handleCallback = () => {
    this.handleFetchAddresses();
    this.setState({ selectedAddress: null });
  };

  renderAddresses = () => {
    const { activeItem, addresses, countries, selectedAddress } = this.state;

    return (
      <React.Fragment>
        {addresses &&
          addresses.map(address => {
            return (
              <Card fluid key={address.id}>
                <Card.Content>
                  {address.default && (
                    <Label as="a" color="blue" ribbon="right">
                      Default
                    </Label>
                  )}
                  <Card.Header>
                    {address.apartment_address},{address.street_address}
                  </Card.Header>
                  <Card.Meta>{address.country}</Card.Meta>
                  <Card.Description>{address.zip}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    basic
                    color="green"
                    onClick={() => this.handleSelectAddress(address)}
                  >
                    Update
                  </Button>
                  <Button
                    basic
                    color="red"
                    onClick={() => this.handleDeleteAddress(address.id)}
                  >
                    Delete
                  </Button>
                </Card.Content>
              </Card>
            );
          })}
        {addresses.length > 0 ? <Divider /> : null}
        {selectedAddress === null ? (
          <AddressForm
            formType={CREATE_FORM}
            countries={countries}
            activeItem={activeItem}
            callback={this.handleCallback}
          />
        ) : null}
        {selectedAddress && (
          <AddressForm
            formType={UPDATE_FORM}
            countries={countries}
            address={selectedAddress}
            activeItem={activeItem}
            callback={this.handleCallback}
          />
        )}
      </React.Fragment>
    );
  };

  render() {
    const { activeItem, loading, error } = this.state;
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    return (
      <Container style={{ margin: "5em 0" }}>
        <Grid container columns={2} divided>
          <Grid.Row>
            <Grid.Column columns={1}>
              {loading && (
                <Segment>
                  <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                  </Dimmer>

                  <Image src="/images/wireframe/short-paragraph.png" />
                </Segment>
              )}
              {error && (
                <Message
                  error
                  header="There was some errors."
                  content={JSON.stringify(error)}
                />
              )}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}>
              <Menu pointing vertical fluid>
                <Menu.Item
                  name="Billing Address"
                  active={activeItem === "Billing Address"}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  name="Shipping Address"
                  active={activeItem === "Shipping Address"}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  name="Payment History"
                  active={activeItem === "Payment History"}
                  onClick={this.handleItemClick}
                />
              </Menu>
            </Grid.Column>
            <Grid.Column width={10}>
              <Header>{this.handleActiveItem()}</Header>
              <Divider />
              {activeItem === "Payment History" ? (
                <PaymentHistoryForm />
              ) : (
                this.renderAddresses()
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};
export default connect(mapStateToProps)(Profile);
