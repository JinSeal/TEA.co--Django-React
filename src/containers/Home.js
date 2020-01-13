import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
    Button,
    Card,
    Container,
    Divider,
    Grid,
    Header,
    Icon,
    Image,
    Segment,
} from 'semantic-ui-react'
import { productListURL } from '../constants'

class HomepageLayout extends Component {
    state = {
        error: null,
        products: null
    }

    componentWillMount() {
        this.handleFetchProducts()
    }

    handleFetchProducts = () => {
        axios.get(productListURL(1, 10, ""))
            .then(res => {
                this.setState({ products: res.data.results })
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        const { products } = this.state

        return (
            < React.Fragment >
                <Segment
                    style={{ minHeight: 700, padding: '1em 0em', background: "url('https://cdn.theculturetrip.com/wp-content/uploads/2018/12/rjab76.jpg')", backgroundSize: 'cover' }}
                    vertical
                >
                    <Container >
                        <Header
                            as='h1'
                            content='New Year, New You'
                            inverted
                            style={{
                                fontSize: '4em',
                                fontWeight: 'normal',
                                marginBottom: 0,
                                marginTop: '5em',
                            }}
                        />
                        <Header
                            as='h1'
                            content='New Tea'
                            inverted
                            style={{
                                fontSize: '1.7em',
                                fontWeight: 'normal',
                                marginTop: '1.5em',
                            }}
                        />
                        <Button size='huge' color="olive">
                            <Link to="/products" style={{ color: 'white' }}>Discover More</Link>
                            <Icon name='right arrow' style={{ color: 'white' }} />
                        </Button>
                    </Container>
                </Segment>
                <Segment style={{ padding: '8em 0em' }} vertical>
                    <Grid container relaxed columns={4} style={{ display: 'flex', overflowX: 'auto', flexWrap: 'nowrap' }}>
                        {products && products.map(item => {
                            return (
                                <Grid.Column key={item.id}>
                                    <Card as={Link} to={`/products/${item.id}/`} >
                                        <Image size="medium" src={item.image} wrapped ui={false} />
                                        <Card.Content>
                                            <Card.Header >{item.title}</Card.Header>
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>
                            )
                        })}
                    </Grid>
                </Segment>

                <Segment style={{ padding: '0em' }} vertical>
                    <Grid celled='internally' columns='equal' stackable>
                        <Grid.Row textAlign='center'>
                            <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                                <Header as='h3' style={{ fontSize: '2em' }}>
                                    Note!
            </Header>
                                <p style={{ fontSize: '1.33em' }}>This is a demo website for personal portfolio.</p>
                            </Grid.Column>
                            <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                                <Header as='h3' style={{ fontSize: '2em' }}>
                                    This site is not for commercial purpose
            </Header>
                                <p style={{ fontSize: '1.33em' }}>
                                    All photos and information of products are from https://jingtea.com/.
            </p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>

                <Segment style={{ padding: '8em 0em' }} vertical>
                    <Container text>
                        <Header as='h3' style={{ fontSize: '2em' }}>
                            About Tea
        </Header>
                        <p style={{ fontSize: '1.33em' }}>
                            Tea is an aromatic beverage commonly prepared by pouring hot or boiling water over cured leaves of the Camellia sinensis, an evergreen shrub (bush) native to East Asia. After water, it is the most widely consumed drink in the world. There are many different types of tea; some, like Darjeeling and Chinese greens, have a cooling, slightly bitter, and astringent flavour, while others have vastly different profiles that include sweet, nutty, floral or grassy notes. Tea has a stimulating effect in humans primarily due to its caffeine content.
        </p>
                        <Button as='a' href='https://en.wikipedia.org/wiki/Tea' target='_blank' size='large'>
                            Read More
        </Button>

                        <Divider
                            as='h4'
                            className='header'
                            horizontal
                            style={{ margin: '3em 0em', textTransform: 'uppercase' }}
                        >
                            <a href='#'>Tea Ceremony</a>
                        </Divider>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/KfDTuNyup9Y" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                    </Container>
                </Segment>
            </React.Fragment >)
    }
}
export default HomepageLayout