import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Card, Container, Dimmer, Divider, Form, Grid, Header, Icon, Image, Item, Label, Loader, Message, Segment, Select } from 'semantic-ui-react'
import axios from 'axios'
import { productDetailURL, addToCartURL } from '../constants'
import { authAxios } from '../utils'
import { fetchCart } from '../store/actions/cart'

class ProductDetail extends Component {
    state = {
        loading: false,
        error: null,
        data: [],
        formVisible: false,
        formData: {}
    };

    componentDidMount() {
        this.handleFetchItem()
    }

    handleFetchItem = () => {
        const { match: { params } } = this.props
        this.setState({ loading: true })
        axios.get(productDetailURL(params.productID))
            .then(res => {
                console.log(res.data);

                this.setState({ data: res.data, loading: false });
            })
            .catch(err => {
                this.setState({ error: err })
            })
    }

    handleToggleForm = () => {
        const { formVisible } = this.state
        this.setState({
            formVisible: !formVisible
        })
    }

    handleFormatData = formData => {
        return Object.keys(formData).map(key => {
            return formData[key]
        })
    }

    handleChange = (e, { name, value }) => {
        const { formData } = this.state
        const updatedFormData = {
            ...formData,
            [name]: value
        }
        this.setState({ formData: updatedFormData })

    }

    handleAddToCart = slug => {
        this.setState({ loading: true });
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

    render() {
        const { data, error, formData, formVisible, loading } = this.state
        const item = data
        return (
            <Container>
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
                <Grid columns={2} divided>
                    <Grid.Row>
                        <Grid.Column>
                            <Card
                                fluid
                                image={item.image}
                                header={item.title}
                                meta={
                                    <React.Fragment>
                                        {item.category}
                                        {item.discount_price && <Label color={item.label === 'primary' ? 'blue' : item.label === 'secondary' ? 'green' : 'olive'}>{item.label}</Label>}

                                    </React.Fragment>
                                }
                                description={item.description}
                                extra={(
                                    <Item.Extra>
                                        <Button fluid primary floated='right' icon labelPosition="right" onClick={this.handleToggleForm}>
                                            Add to Cart <Icon name='cart plus' />
                                        </Button>

                                    </Item.Extra>
                                )}
                            />
                            {formVisible &&
                                <React.Fragment>
                                    <Divider />
                                    <Form>
                                        {data.variations.map(variation => {
                                            const name = variation.name.toLowerCase()
                                            return <Form.Field key={variation.id}>
                                                <Select
                                                    name={name}
                                                    onChange={this.handleChange}
                                                    options={variation.item_variations.map(item_variation => {
                                                        return {
                                                            key: item_variation.id,
                                                            text: item_variation.value,
                                                            value: item_variation.id
                                                        }
                                                    })}
                                                    placeholder={`Choose a ${name}`}
                                                    selection
                                                    value={formData[name]}
                                                />

                                            </Form.Field>
                                        })}

                                        <Form.Button onClick={() => this.handleAddToCart(item.slug)}>
                                            Submit
                                </Form.Button>
                                    </Form>
                                </React.Fragment>
                            }
                        </Grid.Column>
                        <Grid.Column>
                            <Header as='h2'>
                                Try different variation
                            </Header>
                            {item.variations && item.variations.map(variation => {
                                return (
                                    <React.Fragment key={variation.id}>

                                        <Header as='h3'>
                                            {variation.name}
                                        </Header>
                                        <Item.Group divided >
                                            {variation.item_variations.map(item_variation => {
                                                return (
                                                    <Item key={item_variation.id}>
                                                        {item_variation.attachment && <Item.Image size='tiny' src={`http://127.0.0.1:8000${item_variation.attachment}`} />}
                                                        <Item.Content verticalAlign='middle'>{item_variation.value}</Item.Content>
                                                    </Item>
                                                )
                                            })}
                                        </Item.Group>
                                    </React.Fragment>
                                )
                            })}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>


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