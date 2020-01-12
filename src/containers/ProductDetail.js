import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Card, Comment, Container, Dimmer, Divider, Form, Grid, Header, Icon, Image, Item, Label, Loader, Menu, Message, Segment, Select } from 'semantic-ui-react'
import axios from 'axios'
import { productDetailURL, addToCartURL } from '../constants'
import { authAxios } from '../utils'
import { fetchCart } from '../store/actions/cart'

class ProductDetail extends Component {
    state = {
        loading: false,
        error: null,
        data: [],
        formData: {},
    };

    componentDidMount() {
        this.handleFetchItem()
    }

    handleFetchItem = () => {
        const { match: { params } } = this.props
        this.setState({ loading: true })
        axios.get(productDetailURL(params.productID))
            .then(res => {
                this.setState({ data: res.data, loading: false });
            })
            .catch(err => {
                this.setState({ error: err })
            })
    }


    handleFormatData = formData => {
        return Object.keys(formData).map(key => {
            return formData[key]
        })
    }

    handleClick = (e, { name, content }) => {
        const { formData } = this.state
        const updatedFormData = {
            ...formData,
            [name]: content
        }
        this.setState({ formData: updatedFormData })
    }

    handleAddToCart = slug => {
        this.setState({ loading: true, error: null });
        const { formData } = this.state;
        const variations = this.handleFormatData(formData)
        authAxios.post(addToCartURL, { slug, variations })
            .then(res => {
                this.props.fetchCart();
                this.setState({ loading: false });
            })
            .catch(err => {
                this.setState({ error: err })
            })
    }

    renderLabelColor = value => {
        switch (value) {
            case "New":
                return 'orange'
            case "Out of Stock":
                return 'grey'
            case "Popular":
                return 'violet'
            case "Clearance":
                return 'red'
        }

    }

    render() {
        const { data, error, formData, loading } = this.state
        const item = data
        return (
            <Container style={{ margin: '5em 0' }}>
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
                <Grid columns={2} >
                    <Grid.Row>
                        <Grid.Column>
                            <Card
                                fluid
                                image={item.image}
                            />
                        </Grid.Column>
                        <Grid.Column>
                            {item.label && <Label as='a' color={this.renderLabelColor(item.label)} size='huge' ribbon='right'>
                                {item.label}
                            </Label>}
                            <Header size='huge' fluid textAlign="center">{item.title}</Header>
                            <Header size='medium' fluid textAlign="center">{item.category} - {item.origin}</Header>
                            <Header size='Large' fluid textAlign="center">{item.description}</Header>
                            <Divider />
                            <Form style={{ marginTop: "8em" }} >
                                {item.variations && item.variations.map(variation => {
                                    const name = variation.name.toLowerCase()
                                    return <Form.Field key={variation.id} style={{ textAlign: 'center' }}>
                                        <Header as='h3' >
                                            * {variation.name}:
                                        </Header>
                                        <Menu secondary >
                                            {variation.item_variations.map(item_variation => {
                                                return (
                                                    <Menu.Item
                                                        key={item_variation.id}
                                                        name={name}
                                                        content={item_variation.id}
                                                        active={item_variation.id === formData[name]}
                                                        onClick={this.handleClick}
                                                    >
                                                        {item_variation.value}
                                                    </Menu.Item>
                                                )
                                            })}
                                        </Menu>
                                    </Form.Field>
                                })}

                                <Form.Button floated='right' color="olive" icon labelPosition="right" onClick={() => this.handleAddToCart(item.slug)}>
                                    Add to Cart <Icon name='cart plus' />
                                </Form.Button>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>



                <Comment.Group style={{ marginTop: '5em' }}>
                    <Divider />

                    <Comment>
                        <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/stevie.jpg' />
                        <Comment.Content>
                            <Comment.Author>Stevie Feliciano</Comment.Author>
                            <Comment.Metadata>
                                <div>2 days ago</div>
                                <div>
                                    <Icon name='star' />5 Faves
          </div>
                            </Comment.Metadata>
                            <Comment.Text>
                                Hey guys, I hope this example comment is helping you read this
                                documentation.
        </Comment.Text>
                        </Comment.Content>
                    </Comment>
                </Comment.Group>
            </Container >
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchCart: () => dispatch(fetchCart())
    }
}

export default withRouter(connect(null, mapDispatchToProps)(ProductDetail))