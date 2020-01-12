import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Accordion, Card, Container, Dimmer, Divider, Form, Grid, Header, Image, Label, Loader, Menu, Message, Pagination, Search, Segment, Select, Dropdown } from 'semantic-ui-react'
import axios from 'axios'
import { productListURL, addToCartURL, filterListURL } from '../constants'
import { authAxios } from '../utils'
import { fetchCart } from '../store/actions/cart'



const FilterForm = (key, filter, checked, func) => {
    return (
        <React.Fragment>
            <Form.Group grouped>
                <Form.Radio label={"All"} name={key} type='radio' value={""} onChange={func} checked={checked === ""} />
                {filter.map(value => {
                    return (
                        <Form.Radio key={value[1]} label={value[1]} name={key} type='radio' value={value[0]} onChange={func} checked={checked === value[0]} />
                    )
                })}
            </Form.Group>
        </React.Fragment>
    )
}


class ProductList extends Component {
    state = {
        loading: false,
        error: null,
        data: null,
        activeIndex: 0,
        activePage: 1,
        pageSize: 9,
        searchValue: "",
        filter: null,
        Category: "",
        Origin: "",
        Label: "",
        activeFilter: { "Category": true, "Origin": true, "Label": true }
    };

    componentDidMount() {
        this.handleFetchProducts()
        this.handleFetchFilterList()
    }

    handleFetchProducts = () => {
        const { activePage, pageSize, searchValue } = this.state
        this.setState({ loading: true, error: null })
        axios.get(productListURL(activePage, pageSize, searchValue))
            .then(res => {
                this.setState({ data: res.data, loading: false });
            })
            .catch(err => {
                this.setState({ error: err })
            })
    }

    handleFetchFilterList = () => {
        this.setState({ loading: true, error: null })
        axios.get(filterListURL)
            .then(res => {
                this.setState({ filter: res.data, loading: false });
            })
            .catch(err => {
                this.setState({ error: err })
            })
    }

    handleClick = (e, titleProps) => {
        const { content } = titleProps
        const { activeFilter } = this.state
        const updatedData = {
            ...activeFilter,
            [content]: !activeFilter[content]
        }
        this.setState({
            activeFilter: updatedData
        })
    }

    handlePaginationChange = (e, { activePage }) => {
        this.setState({ activePage }, () => this.handleFetchProducts())

    }

    handleChange = (e, { value }) =>
        this.setState({ pageSize: value }, () => this.handleFetchProducts())

    handleFilterChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    handleFilterSubmit = () => {
        this.setState({ error: null })
        const { activePage, pageSize, searchValue, Category, Origin, Label } = this.state
        axios.get(productListURL(activePage, pageSize, searchValue, Category, Origin, Label))
            .then(res => {
                this.setState({ data: res.data });
            })
            .catch(err => {
                this.setState({ error: err })
            })
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ searchValue: value }, () => {
            const { activePage, pageSize, searchValue } = this.state
            this.setState({ error: null })
            axios.get(productListURL(activePage, pageSize, searchValue))
                .then(res => {
                    this.setState({ data: res.data });
                })
                .catch(err => {
                    this.setState({ error: err })
                })
        })
    }

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
        const { data, error, loading, activePage, pageSize, searchValue, filter, activeFilter } = this.state

        return (
            <Container style={{ margin: "4em 0" }}>
                <Grid>

                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Search
                                fluid
                                showNoResults={false}
                                loading={loading}
                                onSearchChange={_.debounce(this.handleSearchChange, 500, {
                                    leading: true,
                                })}
                                placeholder="Search by tea"
                                value={searchValue}
                                style={{ marginBottom: "2.2em" }}
                            />
                            <Form onSubmit={this.handleFilterSubmit}>
                                <Accordion as={Menu} vertical>
                                    {filter && Object.keys(filter).map((key, i) => {
                                        return (
                                            <Menu.Item key={i}>
                                                <Accordion.Title as="h3"
                                                    active={activeFilter[key]}
                                                    content={key}
                                                    index={i}
                                                    onClick={this.handleClick}
                                                />
                                                <Accordion.Content active={activeFilter[key]} content={FilterForm(key, filter[key], this.state[key], this.handleFilterChange)} />
                                            </Menu.Item>
                                        )
                                    })}
                                </Accordion>
                                <Form.Button color="olive" fluid style={{ marginTop: "2em" }}>Filter</Form.Button>
                            </Form>


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