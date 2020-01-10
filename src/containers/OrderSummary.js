import React, { Component } from "react";
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Button, Container, Dimmer, Header, Icon, Image, Label, Loader, Message, Table, Segment } from 'semantic-ui-react'
import { authAxios } from "../utils";
import { addToCartURL, orderSummaryURL, updateOrderItemQuantityURL, removeOrderItemURL } from "../constants";


class OrderSummary extends Component {

    state = {
        data: null,
        error: null,
        loading: false
    }

    componentDidMount() {
        this.handleFetchOrder()
    }

    renderVariations = orderItem => {
        let text = ""
        orderItem.item_variations.forEach(iv => {
            text += `${iv.variations.name}: ${iv.value}, `
        })
        return text
    }

    handleFetchOrder = () => {
        this.setState({ loading: true })
        authAxios
            .get(orderSummaryURL)
            .then(res => {
                this.setState({ data: res.data, loading: false })
            })
            .catch(err => {
                if (err.response.status === 404) {
                    this.setState({ error: "You currently do not have an order.", loading: false })
                } else {
                    this.setState({ error: err, loading: false })
                }
            })
    }

    handleDeleteItem = itemID => {
        authAxios
            .delete(removeOrderItemURL(itemID))
            .then(res => { this.handleFetchOrder() })
            .catch(err => this.setState({ error: err }))
    }

    handleFormatData = itemVariations => {
        return Object.keys(itemVariations).map(key => {
            return itemVariations[key].id
        })
    }

    handleAddToCart = (slug, item_variations) => {
        this.setState({ loading: true });
        const variations = this.handleFormatData(item_variations)
        authAxios.post(addToCartURL, { slug, variations })
            .then(res => {
                this.handleFetchOrder();
                this.setState({ loading: false });
            })
            .catch(err => {
                this.setState({ error: err })
            })
    }

    handleRemoveFromCart = slug => {
        this.setState({ loading: true })
        authAxios
            .post(updateOrderItemQuantityURL, { slug })
            .then(res => {
                this.handleFetchOrder()
                this.setState({ loading: false })
            })
            .catch(err => {
                this.setState({ error: err, loading: false })
            })
    }


    render() {
        const { data, error, loading } = this.state
        const { isAuthenticated } = this.props
        if (!isAuthenticated) {
            return <Redirect to="/login" />
        }
        return (
            <Container>
                <Header as='h3'>Order Summary</Header>
                {error && <Message negative>
                    <Message.Header>There was an error.</Message.Header>
                    <p>{JSON.stringify(error)}</p>
                </Message>}
                {loading && <Segment>
                    <Dimmer active inverted>
                        <Loader inverted>Loading</Loader>
                    </Dimmer>

                    <Image src='/images/wireframe/short-paragraph.png' />
                </Segment>
                }
                {data && <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Item #</Table.HeaderCell>
                            <Table.HeaderCell>Item Name</Table.HeaderCell>
                            <Table.HeaderCell>Item Price</Table.HeaderCell>
                            <Table.HeaderCell>Item Quantity</Table.HeaderCell>
                            <Table.HeaderCell>Total Item Price</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {data.order_items.map((order_item, i) => {
                            console.log(order_item);

                            return (
                                <Table.Row key={order_item.id}>

                                    <Table.Cell>{i + 1}</Table.Cell>
                                    <Table.Cell>{order_item.item.title} - {this.renderVariations(order_item)}</Table.Cell>
                                    <Table.Cell>${order_item.item.price}</Table.Cell>
                                    <Table.Cell textAlign='center'>
                                        <Icon
                                            name='plus'
                                            color='lightGray'
                                            style={{ float: 'left', cursor: 'pointer' }}
                                            onClick={() => this.handleAddToCart(order_item.item.slug, order_item.item_variations)}
                                        />
                                        {order_item.quantity}
                                        <Icon
                                            name='minus'
                                            color='lightGray'
                                            style={{ float: 'right', cursor: 'pointer' }}
                                            onClick={() => this.handleRemoveFromCart(order_item.item.slug)}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        {order_item.item.discount_price &&
                                            <Label color="green" ribbon>ON DISCOUNT</Label>
                                        }
                                        ${order_item.final_price}
                                        <Icon
                                            name='trash'
                                            color='lightgrey'
                                            style={{ float: 'right', cursor: 'pointer' }}
                                            onClick={() => this.handleDeleteItem(order_item.id)}
                                        />

                                    </Table.Cell>
                                </Table.Row>

                            )
                        })}
                        <Table.Row>
                            <Table.Cell />
                            <Table.Cell />
                            <Table.Cell />
                            <Table.Cell />
                            <Table.Cell textAlign='right'>
                                Total: ${data.total}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>

                    <Table.Footer>

                        <Table.Row>

                            <Table.HeaderCell colSpan='5' textAlign='right'>
                                <Link to="/checkout">
                                    <Button color='yellow'>Checkout</Button>
                                </Link>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
                }
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}
export default connect(mapStateToProps)(OrderSummary)