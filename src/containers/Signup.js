import React from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment
} from "semantic-ui-react";
import { connect } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import { authSignup } from "../store/actions/auth";
import PropTypes from "prop-types";

class RegistrationForm extends React.Component {
  state = {
    username: "",
    email: "",
    password1: "",
    password2: ""
  };

  static propTypes = {
    signup: PropTypes.func.isRequired,
    error: PropTypes.object,
    loading: PropTypes.bool,
    token: PropTypes.string
  };

  handleSubmit = e => {
    e.preventDefault();
    const { username, email, password1, password2 } = this.state;
    this.props.signup(username, email, password1, password2);
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { username, email, password1, password2 } = this.state;
    const { error, loading, token } = this.props;
    if (token) {
      return <Redirect to="/" />;
    }
    return (
      <Grid
        textAlign="center"
        style={{ height: "75vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="black" textAlign="center">
            Signup to your account
          </Header>
          <React.Fragment>
            {error &&
              Object.keys(error).map(err => {
                return (
                  <p key={err} style={{ color: "red", textAlign: "left" }}>
                    - {err}: {error[err]}{" "}
                  </p>
                );
              })}
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  onChange={this.handleChange}
                  value={username}
                  name="username"
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Username"
                />
                <Form.Input
                  onChange={this.handleChange}
                  value={email}
                  name="email"
                  fluid
                  icon="mail"
                  iconPosition="left"
                  placeholder="E-mail address"
                />
                <Form.Input
                  onChange={this.handleChange}
                  fluid
                  value={password1}
                  name="password1"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Contain at least 6 digits"
                  type="password"
                />
                <Form.Input
                  onChange={this.handleChange}
                  fluid
                  value={password2}
                  name="password2"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Confirm password"
                  type="password"
                />

                <Button
                  color="olive"
                  fluid
                  size="large"
                  loading={loading}
                  disabled={loading}
                >
                  Signup
                </Button>
              </Segment>
            </Form>
            <Message>
              Already have an account?{" "}
              <NavLink style={{ color: "olive" }} to="/login">
                Login
              </NavLink>
            </Message>
          </React.Fragment>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signup: (username, email, password1, password2) =>
      dispatch(authSignup(username, email, password1, password2))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);
