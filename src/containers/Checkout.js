import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { CardElement, injectStripe, Elements, StripeProvider } from 'react-stripe-elements';
import { Container, Button, Message, Item, Header, Divider, Loader, Segment, Dimmer, Image, Label, Form, Select } from 'semantic-ui-react'
import { authAxios } from '../utils';
import { handlePaymentURL, orderSummaryURL, addCouponURL, addressListURL, endpoint } from "../constants";

const OrderPreview = (props) => {
    const { data } = props

    const renderVariations = orderItem => {
        let text = ""
        orderItem.item_variations.forEach(iv => {
            text += `- ${iv.value} `
        })
        return text
    }

    return (
        <React.Fragment>
            {data && <React.Fragment>
                <Item.Group relaxed>
                    {data.order_items.map((order_item, i) => {
                        return (
                            <Item key={i}>
                                <Item.Image size='tiny' src={`${endpoint}/${order_item.item.image}`} />

                                <Item.Content verticalAlign='middle'>
                                    <Item.Header as='a'>{order_item.quantity} x {order_item.item.title} {renderVariations(order_item)}</Item.Header>
                                    <Item.Extra>
                                        <Label>${order_item.final_price}</Label>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                        )
                    })}
                </Item.Group>
                <Item.Group>
                    <Item>
                        <Item.Header>Order Total: ${data.total}</Item.Header>
                        {data.coupon && <Label color="green" style={{ marginLeft: "10px" }}>Current coupon: {data.coupon.code} for ${data.coupon.amount}</Label>}
                    </Item>
                </Item.Group>
            </React.Fragment>
            }
        </React.Fragment>
    )
}

class CouponForm extends Component {
    state = {
        code: '',
    }

    handleChange = (e) => {
        this.setState({ code: e.target.value })
    }

    handleSubmit = (e) => {
        const { code } = this.state
        this.props.handleAddCoupon(e, code)
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                    <label>Coupon</label>
                    <input placeholder='Enter a coupon' value={this.state.code} onChange={this.handleChange} />
                </Form.Field>
                <Button type='submit'>Submit</Button>
            </Form>
        )
    }
}

class CheckoutForm extends Component {
    state = {
        data: null,
        loading: false,
        error: null,
        success: false,
        billingAddresses: [],
        shippingAddresses: [],
        selectedShippingAddress: '',
        selectedBillingAddress: ''
    }

    componentDidMount() {
        this.handleFetchOrder()
        this.handleFetchBillingAddresses()
        this.handleFetchShippingAddresses()
    }

    handleGetDefaultAddress = addresses => {
        const filteredAddresses = addresses.filter(address => address.default === true)
        if (filteredAddresses.length > 0) {
            return filteredAddresses[0].id
        } else {
            return ""
        }
    }

    handleFetchBillingAddresses = () => {
        this.setState({ loaidng: true })
        authAxios
            .get(addressListURL("B"))
            .then(res => this.setState({
                billingAddresses: res.data.map(a => {
                    return {
                        key: a.id,
                        text: `${a.apartment_address}, ${a.street_address}, ${a.country} ${a.zip}`,
                        value: a.id
                    }
                }),
                selectedBillingAddress: this.handleGetDefaultAddress(res.data),
                loading: false
            }))
            .catch(err => this.setState({ error: err, loading: false }))
    }

    handleFetchShippingAddresses = () => {
        this.setState({ loaidng: true })
        authAxios
            .get(addressListURL("S"))
            .then(res => this.setState({
                shippingAddresses: res.data.map(a => {
                    return {
                        key: a.id,
                        text: `${a.apartment_address}, ${a.street_address}, ${a.country} ${a.zip}`,
                        value: a.id
                    }
                }),
                selectedShippingAddress: this.handleGetDefaultAddress(res.data),
                loading: false
            }))
            .catch(err => this.setState({ error: err, loading: false }))
    }

    handleFetchOrder = () => {
        this.setState({ loading: true })
        authAxios
            .get(orderSummaryURL)
            .then(res =>
                this.setState({ data: res.data, loading: false })
            )
            .catch(err => {
                if (err.response.status === 404) {
                    this.props.history.push('/products')
                } else {
                    this.setState({ error: err, loading: false })
                }
            })
    }

