import React, { Component,StyleSheet } from 'react';
import { Link } from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
//import Dimensions from 'react-dimensions';
//import styles from './Home.css';
//import { Jumbotron, Button, Navbar, NavbarHeader, NavbarBrand,NavbarToggle,NavbarCollapse,  Nav, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Jumbotron,Button} from 'react-bootstrap';
import {Header as NavbarHeader, Brand as NavbarBrand, Toggle as NavbarToggle, Collapse as NavbarCollapse } from 'react-bootstrap/lib/Navbar'
/*
.jumbotron {
    background-color:black !important; 
}

body {
  position: relative;
  color: white;
  height: 100vh;
  background-color: #232C39;
  background-image: url("intro-bg.jpg")
  background-image: linear-gradient(45deg, rgba(0, 216, 255, .5) 10%, rgba(0, 1, 127, .7));
  font-family: Arial, Helvetica, Helvetica Neue;
  overflow-y: hidden;
}

  <Jumbotron  style={st1}>
        <Nav pullRight>
        <NavItem eventKey={1} href="#">Link Right</NavItem>
        <NavItem eventKey={2} href="#">Link Right</NavItem>
      </Nav>
        <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
          <MenuItem eventKey={3.1}>Action</MenuItem>
          <LinkContainer to="/POUpdateApp">
            <MenuItem eventKey={3.2}>PO Update</MenuItem>
          </LinkContainer>      
          <MenuItem eventKey={3.3}>Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey={3.3}>Separated link</MenuItem>
        </NavDropdown>


*/
export default class Home extends Component {
  render() {
  const nba ={color:'blue'};

  const jbk ={backgroundColor: 'black'};
  const st1 ={backgroundImage: 'url(intro-bg.jpg)', backgroundSize: 'cover'};
  //  background: url("http://placehold.it/1920x1080") no-repeat center center fixed; 

//  const st1 ={backgroundImage: 'url(intro-bg.jpg)',backgroundSize: 'cover'};

//  const jbk ={backgroundColor: '#F16E10'};width={ '200px' } height={ '300px' } 
//         <a href="#"><img src="logodoc.bmp" style={nb}  /></a>
//<a class="navbar-brand" href="http://disputebills.com"><img src="http://res.cloudinary.com/candidbusiness/image/upload/v1455406304/dispute-bills-chicago.png" alt="Dispute Bills" />
//        </a>

    return (
      <div >
  <Navbar inverse  fixedBottom>
    <NavbarHeader>
      <NavbarBrand>
        <div style={{color: '#33ccff'}}>Busche CNC</div>
      </NavbarBrand>
      <NavbarToggle />
    </NavbarHeader>
    <NavbarCollapse>
      <Nav>
        <LinkContainer to="/POUpdateApp">
          <NavItem eventKey={1}>PO Update</NavItem>
        </LinkContainer>      
        <LinkContainer to="/POReqTrans">
          <NavItem eventKey={2}>PO Request Transfer</NavItem>
        </LinkContainer>      
      </Nav>
    </NavbarCollapse>
  </Navbar>

    <div className="intro-header">
      <p>Busche Production Software</p>
      <br/>
       <p>
        <LinkContainer to="/POReqTrans">
         <Button href="#" bsStyle="primary">Request Transfer</Button>
        </LinkContainer>      

       &nbsp;&nbsp;&nbsp;
       <Button bsStyle="warning">Gen Receivers</Button>
       </p>
    </div>   

  </div>

    );
  }
}

/*
  background-color:black;

  <Jumbotron style={jbk} >

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