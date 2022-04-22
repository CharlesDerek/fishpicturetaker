import React, { Component } from "react";
import { FormGroup, FormControl, Form } from "react-bootstrap";
import "./Login.css";
import LoaderButton from '../components/LoaderButton';
import { Auth } from 'aws-amplify';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
        isLoading: false,
        email: "",
        password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });
  
    try {
      await this.authenticate(); 
      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  authenticate = async () => {
    const user = await Auth.signIn(this.state.email, this.state.password);
    if (user.signInUserSession === null) {
      throw new Error(user.challengeName);
    }
    const groups = user.signInUserSession.accessToken.payload['cognito:groups'];
    if (groups.indexOf("Annotators") === -1) {
      throw new Error("User lacks needed group membership.")
    }
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email">
            <Form.Label>Email</Form.Label>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password">
            <Form.Label>Password</Form.Label>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <LoaderButton
            block
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Logging in…"
            />
        </form>
      </div>
    );
  }
}