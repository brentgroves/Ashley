import styles from '../css/home.css';
import React, { Component,StyleSheet,PropTypes } from 'react';

import { Link } from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
//import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Jumbotron,Button} from 'react-bootstrap';
//import { Grid, Row, Col,Header as NavbarHeader, Brand as NavbarBrand, Toggle as NavbarToggle, Collapse as NavbarCollapse } from 'react-bootstrap/lib/Navbar'

import { Grid, Row, Col, Navbar, Nav, NavItem, NavDropdown, MenuItem, Jumbotron,Button} from 'react-bootstrap';
import {Header as NavbarHeader, Brand as NavbarBrand, Toggle as NavbarToggle, Collapse as NavbarCollapse, Text as NavbarText } from 'react-bootstrap/lib/Navbar'

export default class Home extends Component {
  static propTypes = {
    GenR: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
    }
  }
  render() {
  const nba ={color:'blue'};

  const jbk ={backgroundColor: 'black'};
  const st1 ={backgroundImage: 'url(intro-bg.jpg)', backgroundSize: 'cover'};
//  const st1 ={backgroundImage: 'url(intro-bg.jpg)',backgroundSize: 'cover'};
//  const jbk ={backgroundColor: '#F16E10'};width={ '200px' } height={ '300px' } 
  var navbar;
  navbar=
  <Navbar inverse  fixedBottom>
    <NavbarHeader>
      <NavbarBrand>
        <div style={{color: '#33ccff'}}>Busche CNC</div>
      </NavbarBrand>
      <NavbarToggle />
    </NavbarHeader>
    <NavbarCollapse>
      <Nav>
        <LinkContainer to="/POReqTrans">
          <NavItem eventKey={2}>PO Request Transfer</NavItem>
        </LinkContainer>      
        <LinkContainer to="/GenReceivers">
          <NavItem eventKey={1}>Generate Receivers</NavItem>
        </LinkContainer>      
        <LinkContainer to="/Reports">
          <NavItem eventKey={1}>Reports</NavItem>
        </LinkContainer>      

      </Nav>
    </NavbarCollapse>
  </Navbar>

  var buttonMenu;
  buttonMenu=
    <div className="intro-header">
    <h1>Busche Production Software</h1>
    <br/>
     <p>
      <LinkContainer to="/POReqTrans">
       <Button href="#" bsStyle="primary">Request Transfer</Button>
      </LinkContainer>      

     &nbsp;&nbsp;&nbsp;
      <LinkContainer to="/GenReceivers">
       <Button href="#" bsStyle="warning">Generate Receivers</Button>
      </LinkContainer>      
     </p>
  </div>   

  var jumboTronTxt;
  jumboTronTxt=
    jumboTronTxt=
      <Row >
        <Col >
          <Jumbotron style={{marginLeft:0,marginRight:0}} >
             <h1 style={{textAlign: 'center',marginTop:15,marginBottom:0}}>Busche Production Software</h1>
            <p style={{textAlign: 'center'}}><strong>Description:{" "}</strong>Please choose from one of the activities listed below.</p>
            <br/>
          </Jumbotron>
        </Col>
      </Row>


  var gridMenu;
  gridMenu =
    <Row>
      <Col>
        <table className={styles.tg}>
        <tbody>
          <tr>
            <LinkContainer to="/POReqTrans">
              <td className={styles.tgvv23}>PO Request Transfer</td>
            </LinkContainer>      
            <LinkContainer to="/GenReceivers">
              <td className={styles.tgy0xi}>Generate Receivers</td>
            </LinkContainer>      
            <LinkContainer to="/Reports">
              <td className={styles.tgh1ue} >Reports</td>
            </LinkContainer>      
          </tr>
          </tbody>
        </table>
      </Col>
    </Row>

    return (
      <div>
        <Grid>
        {jumboTronTxt}
        {gridMenu}
        </Grid>
        {navbar}
      </div>
    );
  }
}
