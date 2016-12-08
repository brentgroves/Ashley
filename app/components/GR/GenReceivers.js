import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link,IndexLink } from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import GRButton from '../../containers/GR/GRButton';
import GRChecks from '../../containers/GR/GRChecks';
import GRGrid from '../../containers/GR/GRGrid';
import * as GRSTATE from "../../actions/GRState.js"
import { Grid, Row, Col, Navbar, Nav, NavItem, NavDropdown, MenuItem, Jumbotron,Button} from 'react-bootstrap';
import {Header as NavbarHeader, Brand as NavbarBrand, Toggle as NavbarToggle, Collapse as NavbarCollapse, Text as NavbarText } from 'react-bootstrap/lib/Navbar'
/*
.jumbotron {
    background-color:black !important; 
}
*/

//var initPORT;

export default class GenReceivers extends Component {

  static propTypes = {
    GenR: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.props.prime();
    this.state = {
      loading: false
    };
  }

  render() {

  const jbk ={backgroundColor: 'black' };
  const st1 ={backgroundImage: 'url(intro-bg.jpg)', backgroundSize: 'cover'};

  const toppg ={position: 'fixed',top: 0,left: 0};

  const bnr ={backgroundImage: 'url(banner.jpg)', backgroundSize: 'cover', padding: '0px 10px 0px 20px'};
  const belowbnr ={position: 'absolute',top: 80};
  const chk2 ={backgroundColor: 'black' , color: 'green',border: '1px solid blue',   padding: '5px 13px' };
  const dbg1 ={border: '1px solid blue', padding: '0px' };

  var checks,goButton,grid,navbar,cancelBtn,saveAndCancelBtn,jumboTronTxt,navbarStatus,navbarEnd;

  if(GRSTATE.NOT_PRIMED==this.props.GenR.state){
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
  } else if(GRSTATE.PRIMED==this.props.GenR.state){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron  >
             <h1 style={{textAlign: 'center'}}>Generate Receivers</h1>
            <p style={{padding: '0px'}}>This App generates M2m receivers from items received into Cribmaster.
            It includes a ROLLBACK process so if it fails at ANY point just run it again.  <strong>Do NOT give receipts to Accounting until the program completes successfully.</strong></p>
            <br/>
            <p style={{textAlign: 'center'}}>Once the GO! button is clicked this process will start.  </p>            
            <br/>
          </Jumbotron>
        </Col>
      </Row>
  } else if(
            (GRSTATE.OUT_OF_RANGE==this.props.GenR.state)
            ){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron  >
            <h1 style={{textAlign: 'center'}}>Out Of Range</h1>
            <p style={{padding: '0px'}}>There are are more than 50 receivers to generate or rollback.  Ask 'IT' if you would like to override this condition check.</p>
            <br/>
          </Jumbotron>
        </Col>
      </Row>
  } else if(
            (GRSTATE.UPTODATE==this.props.GenR.state)
            ){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron  >
            <h1 style={{textAlign: 'center'}}>Up-To-Date</h1>
            <p style={{padding: '0px',textAlign:'center'}}>There are currently 'NO' PO Items needing received into Made2Manage.</p>
           <br/>
          </Jumbotron>
        </Col>
      </Row>
  } else if(
            (GRSTATE.STARTED==this.props.GenR.state) 
            ){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron  >
            <h1 style={{textAlign: 'center'}}>Validation in Progress</h1>
            <p style={{padding: '0px'}}>Checking if the previous session finished gracefully,
            and all POs items are ready to receive into Made2Manage.  This shouldn't take long.</p>
          </Jumbotron>
        </Col>
      </Row>
  } else if(
            (GRSTATE.RCMAST_INSERT_NOT_READY==this.props.GenR.state) 
            ){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron  >
            <h1 style={{textAlign: 'center'}}>Freight Carrier & Packing List</h1>
            <p style={{textAlign: 'center'}}>Please enter the packing list number and
            select the appropriate freight carrier before continuing.</p>
          </Jumbotron>
        </Col>
      </Row>
  } else if(
            (GRSTATE.RCMAST_INSERT_READY==this.props.GenR.state) 
            ){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron  >
            <h1 style={{textAlign: 'center'}}>Ready to Save</h1>
            <p >You have entered a packing list number and
            selected a freight carrier for at least one receiver. Press the
            'save' button to create receiver(s) in Made2Manage.</p>
          </Jumbotron>
        </Col>
      </Row>
  } else if(GRSTATE.FAILURE==this.props.GenR.state){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron  >
            <h1 style={{textAlign: 'center'}}>Error!</h1>
            <p><strong>Description:{" "}</strong>{this.props.GenR.reason}</p>
            <p><strong>Press the Cancel button and try again.</strong></p> 
            <p><strong>If the problem persists give IT the error description above.</strong></p>
            <br/>
          </Jumbotron>
        </Col>
      </Row>
  } else if(GRSTATE.SUCCESS==this.props.GenR.state){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron  >
            <h1 style={{textAlign: 'center'}}>SUCCESS!</h1>
            <div style={{textAlign: 'center'}}>
            <h3 >All of the requested PO(s) items have been received
            into Made2Manage successfully.</h3></div>
            <br/>
          </Jumbotron>
        </Col>
      </Row>
  }


  if(
      (GRSTATE.PRIMED==this.props.GenR.state) ||
      (GRSTATE.STARTED==this.props.GenR.state) 
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
        <Col xs={2}><GRButton /></Col>
        <Col xs={5}>&nbsp;</Col>
      </Row>

    </div>
  }

  if(
      (GRSTATE.STARTED==this.props.GenR.state) 
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
        <Col xs={4}><GRChecks /></Col>
        <Col xs={4}></Col>
      </Row>
    </div>;
  } 

  if(
      (GRSTATE.RCMAST_INSERT_NOT_READY==this.props.GenR.state)  ||
      (GRSTATE.RCMAST_INSERT_READY==this.props.GenR.state)  
    )
  {
    grid = 
    <div>
      <Row>
        <Col xs={12}><GRGrid /></Col>
      </Row>
    </div>
  }

  if(
      (GRSTATE.FAILURE==this.props.GenR.state) ||
      (GRSTATE.OUT_OF_RANGE==this.props.GenR.state)
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

  if(
      (GRSTATE.RCMAST_INSERT_NOT_READY==this.props.GenR.state) 

    )
  {
    saveAndCancelBtn = 
    <div>
      <Row>
        <Col xs={1}>&nbsp;</Col>
      </Row>

      <Row>
        <Col xs={5} >&nbsp;</Col>
        <Col xs={1}><Button  onClick={this.props.m2mGenReceivers} bsSize="large" bsStyle="info" disabled>Save</Button></Col>
        <Col xs={1}><Button  onClick={this.props.cancelApp} bsSize="large" bsStyle="warning">Cancel</Button></Col>
        <Col xs={5}>&nbsp;</Col>
      </Row>
    </div>
  }

  if(
      (GRSTATE.RCMAST_INSERT_READY==this.props.GenR.state) 

    )
  {
    saveAndCancelBtn = 
    <div>
      <Row>
        <Col xs={1}>&nbsp;</Col>
      </Row>

      <Row>
        <Col xs={5} >&nbsp;</Col>
        <Col xs={1}><Button  onClick={this.props.m2mGenReceivers} bsSize="large" bsStyle="info" >Save</Button></Col>
        <Col xs={1}><Button  onClick={this.props.cancelApp} bsSize="large" bsStyle="warning">Cancel</Button></Col>
        <Col xs={5}>&nbsp;</Col>
      </Row>
    </div>
  }

  if(
      (GRSTATE.PRIMED==this.props.GenR.state) || 
      (GRSTATE.UPTODATE==this.props.GenR.state) ||  
      (GRSTATE.SUCCESS==this.props.GenR.state)   
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
            <LinkContainer to="/POReqTrans">
              <NavItem eventKey={1}>PO Request Transfer</NavItem>
            </LinkContainer>      
          </Nav>
        </NavbarCollapse>

      </Navbar>;
  }else{
    navbar =
      <Navbar inverse fixedBottom>
        <NavbarCollapse>
          <span className="navbar-center">{this.props.GenR.status}</span>
        </NavbarCollapse>
      </Navbar>;

  }


    return (

      <div  >
        <Grid >
          {jumboTronTxt}
          {checks}
          {grid}
          {goButton}
          {saveAndCancelBtn}
          {cancelBtn}
          {navbar}
        </Grid>
      </div>

    );
  }
}



