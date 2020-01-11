import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Accordion, Breadcrumb, Card, Container, Dimmer, Form, Grid, Header, Image, Label, Loader, Menu, Message, Pagination, Segment, Select, Dropdown } from 'semantic-ui-react'
import axios from 'axios'
import { productListURL, addToCartURL } from '../constants'
import { authAxios } from '../utils'
import { fetchCart } from '../store/actions/cart'


const ColorForm = (
    <Form>
        <Form.Group grouped>
            <Form.Checkbox label='Red' name='color' value='red' />
            <Form.Checkbox label='Orange' name='color' value='orange' />
            <Form.Checkbox label='Green' name='color' value='green' />
            <Form.Checkbox label='Blue' name='color' value='blue' />
        </Form.Group>
    </Form>
)

const SizeForm = (
    <Form>
        <Form.Group grouped>
            <Form.Radio label='Small' name='size' type='radio' value='small' />
            <Form.Radio label='Medium' name='size' type='radio' value='medium' />
            <Form.Radio label='Large' name='size' type='radio' value='large' />
            <Form.Radio label='X-Large' name='size' type='radio' value='x-large' />
        </Form.Group>
    </Form>
)

class ProductList extends Component {
    state = {
        loading: false,
        error: null,
        data: null,
        activeIndex: 0,
        activePage: 1,
        pageSize: 9,
    };


    componentDidMount() {
        this.handleFetchProducts()
    }

    handleFetchProducts = () => {
        const { activePage, pageSize } = this.state
        this.setState({ loading: true, error: null })
        axios.get(productListURL(activePage, pageSize))
            .then(res => {
                this.setState({ data: res.data, loading: false });
            })
            .catch(err => {
                this.setState({ error: err })
            })
    }


    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    handlePaginationChange = (e, { activePage }) => {
        this.setState({ activePage }, () => this.handleFetchProducts())

    }

    handleChange = (e, { value }) =>
        this.setState({ pageSize: value }, () => this.handleFetchProducts())

    handleAddToCart = slug => {
        this.setState({ loading: true });
        authAxios.post(addToCartURL, { slug })
            .then(res => {
                this.props.fetchCart();
                this.setState({ loading: false });
            })
            .catch(err => {
                this.setState({ error: err })
            })
    }


    render() {
        const { data, error, loading, activeIndex, activePage, pageSize } = this.state
        const sections = [
            { key: 'Home', content: 'Home', link: true },
            { key: 'Store', content: 'Store', link: true },
            { key: 'Shirt', content: 'T-Shirt', active: true },
        ]
        return (
            <Container style={{ margin: "4em 0" }}>
                <Grid>

                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Accordion as={Menu} vertical>
                                <Menu.Item>
                                    <Accordion.Title
                                        active={activeIndex === 0}
                                        content='Size'
                                        index={0}
                                        onClick={this.handleClick}
                                    />
                                    <Accordion.Content active={activeIndex === 0} content={SizeForm} />
                                </Menu.Item>
                                <Menu.Item>
                                    <Accordion.Title
                                        active={activeIndex === 1}
                                        content='Colors'
                                        index={1}
                                        onClick={this.handleClick}
                                    />
                                    <Accordion.Content active={activeIndex === 1} content={ColorForm} />
                                </Menu.Item>
                            </Accordion>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Grid.Row>
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
                            </Grid.Row>
                            <Grid.Row style={{ marginBottom: "2em", display: 'flex', justifyContent: "space-between", zIndex: 9 }}>
                                {data && <React.Fragment>
                                    <span>
                                        Page size:
                                <Dropdown
                                            inline
                                            simple
                                            onChange={this.handleChange}
                                            options={[
                                                { key: 3, text: '3', value: 3 },
                                                { key: 9, text: '9', value: 9 },
                                            ]}
                                            selection
                                            value={pageSize}
                                        />
                                    </span>
                                    <Pagination
                                        boundaryRange={1}
                                        defaultActivePage={1}
                                        siblingRange={1}
                                        totalPages={~~(data.count / pageSize) + 1}
                                        activePage={activePage}
                                        onPageChange={this.handlePaginationChange}
                                    />
                                </React.Fragment>}
                            </Grid.Row>
                            <Grid.Row>
                                <Card.Group itemsPerRow={3}>
                                    {data && data.results.map(item => {
                                        return (
                                            <Card key={item.id} >
                                                <Image src={item.image} wrapped />
                                                <Card.Content>
                                                    <Card.Header as='a' onClick={() => this.props.history.push(`/products/${item.id}/`)}>{item.title}</Card.Header>
                                                    <Card.Meta>
                                                        <span className='date'>$ {item.price}.00</span>
                                                    </Card.Meta>
                                                    <Card.Description>
                                                        {item.description}
                                                    </Card.Description>
                                                </Card.Content>
                                            </Card>
                                        )
                                    })}
                                </Card.Group>
                            </Grid.Row>
                            <Grid.Row style={{ margin: "2em 0", textAlign: "center" }}>
                                {data && <Pagination
                                    boundaryRange={1}
                                    defaultActivePage={1}
                                    siblingRange={1}
                                    totalPages={~~(data.count / pageSize) + 1}
                                    activePage={activePage}
                                    onPageChange={this.handlePaginationChange}
                                />}
                            </Grid.Row>
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

export default connect(null, mapDispatchToProps)(ProductList)