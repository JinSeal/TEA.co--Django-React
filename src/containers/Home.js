import React from 'react'
import {
    Button,
    Container,
    Divider,
    Grid,
    Header,
    Icon,
    Image,
    Placeholder,
    Segment,
} from 'semantic-ui-react'
import ImageCarousel from './components/ImageCarousel'
import { Link } from 'react-router-dom'

const HomepageLayout = () => (
    <React.Fragment>
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
                <Grid.Column >
                    <Placeholder>
                        <Placeholder.Image square />
                        <Image
                            // src='/images/wireframe/image-text.png'
                            as='a'
                            size='medium'
                            href='http://google.com'
                            target='_blank'
                        />
                    </Placeholder>

                </Grid.Column>
                <Grid.Column>
                    <Placeholder>
                        <Placeholder.Image square />
                        <Image
                            // src='/images/wireframe/image-text.png'
                            as='a'
                            size='medium'
                            href='http://google.com'
                            target='_blank'
                        />
                    </Placeholder>
                </Grid.Column>
                <Grid.Column>
                    <Placeholder>
                        <Placeholder.Image square />
                        <Image
                            // src='/images/wireframe/image-text.png'
                            as='a'
                            size='medium'
                            href='http://google.com'
                            target='_blank'
                        />
                    </Placeholder>
                </Grid.Column>
                <Grid.Column>
                    <Placeholder>
                        <Placeholder.Image square />
                        <Image
                            // src='/images/wireframe/image-text.png'
                            as='a'
                            size='medium'
                            href='http://google.com'
                            target='_blank'
                        />
                    </Placeholder>
                </Grid.Column>
                <Grid.Column>
                    <Placeholder>
                        <Placeholder.Image square />
                        <Image
                            // src='/images/wireframe/image-text.png'
                            as='a'
                            size='medium'
                            href='http://google.com'
                            target='_blank'
                        />
                    </Placeholder>
                </Grid.Column>
                <Grid.Column>
                    <Placeholder>
                        <Placeholder.Image square />
                        <Image
                            // src='/images/wireframe/image-text.png'
                            as='a'
                            size='medium'
                            href='http://google.com'
                            target='_blank'
                        />
                    </Placeholder>
                </Grid.Column>
                <Grid.Column>
                    <Placeholder>
                        <Placeholder.Image square />
                        <Image
                            // src='/images/wireframe/image-text.png'
                            as='a'
                            size='medium'
                            href='http://google.com'
                            target='_blank'
                        />
                    </Placeholder>
                </Grid.Column>
            </Grid>
        </Segment>

        <Segment style={{ padding: '0em' }} vertical>
            <Grid celled='internally' columns='equal' stackable>
                <Grid.Row textAlign='center'>
                    <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                        <Header as='h3' style={{ fontSize: '2em' }}>
                            "What a Company"
            </Header>
                        <p style={{ fontSize: '1.33em' }}>That is what they all say about us</p>
                    </Grid.Column>
                    <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                        <Header as='h3' style={{ fontSize: '2em' }}>
                            "I shouldn't have gone with their competitor."
            </Header>
                        <p style={{ fontSize: '1.33em' }}>
                            <Image avatar src='/images/avatar/large/nan.jpg' />
                            <b>Nan</b> Chief Fun Officer Acme Toys
            </p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>

        <Segment style={{ padding: '8em 0em' }} vertical>
            <Container text>
                <Header as='h3' style={{ fontSize: '2em' }}>
                    Breaking The Grid, Grabs Your Attention
        </Header>
                <p style={{ fontSize: '1.33em' }}>
                    Instead of focusing on content creation and hard work, we have learned how to master the
                    art of doing nothing by providing massive amounts of whitespace and generic content that
                    can seem massive, monolithic and worth your attention.
        </p>
                <Button as='a' size='large'>
                    Read More
        </Button>

                <Divider
                    as='h4'
                    className='header'
                    horizontal
                    style={{ margin: '3em 0em', textTransform: 'uppercase' }}
                >
                    <a href='#'>Case Studies</a>
                </Divider>

                <Header as='h3' style={{ fontSize: '2em' }}>
                    Did We Tell You About Our Bananas?
        </Header>
                <p style={{ fontSize: '1.33em' }}>
                    Yes I know you probably disregarded the earlier boasts as non-sequitur filler content, but
                    it's really true. It took years of gene splicing and combinatory DNA research, but our
                    bananas can really dance.
        </p>
                <Button as='a' size='large'>
                    I'm Still Quite Interested
        </Button>
            </Container>
        </Segment>
    </React.Fragment >
)

export default HomepageLayout