import React, { Component, PropTypes } from 'react';
import 'react-widgets/lib/less/react-widgets.less';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Multiselect from 'react-widgets/lib/Multiselect';
import '../../../css/Rpt/styles.global.css';
import { FormGroup,FormControl,HelpBlock,Checkbox,ControlLabel,Label,Row,Col,ListGroup,ListGroupItem,Panel,Table,Button,Glyphicon,ButtonGroup,ButtonToolbar} from 'react-bootstrap';
import { ButtonInput } from 'react-bootstrap';
var dateFormat = require('dateformat');
var Moment = require('moment');
var momentLocalizer = require('react-widgets/lib/localizers/moment');
var classNames = require('classnames');
import * as STATE from "../../../actions/Rpt/State.js"
import styles from '../../../css/Rpt/styles.css';

momentLocalizer(Moment);


export default class NoReceiversDateRange extends React.Component {
  static propTypes = {
    Rpt: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      test:this.test.bind(this)
    };
    if ('development'==process.env.NODE_ENV) {
//      console.log(`POPrompt:this.props.toggleOpenPOSelected=>`);
//      console.dir(this.props.toggleOpenPOSelected);
    }
  }
 
 test(dt,dateStart,dateEnd){
  console.log(`dt: ${dt}`);
  //'08-12-2012 10:15:10'
//  var dtStr =Moment(new Date(dt)).format("MM-DD-YYYY hh:mm:ss");
  //var dtStr = Date(dt);
  //dtStr.toLocalString();

    var dtStart = dateFormat(new Date(dt), "mm-dd-yyyy hh:MM:ss");
    if ('development'==process.env.NODE_ENV) {
      console.log(`dtStart=>${dtStart}`);
    }
     var dtStartFmt = dateFormat(new Date(dateStart), "mm-dd-yyyy hh:MM:ss");
    if ('development'==process.env.NODE_ENV) {
      console.log(`dtStartFmt=>${dtStartFmt}`);
    }
    var dtEndFmt = dateFormat(new Date(dateEnd), "mm-dd-yyyy hh:MM:ss");
    if ('development'==process.env.NODE_ENV) {
      console.log(`dtEndFmt=>${dtEndFmt}`);
    }

 }

  
  render() {

    var runAndBackBtn;
    if(
           (STATE.NORECEIVERS_DATE_RANGE_NOT_READY==this.props.Rpt.state) 
      ){
     runAndBackBtn = 
      <Row>
        <Col xs={4} >&nbsp;</Col>
        <Col xs={1}><Button  onClick={()=>this.props.NoReceivers()} bsSize="large" bsStyle="info" disabled>Run</Button></Col>
        <Col xs={1} >&nbsp;</Col>
        <Col xs={2}><Button onClick={()=>this.props.setState(STATE.NOT_STARTED)} bsSize="large" bsStyle="warning">Back</Button></Col>
        <Col xs={3}>&nbsp;</Col>
      </Row>
    }else{
      runAndBackBtn = 
      <Row>
        <Col xs={4} >&nbsp;</Col>

        <Col xs={2}><Button  onClick={()=>this.props.NoReceivers()}  bsSize="large" bsStyle="info" >Run</Button></Col>
        <Col xs={1}><Button  onClick={()=>this.props.setState(STATE.NOT_STARTED)} bsSize="large" bsStyle="warning">Back</Button></Col>
        <Col xs={3}>&nbsp;</Col>
      </Row>
    }
    var pageNoClass = classNames(
      'pagination','hidden-xs', 'pull-left'
    );

    var dateHeader; 
    var dateStyle;
    if(this.props.Rpt.noReceivers.dateHeader.valid){
      dateHeader=<h3 style={{textAlign:'center'}}>{this.props.Rpt.noReceivers.dateHeader.text}</h3>
      dateStyle='default';
    }else{
      dateHeader=<h3 style={{textAlign:'center',color:'red !important'}}>{this.props.Rpt.noReceivers.dateHeader.text}</h3>
      dateStyle='danger';
    }

    return (
      <div>
        <Panel bsStyle={dateStyle} header={dateHeader}>
          <Row>
            <Col xs={1} >
              <h1 style={{marginTop:0}}><Label  bsStyle="primary">Start</Label></h1>
            </Col>
            <Col xs={8} xsOffset={1} style={{}}>
              <DateTimePicker 
                onChange={(name,value)=>{
                  this.state.test(name,this.props.Rpt.noReceivers.dateStart,this.props.Rpt.noReceivers.dateEnd);
                  this.props.setNoReceiversDateStart(name);
                  this.props.NoReceiversDateRange();
                }}
              defaultValue={this.props.Rpt.noReceivers.dateStart} />
            </Col>
          </Row>
          <Row>
            <Col xs={1}>
              <h1 style={{marginTop:0}}><Label  bsStyle="primary">End</Label></h1>
            </Col>
            <Col xs={8} xsOffset={1}>
              <DateTimePicker 
                onChange={(name,value)=>{
                  this.props.setNoReceiversDateEnd(name);
                  this.props.NoReceiversDateRange();
                }}
              defaultValue={this.props.Rpt.noReceivers.dateEnd} />
            </Col>
          </Row>
        </Panel>
      {runAndBackBtn}
      </div>

    );
  }
}


