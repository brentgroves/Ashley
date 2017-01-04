//require('../../react-pivot/example/demo.css')
import React, { Component, PropTypes } from 'react';
import 'react-widgets/lib/less/react-widgets.less';
import DropdownList from 'react-widgets/lib/DropdownList';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';

import { Label,Row,Col,ListGroup,ListGroupItem,Panel,Table,Button,Glyphicon,ButtonGroup,ButtonToolbar} from 'react-bootstrap';
var Moment = require('moment');
var momentLocalizer = require('react-widgets/lib/localizers/moment');

var classNames = require('classnames');
import * as STATE from "../../actions/Rpt/State.js"


//require('../../css/Rpt/styles.css')
import styles from '../../css/Rpt/styles.css';

momentLocalizer(Moment);


export default class DateTimeRange extends React.Component {
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
 
 test(greeting){
  console.log(`greeting: ${greeting}`);
 }

  render() {
    var saveAndCancelBtn;
    if(
           (STATE.OPENPO_DATE_RANGE_NOT_READY==this.props.Rpt.state) 
      ){
      saveAndCancelBtn = 
      <Row>
        <Col xs={4} >&nbsp;</Col>
        <Col xs={1}><Button  onClick={this.props.OpenPOVendorEmail} bsSize="large" bsStyle="info" disabled>Continue</Button></Col>
        <Col xs={1} >&nbsp;</Col>
        <Col xs={2}><Button onClick={()=>this.props.setState(STATE.NOT_STARTED)} bsSize="large" bsStyle="warning">Back</Button></Col>
        <Col xs={3}>&nbsp;</Col>
      </Row>
    }else{
      saveAndCancelBtn = 
      <Row>
        <Col xs={4} >&nbsp;</Col>
        <Col xs={2}><Button  onClick={this.props.OpenPOVendorEmail} bsSize="large" bsStyle="info" >Continue</Button></Col>
        <Col xs={1}><Button style={{marginLeft:-25}} onClick={()=>this.props.setState(STATE.NOT_STARTED)} bsSize="large" bsStyle="warning">Back</Button></Col>
        <Col xs={3}>&nbsp;</Col>
      </Row>
    }
    
    var pageNoClass = classNames(
      'pagination','hidden-xs', 'pull-left'
    );


    return (
      <div>
        <Row>
          <Col xs={4}>&nbsp;</Col>
          <Col xs={3}><h1><Label bsStyle="primary">Start</Label></h1></Col>

          <Col xs={3}><h1><Label bsStyle="primary">End</Label></h1></Col>
          <Col xs={2}>&nbsp;</Col>
        </Row>
        <Row>
          <Col xs={4} >&nbsp;</Col>
          <Col xs={3}>
            <DateTimePicker 
              onChange={(name,value)=>{
                this.props.setOpenPODateStart(name);
                this.props.OpenPOVendorDateRange();
              }}
            defaultValue={this.props.Rpt.openPO.dateStart} />
          </Col>
          <Col xs={3}>
            <DateTimePicker 
              onChange={(name,value)=>{
                this.props.setOpenPODateEnd(name);
                this.props.OpenPOVendorDateRange();
              }}
            defaultValue={this.props.Rpt.openPO.dateEnd} />
          </Col>
          <Col xs={2}>&nbsp;</Col>
        </Row>
        <Row>
          <Col xs={1}>&nbsp;</Col>
        </Row>
        <Row>
          <Col xs={1}>&nbsp;</Col>
        </Row>
         {saveAndCancelBtn}  

      </div>
    );
  }
}


