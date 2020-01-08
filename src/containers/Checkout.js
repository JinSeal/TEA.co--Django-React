import React, { Component } from 'react';
import { CardElement, injectStripe, Elements, StripeProvider } from 'react-stripe-elements';
import { Container, Button, Message } from 'semantic-ui-react'
import { authAxios } from '../utils';
import { handlePaymentURL } from "../constants";

class CheckoutForm extends Component {
    state = {
        loading: false,
        error: null,
        success: false
    }

    submit = (ev) => {
        ev.preventDefault();
        if (this.props.stripe) {

            this.setState({ loading: true })
            this.props.stripe.createToken().then(result => {
                if (result.error) {
                    this.setState({ loading: false, error: result.error.message })
                } else {
                    authAxios
                        .post(handlePaymentURL, { stripeToken: result.token.id })
                        .then(res => { this.setState({ loading: false, success: true }) })
                        .catch(err => { this.setState({ error: err, loading: false }) })
                }
            })
        } else {
            console.log("Stripe is not loaded");

        }

    }

    render() {
        const { loading, error, success } = this.state
        return (
            <div>
                {error &&
                    <Message negative>
                        <Message.Header>Your payment was unsuccessful.</Message.Header>
                        <p>{JSON.stringify(error)}</p>
                    </Message>
                }
                {success &&
                    <Message positive>
                        <Message.Header>Your payment was successful.</Message.Header>
                        <p>Go to your <b>profile</b> to see the order delivery status.</p>
                    </Message>}

                <p>Would you like to complete the purchase?</p>
                <CardElement />
                <Button loading={loading} disabled={loading} onClick={this.submit} style={{ marginTop: "10px" }}>Purchase</Button>
            </div>
        );
    }
}

const InjectedForm = injectStripe(CheckoutForm);

const WrappedForm = () => (
    <Container text>
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



