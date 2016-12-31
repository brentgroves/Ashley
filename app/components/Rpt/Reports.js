import styles from '../../css/Rpt/styles.css';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link,IndexLink } from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import ProgressBtn from '../../containers/Rpt/ProgressBtn';
import POPrompt from "../../containers/Rpt/POPrompt";
import * as STATE from "../../actions/Rpt/State.js"
import { Grid, Row, Col, Navbar, Nav, NavItem, NavDropdown, MenuItem, Jumbotron,Button} from 'react-bootstrap';
import {Header as NavbarHeader, Brand as NavbarBrand, Toggle as NavbarToggle, Collapse as NavbarCollapse, Text as NavbarText } from 'react-bootstrap/lib/Navbar'


export default class Reports extends Component {

  static propTypes = {
    Rpt: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.props.init();
    this.state = {
     // loading: false
    };
  }

  render() {
    var jumboTronTxt,rptMenu,poPrompt,progressBtn,backBtn,cancelBtn,navbar;

    if(STATE.NOT_STARTED==this.props.Rpt.state){
    jumboTronTxt=
      <Row>
        <Col >
          <Jumbotron style={{marginLeft:15,marginRight:15}} >
             <h1 style={{textAlign: 'center',marginTop:15,marginBottom:0}}>Select Report</h1>
            <p style={{padding: '0px'}}>This app generates reports some of which are in normal pdf format
            others are emailed as HTML.
            </p>
            <p style={{textAlign: 'center'}}><strong>Once a report is clicked this process will start.</strong>  </p>            
            <br/>
          </Jumbotron>
          </Col >
        </Row>
  } else if(
            (STATE.PO_PROMPT_NOT_READY==this.props.Rpt.state) 
            ){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron style={{marginLeft:15,marginRight:15}} >
            <h1 style={{textAlign: 'center',marginTop:15,marginBottom:0}}>Select PO(s)</h1>
            <div style={{textAlign: 'left'}}>
              <p >Please select which PO(s) you wish to have email notifications prepared for. </p>
              <p>After selecting at least one PO the 'run' button will be enabled so you may 
              continue. </p>
              <p>Click the checkboxes to make your selections.</p>
            </div>
            <br/>
          </Jumbotron>
        </Col>
      </Row>
  } else if(
            (STATE.PO_PROMPT_READY==this.props.Rpt.state) 
            ){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron style={{marginLeft:15,marginRight:15}} >
            <h1 style={{textAlign: 'center',marginTop:15,marginBottom:0}}>Select PO(s)</h1>
            <div style={{textAlign: 'left'}}>
              <p >You may now press the 'run' button to begin. After 'run' is
              pressed this program will create an email notification for each applicable vendor
              and send them to the designated MRO personel for review and forwarding. 
              </p>
            </div>
            <br/>
          </Jumbotron>
        </Col>
      </Row>
  } else if(
            (STATE.STARTED==this.props.Rpt.state) 
            ){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron style={{marginLeft:15,marginRight:15}} >
            <h1 style={{textAlign: 'center',marginTop:15,marginBottom:0}}>Creating Report</h1>
            <div style={{textAlign: 'left'}}>
              <p >The report you hava selected is being prepared now!  When it is finished another window
              will appear if it is a PDF report.  If it is an email report no window will appear but this window
              will display SUCCESS!. 
              </p>
              <p>Time varies based upon network conditions and server workload.</p>
              <p style={{textAlign: 'center',paddingBottom:5}}><strong>Please wait...</strong></p> 
            </div>
            <br/>
          </Jumbotron>
        </Col>
      </Row>

  } else if(STATE.FAILURE==this.props.Rpt.state){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron style={{marginLeft:15,marginRight:15}} >
            <h1 style={{textAlign: 'center',marginTop:15,marginBottom:0}}>Error!</h1>
            <div style={{textAlign: 'left'}}>
            <p><strong>Description:{" "}</strong>{this.props.Rpt.reason}</p>
            <p><strong>Press the Cancel button and try again.</strong></p> 
            <p><strong>If the problem persists give IT the error description above.</strong></p>
            </div>
            <br/>
          </Jumbotron>
        </Col>
      </Row>
  } else if(STATE.SUCCESS==this.props.Rpt.state){
    jumboTronTxt=
      <Row >
        <Col xs={1}>&nbsp;</Col>
        <Col >
          <Jumbotron style={{marginLeft:15,marginRight:15}} >
            <h1 style={{textAlign: 'center',marginTop:15,marginBottom:0}}>SUCCESS!</h1>
            <br/>
            <div style={{textAlign: 'left'}}>
              <p >Your report has been prepared successfully! You may now select another report to run, 
              use the menu bar to navigate back to the main menu, or click the 'x' in the upper right 
              corner to exit this App.</p>
            </div>
            <br/>
          </Jumbotron>
        </Col>
      </Row>
  }


  if(
      (STATE.STARTED==this.props.Rpt.state)
    )
  {
    progressBtn = 
    <div>
      <Row>
        <Col xs={1}>&nbsp;</Col>
      </Row>
      <Row>
        <Col xs={5} >&nbsp;</Col>
        <Col xs={2}><ProgressBtn/></Col>
        <Col xs={5}>&nbsp;</Col>
      </Row>

    </div>
  }
  if(
      (STATE.NOT_STARTED==this.props.Rpt.state) ||
      (STATE.SUCCESS==this.props.Rpt.state)
    )
  {
  const rpt1Style = {
    fontWeight:'bold'
  };

    var rptMenu;
    rptMenu =
      <div>
        <Row>
          <Col xs={1}>&nbsp;</Col>
        </Row>
        <Row>
          <Col xs={1}>&nbsp;</Col>
        </Row>
        <Row>
          <Col xs={3}></Col>
          <Col xs={6}>
            <table className={styles.tg}>
            <tbody>
              <tr>
                <td className={styles.btnPrimary} onClick={this.props.OpenPOVendorEmail} ><span style={rpt1Style}>Open PO</span><br/>Vendor Email</td>
                <td className={styles.btnSuccess} onClick={this.props.POStatusReport} ><span style={rpt1Style}>PO(s) Opened Today</span><br/>Email(s) Sent</td>
                <td className={styles.btnWarning} onClick={this.props.POStatusReport} ><span style={rpt1Style}>PO(s) Closed Today</span><br/>PDF format</td>
              </tr>
              </tbody>
            </table>
          </Col>
          <Col xs={3}></Col>
        </Row>
      </div>
    }

  if(
      (STATE.PO_PROMPT_NOT_READY==this.props.Rpt.state) ||
      (STATE.PO_PROMPT_READY==this.props.Rpt.state)
    )
  {
    poPrompt = 
    <div>
      <Row>
        <Col xs={1}>&nbsp;</Col>
      </Row>
      <Row>
        <Col xs={1} >&nbsp;</Col>
        <Col xs={10}><POPrompt/></Col>
        <Col xs={1}>&nbsp;</Col>
      </Row>

    </div>
  }

  if(
      (STATE.FAILURE==this.props.Rpt.state)  
    )
  {
    cancelBtn = 
    <div>
      <Row>
        <Col xs={1}>&nbsp;</Col>
      </Row>
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

  if( false
 //     (STATE.PO_PROMPT_NOT_READY==this.props.Rpt.state) ||
 //     (STATE.PO_PROMPT_READY==this.props.Rpt.state)
    )
  {
    backBtn = 
    <div>
      <Row>
        <Col xs={5} >&nbsp;</Col>
        <Col xs={2}><Button  onClick={()=>this.props.setState(STATE.NOT_STARTED)} bsSize="large" bsStyle="warning">Back</Button></Col>
        <Col xs={5}>&nbsp;</Col>
      </Row>
    </div>
  }



  if(
      (STATE.SUCCESS==this.props.Rpt.state)  || 
      (STATE.NOT_STARTED==this.props.Rpt.state) ||
      (STATE.PO_PROMPT_NOT_READY==this.props.Rpt.state) ||
      (STATE.PO_PROMPT_READY==this.props.Rpt.state) 
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
          <span className="navbar-center">{this.props.Rpt.status}</span>
        </NavbarCollapse>
      </Navbar>;

  }


    return (

        <Grid >
          {jumboTronTxt}
          {progressBtn}
          {rptMenu}
          {poPrompt}
          {backBtn}
          {cancelBtn}
          {navbar}
        </Grid>
 
    );
  }
}



