import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import POReqTransChecks from './POReqTransChecks';
import POReqTransButton from './POReqTransButton';
//import styles from './Home.css';
//import { Jumbotron, Button, Navbar, NavbarHeader, NavbarBrand,NavbarToggle,NavbarCollapse,  Nav, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import { Grid, Row, Glyphicon, FormGroup,ControlLabel, FormControl, Col, Checkbox, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, MenuItem, Jumbotron,Button} from 'react-bootstrap';
import {Header as NavbarHeader, Brand as NavbarBrand, Toggle as NavbarToggle, Collapse as NavbarCollapse } from 'react-bootstrap/lib/Navbar'
/*
.jumbotron {
    background-color:black !important; 
}
*/


export default class POReqTrans extends Component {

  static propTypes = {
    checks: PropTypes.object.isRequired,
    setCheck1: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };

  }

  toggle() {
    this.setState({loading: !this.state.loading});
  }


/*
if (loggedIn) {
  loginButton = <LogoutButton />;
} else {
  loginButton = <LoginButton />;
}
*/

  render() {

  const jbk ={backgroundColor: 'black' };
    return (
      <div>
  <Navbar inverse>
    <NavbarHeader>
      <NavbarBrand>
        <a href="#">IT Groves</a>
      </NavbarBrand>
      <NavbarToggle />
    </NavbarHeader>
    <NavbarCollapse>
      <Nav>
        <LinkContainer to="/POUpdateApp">
          <NavItem eventKey={1}>PO Update</NavItem>
        </LinkContainer>      
        <NavItem eventKey={2} href="#">Link</NavItem>
        <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
          <MenuItem eventKey={3.1}>Action</MenuItem>
          <LinkContainer to="/POUpdateApp">
            <MenuItem eventKey={3.2}>PO Update</MenuItem>
          </LinkContainer>      
          <MenuItem eventKey={3.3}>Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey={3.3}>Separated link</MenuItem>
        </NavDropdown>
      </Nav>
      <Nav pullRight>
        <NavItem eventKey={1} href="#">Link Right</NavItem>
        <NavItem eventKey={2} href="#">Link Right</NavItem>
      </Nav>
    </NavbarCollapse>
  </Navbar>

  <Jumbotron style={jbk} >
    <h1>PO Request Transfer</h1>
    <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
    <p><Button bsStyle="primary"><img src="../logodoc.bmp" height="35" /></Button></p>
          


  </Jumbotron>

    <Grid>

      <Row>
        <Col xs={2} md={4}></Col>
        <Col xs={4} md={4}><POReqTransButton /></Col>
        <Col xs={2} md={4}></Col>
      </Row>
    </Grid>
    <br/>
    <br/>

    <POReqTransChecks />
      
  </div>

    );
  }
}



