import React, { Component } from 'react';
import { Link } from 'react-router';
//import styles from './Home.css';
//import { Jumbotron, Button, Navbar, NavbarHeader, NavbarBrand,NavbarToggle,NavbarCollapse,  Nav, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import {Header as NavbarHeader, Brand as NavbarBrand, Toggle as NavbarToggle, Collapse as NavbarCollapse } from 'react-bootstrap/lib/Navbar'
export default class Home extends Component {
  render() {

    return (
  <Navbar inverse>
    <NavbarHeader>
      <NavbarBrand>
        <a href="#">React-Bootstrap</a>
      </NavbarBrand>
      <NavbarToggle />
    </NavbarHeader>
    <NavbarCollapse>
      <Nav>
        <NavItem eventKey={1} href="#">Link</NavItem>
        <NavItem eventKey={2} href="#">Link</NavItem>
        <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
          <MenuItem eventKey={3.1}>Action</MenuItem>
          <MenuItem eventKey={3.2}>Another action</MenuItem>
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
    );
  }
}
/*
      <div>
        <header>
          <div className="header-brand">
            <img src="../logodoc.bmp" height="35" />
            <p>Busche Production Software</p>
          </div>
        </header>
        <div className={styles.container}>
          <h2>Home</h2>
          <Link to="/counter">to Counter</Link> 
          <br/>
          <Link to="/POUpdateApp">PO Update</Link>
        </div>
     </div>
            <Jumbotron >
    <h1>Hello, world!</h1>
    <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
    <p><Button bsStyle="primary">Learn more</Button></p>
  </Jumbotron>
    <Navbar inverse>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#">React-Bootstrap</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavItem eventKey={1} href="#">Link</NavItem>
        <NavItem eventKey={2} href="#">Link</NavItem>
        <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
          <MenuItem eventKey={3.1}>Action</MenuItem>
          <MenuItem eventKey={3.2}>Another action</MenuItem>
          <MenuItem eventKey={3.3}>Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey={3.3}>Separated link</MenuItem>
        </NavDropdown>
      </Nav>
      <Nav pullRight>
        <NavItem eventKey={1} href="#">Link Right</NavItem>
        <NavItem eventKey={2} href="#">Link Right</NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>

    <Nav bsStyle="pills" activeKey={1} >
    <NavItem eventKey={1} href="/home">NavItem 1 content</NavItem>
    <NavItem eventKey={2} title="Item">NavItem 2 content</NavItem>
    <NavItem eventKey={3} disabled>NavItem 3 content</NavItem>
</Nav>


        */