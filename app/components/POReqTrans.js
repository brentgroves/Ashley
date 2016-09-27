import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import POReqTransButton from '../containers/POReqTransButton';
import POReqTransChecks from '../containers/POReqTransChecks';
import NoCatGriddlePage from '../containers/NoCatGriddlePage';
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
    POReqTrans: PropTypes.object.isRequired
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
  const st1 ={backgroundImage: 'url(intro-bg.jpg)', backgroundSize: 'cover'};

  const toppg ={position: 'fixed',top: 0,left: 0};

  const bnr ={backgroundImage: 'url(banner.jpg)', backgroundSize: 'cover', padding: '0px 10px 0px 20px'};
  const belowbnr ={position: 'absolute',top: 80};
  const chk2 ={backgroundColor: 'black' , color: 'green',border: '1px solid blue',   padding: '5px 13px' };
  const dbg1 ={border: '1px solid blue', padding: '0px' };

  var checks,goButton,noCatGrid;

  if(('failure'!=this.props.POReqTrans.chk1) &&
    ('failure'!=this.props.POReqTrans.chk2) && 
    ('failure'!=this.props.POReqTrans.chk3))  
  {
    checks =
      <Row >
        <Col xs={4}></Col>
        <Col xs={4}><POReqTransChecks /></Col>
        <Col xs={4}></Col>
      </Row>;

    goButton =
      <Row>
        <Col xs={5} >&nbsp;</Col>
        <Col xs={2}><POReqTransButton /></Col>
        <Col xs={5}>&nbsp;</Col>
      </Row>;

    noCatGrid =
      <Row>
        <Col xs={12}><NoCatGriddlePage /></Col>
      </Row>;

  }

    return (
      <div  >
    <Grid >

      <Row >
        <Col >
          <Jumbotron  >
            <h1 style={{textAlign: 'center'}}>PO Request Transfer</h1>
            <p style={{padding: '0px'}}>This App creates M2m purchase orders from Cribmaster PO requests. Once the GO! button is clicked each Cribmaster PO request will be inserted into M2m.  Then the PO number generated by M2m will be copied onto the cooresponding Cribmaster PO.</p>
          </Jumbotron>
        </Col>
      </Row>
      <Row >
        <Col xs={1}>&nbsp;</Col>
      </Row>
      <Row>
        <Col xs={1}>&nbsp;</Col>
      </Row>
      <Row>
        <Col xs={1}>&nbsp;</Col>
      </Row>
      <Row>
        <Col xs={1}>&nbsp;</Col>
      </Row>

        {goButton}

        <Row >
          <Col xs={1}>&nbsp;</Col>
        </Row>
        <Row>
          <Col xs={1}>&nbsp;</Col>
        </Row>
        <Row>
          <Col xs={1}>&nbsp;</Col>
        </Row>
        <Row>
          <Col xs={1}>&nbsp;</Col>
        </Row>

        {checks}
          
    </Grid>

    <br/>
    <br/>
        }

  <Navbar inverse fixedBottom>
    <NavbarHeader>
      <NavbarBrand>
        <a href="#">Home</a>
      </NavbarBrand>
      <NavbarToggle />
    </NavbarHeader>
</Navbar>
  </div>

    );
  }
}



