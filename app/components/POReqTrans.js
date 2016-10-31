import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link,IndexLink } from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import POReqTransButton from '../containers/POReqTransButton';
import POReqTransChecks from '../containers/POReqTransChecks';
import PORTGrid from '../containers/PORTGrid';
import {linuxSQLPrime} from '../api/POReqTrans';
import * as PORTSTATE from "../actions/PORTState.js"
import { Grid, Row, Col, Navbar, Nav, NavItem, NavDropdown, MenuItem, Jumbotron,Button} from 'react-bootstrap';
import {Header as NavbarHeader, Brand as NavbarBrand, Toggle as NavbarToggle, Collapse as NavbarCollapse, Text as NavbarText } from 'react-bootstrap/lib/Navbar'
/*
.jumbotron {
    background-color:black !important; 
}
*/

//var initPORT;

export default class POReqTrans extends Component {

  static propTypes = {
    POReqTrans: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.props.primePORT(true);
    this.state = {
      loading: false
    };
 //   initPORT=this.props.initPORT;
 //   this.handleClick = this.handleClick.bind(this);
//    this.goHome=this.props.cancelApp.bind(this);
  }

/*
  goHome() {
    console.log("go Home");
 //   this.props.cancelApp();
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

  var checks,goButton,portGrid,navbar,cancelBtn,jumboTronTxt,navbarStatus,navbarEnd;

  if(PORTSTATE.NOT_PRIMED==this.props.POReqTrans.state){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron  >
             <h1 style={{textAlign: 'center'}}>Connecting to Databases</h1>
            <p style={{textAlign: 'center'}}><strong>Description:{" "}</strong>Attempting to connect to CribMaster and Made2Manage</p>
            <p style={{textAlign: 'center'}}><strong>Please wait...</strong></p> 
            <br/>
          </Jumbotron>
        </Col>
      </Row>
  } else if(PORTSTATE.PRIMED==this.props.POReqTrans.state){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron  >
             <h1 style={{textAlign: 'center'}}>PO Request Transfer</h1>
            <p style={{padding: '0px'}}>This App creates M2m purchase orders from Cribmaster PO requests. Once the GO! button is clicked each Cribmaster PO request will be inserted into M2m.  Then the PO number generated by M2m will be copied onto the cooresponding Cribmaster PO.</p>
             <br/>
          </Jumbotron>
        </Col>
      </Row>
  } else if(
            (PORTSTATE.UPTODATE==this.props.POReqTrans.state)
            ){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron  >
            <h1 style={{textAlign: 'center'}}>UpToDate</h1>
            <p style={{padding: '0px',textAlign:'center'}}>There are currently 'NO' PO Requests to process.</p>
           
          </Jumbotron>
        </Col>
      </Row>
  } else if(
            (PORTSTATE.STARTED==this.props.POReqTrans.state) ||
            (PORTSTATE.STEP_5_PASS==this.props.POReqTrans.state) ||
            (PORTSTATE.STEP_10_PASS==this.props.POReqTrans.state) ||
            (PORTSTATE.STEP_20_PASS==this.props.POReqTrans.state) ||
            (PORTSTATE.STEP_30_PASS==this.props.POReqTrans.state)
            ){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron  >
            <h1 style={{textAlign: 'center'}}>PO Validation in Progress</h1>
            <p style={{padding: '0px'}}>Checking if the previous session finished gracefully,
            and all POs have a valid category and vendor selected.  This shouldn't take long.</p>
          </Jumbotron>
        </Col>
      </Row>
  } else if(PORTSTATE.STEP_10_FAIL==this.props.POReqTrans.state){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron  >
            <h1 style={{textAlign: 'center'}}>Need PO Category</h1>
            <p style={{padding: '0px'}}>The following PO(s) have not been assigned a category. 
            {"     "}
            <strong>Select a category for each one by clicking on it.</strong>
            {"     "}
            Once all PO records have a category the PO Request Transfer process will continue.</p>
          </Jumbotron>
        </Col>
      </Row>
  } else if(PORTSTATE.STEP_20_FAIL==this.props.POReqTrans.state){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron  >
           <h1 style={{textAlign: 'center'}}>Check Cribmaster Vendor</h1>
            <p style={{padding: '0px'}}>The following PO(s) have a problem with their Cribmaster vendor.
            {"     "}
            <strong>Select a valid Cribmaster vendor for each PO listed.</strong>
            {"     "}
            Once all PO records have a valid Cribmaster Vendor the PO Request Transfer will continue</p>
          </Jumbotron>
        </Col>
      </Row>
  } else if(PORTSTATE.STEP_30_FAIL==this.props.POReqTrans.state){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron  >
           <h1 style={{textAlign: 'center'}}>Update Made2Manage Vendor</h1>
            <p style={{padding: '0px'}}>The following Cribmaster vendor(s) have an invalid Made2Manage vendor assigned.
            {"      "}
            <strong>Select another Made2Manage vendor for each item listed.</strong> 
            {"      "}
            Once all Made2Manage vendors have been selected the PO Request Transfer process will continue.</p>
          </Jumbotron>
        </Col>
      </Row>
  } else if(PORTSTATE.FAILURE==this.props.POReqTrans.state){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron  >
            <h1 style={{textAlign: 'center'}}>Error!</h1>
            <p><strong>Description:{" "}</strong>{this.props.POReqTrans.reason}</p>
            <p><strong>Press the Cancel button and try again.</strong></p> 
            <p><strong>If the problem persists give IT the error description above.</strong></p>
            <br/>
          </Jumbotron>
        </Col>
      </Row>
  } else if(
            (PORTSTATE.STEP_40_PASS==this.props.POReqTrans.state) ||
            (PORTSTATE.STEP_50_PASS==this.props.POReqTrans.state) ||
            (PORTSTATE.STEP_60_PASS==this.props.POReqTrans.state)
            ){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron  >
            <h1 style={{textAlign: 'center'}}>PO Request Transfer</h1>
            <p style={{padding: '0px'}}>The PO Request Transfer program is through with it's
            validation checks and is now transferring the requested PO(s) into Made2Manage.</p>
          </Jumbotron>
        </Col>
      </Row>
  } else if(PORTSTATE.SUCCESS==this.props.POReqTrans.state){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron  >
            <h1 style={{textAlign: 'center'}}>SUCCESS!</h1>
            <div style={{textAlign: 'center'}}>
            <h3 >All of the requested PO(s) have been transfered 
            to Made2Manage successfully.</h3></div>
            <br/>
          </Jumbotron>
        </Col>
      </Row>
  }


  if(
      (PORTSTATE.PRIMED==this.props.POReqTrans.state) ||
      (PORTSTATE.STARTED==this.props.POReqTrans.state) ||  
      (PORTSTATE.STEP_5_PASS==this.props.POReqTrans.state) ||
      (PORTSTATE.STEP_10_PASS==this.props.POReqTrans.state) ||  
      (PORTSTATE.STEP_20_PASS==this.props.POReqTrans.state) || 
      (PORTSTATE.STEP_30_PASS==this.props.POReqTrans.state) || 
      (PORTSTATE.STEP_40_PASS==this.props.POReqTrans.state) ||  
      (PORTSTATE.STEP_50_PASS==this.props.POReqTrans.state) || 
      (PORTSTATE.STEP_60_PASS==this.props.POReqTrans.state)  
    )
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
  if(
      (PORTSTATE.STARTED==this.props.POReqTrans.state) ||
      (PORTSTATE.STEP_5_PASS==this.props.POReqTrans.state) ||
      (PORTSTATE.STEP_10_PASS==this.props.POReqTrans.state) ||  
      (PORTSTATE.STEP_20_PASS==this.props.POReqTrans.state) || 
      (PORTSTATE.STEP_30_PASS==this.props.POReqTrans.state) || 
      (PORTSTATE.STEP_40_PASS==this.props.POReqTrans.state) ||  
      (PORTSTATE.STEP_50_PASS==this.props.POReqTrans.state) || 
      (PORTSTATE.STEP_60_PASS==this.props.POReqTrans.state) || 
      (PORTSTATE.FAILURE==this.props.POReqTrans.state)  ||
      (PORTSTATE.SUCCESS==this.props.POReqTrans.state)  
    )
  {
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
    </div>;
  } 

  if(
      (PORTSTATE.STEP_10_FAIL==this.props.POReqTrans.state) ||  
      (PORTSTATE.STEP_20_FAIL==this.props.POReqTrans.state) || 
      (PORTSTATE.STEP_30_FAIL==this.props.POReqTrans.state)  
    )
  {
    portGrid = 
    <div>
      <Row>
        <Col xs={1}>&nbsp;</Col>
      </Row>
      <Row>
        <Col xs={12}><PORTGrid /></Col>
      </Row>
    </div>
  }

  if(
      (PORTSTATE.STEP_10_FAIL==this.props.POReqTrans.state) ||  
      (PORTSTATE.STEP_20_FAIL==this.props.POReqTrans.state) || 
      (PORTSTATE.STEP_30_FAIL==this.props.POReqTrans.state) || 
      (PORTSTATE.FAILURE==this.props.POReqTrans.state) 
    )
  {
    cancelBtn = 
    <div>
      <Row>
        <Col xs={1}>&nbsp;</Col>
      </Row>
      <Row>
        <Col xs={5} >&nbsp;</Col>
        <Col xs={2}><Button  onClick={this.props.cancelApp} bsSize="large" bsStyle="warning">Cancel</Button></Col>
        <Col xs={5}>&nbsp;</Col>
      </Row>
    </div>
  }
  var status = 'currentPO=> ' + this.props.POReqTrans.status;
  if(
      (PORTSTATE.PRIMED==this.props.POReqTrans.state) || 
      (PORTSTATE.UPTODATE==this.props.POReqTrans.state) ||  
      (PORTSTATE.SUCCESS==this.props.POReqTrans.state)   
    )
  {
    navbar =
      <Navbar inverse fixedBottom>
        <NavbarHeader>
          <NavbarBrand >
            <IndexLink to="/" onClick={this.props.cancelApp} >Home
            </IndexLink>
          </NavbarBrand>
          <NavbarToggle />
        </NavbarHeader>
        <NavbarCollapse>
          <Nav>
            <LinkContainer to="/GenReceivers">
              <NavItem eventKey={1}>Generate Receivers</NavItem>
            </LinkContainer>      
          </Nav>
        </NavbarCollapse>

      </Navbar>;
  }else{
    navbar =
      <Navbar inverse fixedBottom>
        <NavbarCollapse>
          <span className="navbar-center">{this.props.POReqTrans.status}</span>
        </NavbarCollapse>
      </Navbar>;

  }

  /*
       {

      <Navbar inverse fixedBottom>
        <NavbarHeader>
          <NavbarBrand >
            <IndexLink to="/" onClick={this.props.cancelApp} >Home
            </IndexLink>
          </NavbarBrand>
          <NavbarToggle />
        </NavbarHeader>
        <NavbarCollapse>
          <span className="navbar-center">{status}</span>
        </NavbarCollapse>
      </Navbar>;

            // We can always force white space by interpolating a
            // white space literal. This way, when the JSX is
            // compiled down into React Element children, the white
            // space literal will be an explicit child.
        }
  */

    return (

      <div  >
        <Grid >
          {jumboTronTxt}
          {goButton}
          {checks}
          {portGrid}
          {cancelBtn}
          {navbar}
          {navbarStatus}
          {navbarEnd}
        </Grid>
      </div>

    );
  }
}