    handleAddCoupon = (e, code) => {
        e.preventDefault()
        this.setState({ loading: true })
        authAxios
            .post(addCouponURL, { code })
            .then(res => {
                this.setState({ loading: false })
                this.handleFetchOrder()
            })
            .catch(err => this.setState({ loading: false, error: err }))
    }

    handleSelectChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    submit = (ev) => {
        ev.preventDefault();
        if (this.props.stripe) {
            this.setState({ loading: true })
            this.props.stripe.createToken().then(result => {
                if (result.error) {
                    this.setState({ loading: false, error: result.error.message })
                } else {
                    this.setState({ error: null })
                    const { selectedBillingAddress, selectedShippingAddress } = this.state
                    authAxios
                        .post(handlePaymentURL, { stripeToken: result.token.id, selectedBillingAddress, selectedShippingAddress })
                        .then(res => { this.setState({ loading: false, success: true }) })
                        .catch(err => { this.setState({ error: err, loading: false }) })
                }
            })
        } else {
            console.log("Stripe is not loaded");

        }

    }

    render() {
        const { data, loading, error, success, billingAddresses, shippingAddresses, selectedBillingAddress, selectedShippingAddress } = this.state
        return (
            <Container >
                {loading && (
                    <Segment>
                        <Dimmer active inverted>
                            <Loader inverted>Loading</Loader>
                        </Dimmer>

                        <Image src='/images/wireframe/short-paragraph.png' />
                    </Segment>
                )}
                {error && (
                    <Message
                        error
                        header='There was some errors with your submission'
                        content={JSON.stringify(error)}
                    />
                )}
                <OrderPreview data={data} />
                <Divider />
                <CouponForm handleAddCoupon={(e, code) => this.handleAddCoupon(e, code)} />

                <Divider />
                {billingAddresses.length > 0 ?
                    <React.Fragment>
                        <Header>Select a billing addresses</Header>
                        <Select
                            required
                            fluid
                            clearable
                            name="selectedBillingAddress"
                            options={billingAddresses}
                            value={selectedBillingAddress}
                            onChange={this.handleSelectChange}
                            selection />
                    </React.Fragment>
                    :
                    <Header><Link to="/profile">add billing addresses</Link></Header>
                }
                {shippingAddresses.length > 0 ?
                    <React.Fragment>
                        <Header>Select a shipping addresses</Header>
                        <Select
                            required
                            fluid
                            clearable
                            name="selectedShippingAddress"
                            options={shippingAddresses}
                            value={selectedShippingAddress}
                            onChange={this.handleSelectChange}
                            selection />
                    </React.Fragment>
                    :
                    <Header><Link to="/profile">add shipping addresses</Link></Header>
                }
                {selectedShippingAddress.length < 1 || selectedBillingAddress.length < 1 ?
                    <React.Fragment>
                        <Divider />
                        <Message warning>
                            <Message.Header>Warning</Message.Header>
                            <p>You need to add addresses before you can complete your purchase</p>
                        </Message>
                    </React.Fragment>
                    :
                    <React.Fragment style={{ marginTop: "3em" }}>
                        <Divider />
                        <Header>Would you like to complete the purchase?</Header>
                        <CardElement hidePostalCode={true} />
                        {success &&
                            <Message positive>
                                <Message.Header>Your payment was successful.</Message.Header>
                                <p>Go to your <b>profile</b> to see the order delivery status.</p>
                            </Message>
                        }
                        <Button loading={loading} disabled={loading} onClick={this.submit} style={{ marginTop: "10px" }}>Purchase</Button>
                    </React.Fragment>}
            </Container>
        );
    }
}

const InjectedForm = withRouter(injectStripe(CheckoutForm));

const WrappedForm = () => (
    <Container text style={{ margin: '5em 0' }}>
        <StripeProvider apiKey="pk_test_KiZyYKiQtlmrqhtoGEbkdtuR00es4lCEgx">
            <div>
                <h1>Complete your order</h1>
                <Elements>
                    <InjectedForm />
                </Elements>
            </div>
        </StripeProvider>
    </Container>
)

export default WrappedForm



