import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link,IndexLink } from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import POReqTransButton from '../containers/POReqTransButton';
import POReqTransChecks from '../containers/POReqTransChecks';
import PORTChk1 from '../containers/PORTChk1';
import {linuxSQLPrime} from '../api/POReqTrans';
//import styles from './Home.css';
//import { Jumbotron, Button, Navbar, NavbarHeader, NavbarBrand,NavbarToggle,NavbarCollapse,  Nav, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import { Grid, Row, Glyphicon, FormGroup,ControlLabel, FormControl, Col, Checkbox, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, MenuItem, Jumbotron,Button} from 'react-bootstrap';
import {Header as NavbarHeader, Brand as NavbarBrand, Toggle as NavbarToggle, Collapse as NavbarCollapse } from 'react-bootstrap/lib/Navbar'
/*
.jumbotron {
    background-color:black !important; 
}
*/

var initPORT;

export default class POReqTrans extends Component {

  static propTypes = {
    POReqTrans: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    linuxSQLPrime();
    this.state = {
      loading: false
    };
    initPORT=this.props.initPORT;
    this.handleClick = this.handleClick.bind(this);
  }

  goHome() {
    console.log("go Home");
    console.log(initPORT);
/*    initPORT();
*/    this.props.cancelApp();

//    this.props.initPORT();
  }

  handleClick(e) {
    console.log('handleClick');
    this.props.cancelApp();
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
  const st1 ={backgroundImage: 'url(intro-bg.jpg)', backgroundSize: 'cover'};

  const toppg ={position: 'fixed',top: 0,left: 0};

  const bnr ={backgroundImage: 'url(banner.jpg)', backgroundSize: 'cover', padding: '0px 10px 0px 20px'};
  const belowbnr ={position: 'absolute',top: 80};
  const chk2 ={backgroundColor: 'black' , color: 'green',border: '1px solid blue',   padding: '5px 13px' };
  const dbg1 ={border: '1px solid blue', padding: '0px' };

  var checks,goButton,portChk1,navbar,exitBtn;

//            <a href="#">Home</a> activeStyle={{color: '#33e0ff'}}
//<div onClick={this.handleClick}>Click me!</div>
/*
          {goButton}
          {portChk1}
          {checks}
          {exitBtn}


        <br/>
        <br/>
        {navbar}
    <div>
      <Row >
        <Col xs={1}>&nbsp;</Col>
      </Row>
      <Row>
        <Col xs={1}>&nbsp;</Col>
      </Row>

*/  
if(true!=this.props.POReqTrans.started)  
  {
    navbar =
      <Navbar inverse fixedBottom>
        <NavbarHeader>
            <NavbarBrand >
              <IndexLink to="/" onClick={this.goHome} >
                  <span  >Home</span>
              </IndexLink>
            </NavbarBrand>
          <NavbarToggle />
        </NavbarHeader>
      </Navbar>
  }else{
    exitBtn = 
    <div>

      <Row>
        <Col xs={5} >&nbsp;</Col>
        <Col xs={2}><Button  onClick={this.handleClick} bsSize="large" bsStyle="warning">Cancel</Button></Col>
        <Col xs={5}>&nbsp;</Col>
      </Row>
    </div>

  }


  if(('failure'!=this.props.POReqTrans.chk1) &&
    ('failure'!=this.props.POReqTrans.chk2) && 
    ('failure'!=this.props.POReqTrans.chk3) &&  
    ('failure'!=this.props.POReqTrans.chk4) &&  
    (true==this.props.POReqTrans.started))  
  {
//  if(true){
    checks = 
    <div>
      <Row >
        <Col xs={1}>&nbsp;</Col>
      </Row>
      <Row>
        <Col xs={1}>&nbsp;</Col>
      </Row>
      <Row >
        <Col xs={4}></Col>
        <Col xs={4}><POReqTransChecks /></Col>
        <Col xs={4}></Col>
      </Row>
    </div>
  }

  if(('failure'!=this.props.POReqTrans.chk1) &&
    ('failure'!=this.props.POReqTrans.chk2) && 
    ('failure'!=this.props.POReqTrans.chk3))  
  {
    goButton = 
    <div>
      <Row >
        <Col xs={1}>&nbsp;</Col>
      </Row>
      <Row>
        <Col xs={1}>&nbsp;</Col>
      </Row>
      <Row>
        <Col xs={5} >&nbsp;</Col>
        <Col xs={2}><POReqTransButton /></Col>
        <Col xs={5}>&nbsp;</Col>
      </Row>
    </div>
  }

  if('failure'==this.props.POReqTrans.chk1)  {
    portChk1 = 
    <div>
      <Row>
        <Col xs={1}>&nbsp;</Col>
      </Row>
      <Row>
        <Col xs={12}><PORTChk1 /></Col>
      </Row>
    </div>;
  }

/*
                           {
                                // We can always force white space by interpolating a
                                // white space literal. This way, when the JSX is
                                // compiled down into React Element children, the white
                                // space literal will be an explicit child.
                            }
*/

    return (

      <div  >
        <Grid >

          <Row >
            <Col xs={1}>&nbsp;</Col>

            <Col >
              <Jumbotron  >
                <h1 style={{textAlign: 'center'}}>Need PO Category</h1>
                <p style={{padding: '0px'}}>The following PO records have not been assigned a category. 
                {"     "}
                <strong>Select a category for each one by clicking on it.</strong>
                {"     "}
                Once all PO records have a category the PO Request Transfer process will continue.</p>
              </Jumbotron>
            </Col>
          </Row>
          {goButton}
          {portChk1}
          {checks}
          {exitBtn}

        </Grid>
      </div>

    );
  }
}



