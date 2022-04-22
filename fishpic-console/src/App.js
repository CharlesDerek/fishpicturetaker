import { LinkContainer } from 'react-router-bootstrap';
import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { getImages } from 'lib/api';
import "./App.css";
import Routes from './Routes';
import { Auth } from 'aws-amplify';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      images: [],
      loading: false,
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
  
    this.setState({ isAuthenticating: false });
    await this.loadImages();
  }
  
  loadImages = async () => {
      this.setState({ loading: true });
      const images = await getImages();
      this.setState({ images, loading: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = async event => {
    await Auth.signOut();

    this.userHasAuthenticated(false);

    this.props.history.push("/login");
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };
    const annotatableImages = this.state.images.filter(x => x.userShouldAnnotate);

    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <Navbar collapseOnSelect bg="light" expand="lg">
          <Navbar.Brand>
            <Link to="/">Fishpic Console</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
            {this.state.isAuthenticated
              ? <>
                  <Link to="/images">All Images ({this.state.images.length})</Link>
                  <Link to="/images/annotatable">Annotatable Images ({annotatableImages.length})</Link>
                  <NavItem onClick={this.handleLogout}>Logout</NavItem>
                </>
              : <Fragment>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </Fragment>
            }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);