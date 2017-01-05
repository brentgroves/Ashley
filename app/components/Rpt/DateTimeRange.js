//require('../../react-pivot/example/demo.css')
import React, { Component, PropTypes } from 'react';
import 'react-widgets/lib/less/react-widgets.less';
import DropdownList from 'react-widgets/lib/DropdownList';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';

import '../../css/Rpt/styles.global.css';
 
import { FormGroup,FormControl,HelpBlock,Checkbox,ControlLabel,Label,Row,Col,ListGroup,ListGroupItem,Panel,Table,Button,Glyphicon,ButtonGroup,ButtonToolbar} from 'react-bootstrap';

import { ButtonInput } from 'react-bootstrap';
 
import Validation from 'react-validation';
// From v2.10.0
// import { rules, Form, Input, Select, Textarea, Button } from 'react-validation/lib/build/validation.rc'
import validator from 'validator';


var Moment = require('moment');
var momentLocalizer = require('react-widgets/lib/localizers/moment');

var classNames = require('classnames');
import * as STATE from "../../actions/Rpt/State.js"


//require('../../css/Rpt/styles.css')
import styles from '../../css/Rpt/styles.css';

momentLocalizer(Moment);


// Use Object.assign or any similar API to merge a rules
// NOTE: IE10 doesn't have Object.assign API natively. Use polyfill/babel plugin.
Object.assign(Validation.rules, {
    // Key name maps the rule
    required: {
        // Function to validate value
        // NOTE: value might be a number -> force to string
        rule: value => {
            return value.toString().trim();
        },
        // Function to return hint
        // You may use current value to inject it in some way to the hint
        hint: value => {
            return <span className='form-error is-visible'>Required</span>
        }
    },
    email: {
        // Example usage with external 'validator'
        rule: value => {
            return validator.isEmail(value);
        },
        hint: value => {
            return <span className='form-error is-visible'>{value} isnt an Email.</span>
        }
    },
    // This example shows a way to handle common task - compare two fields for equality
    password: {
        // rule function can accept argument:
        // components - components registered to Form mapped by name
        rule: (value, components) => {
            const password = components.password.state;
            const passwordConfirm = components.passwordConfirm.state;
            const isBothUsed = password
                && passwordConfirm
                && password.isUsed
                && passwordConfirm.isUsed;
            const isBothChanged = isBothUsed && password.isChanged && passwordConfirm.isChanged;

            if (!isBothUsed || !isBothChanged) {
                return true;
            }

            return password.value === passwordConfirm.value;
        },
        hint: () => <span className="form-error is-visible">Passwords should be equal.</span>
    },
    // Define API rule to show hint after API error response
    api: {
        // We don't need the rule here because we will call the 'showError' method by hand on API error
        hint: value => (
            <button
                className="form-error is-visible"
            >
                Vendor and/or MRO must be checked.
            </button>
        )
    }
});


export default class DateTimeRange extends React.Component {
  static propTypes = {
    Rpt: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);



    this.state = {
      test:this.test.bind(this),
      emailMRO:false

    };
    if ('development'==process.env.NODE_ENV) {
//      console.log(`POPrompt:this.props.toggleOpenPOSelected=>`);
//      console.dir(this.props.toggleOpenPOSelected);
    }
  }
 
 test(greeting){
  console.log(`greeting: ${greeting}`);
 }

 handleSubmit(event){
        event.preventDefault();
      console.log (`handleSubmit`);
      this.form.showError('MRO','api');
        // Emulate async API call
    };

    removeApiError(){
     this.form.hideError('MRO');
     this.form.hideError('Vendor');
     console.log (`removeApiError`);
    };

 toggleEmail(){
    console.log (`toggleEmail =>${this.state.emailMRO}`);
    this.state.emailMRO=!this.state.emailMRO;
  };
  
  
  render() {



    var continueAndBackBtn;
    if(
           (STATE.OPENPO_DATE_RANGE_NOT_READY==this.props.Rpt.state) 
      ){
     continueAndBackBtn = 
      <Row>
        <Col xs={4} >&nbsp;</Col>
        <Col xs={1}><Button  onClick={this.props.OpenPOVendorEmail} bsSize="large" bsStyle="info" disabled>Continue</Button></Col>
        <Col xs={1} >&nbsp;</Col>
        <Col xs={2}><Button onClick={()=>this.props.setState(STATE.NOT_STARTED)} bsSize="large" bsStyle="warning">Back</Button></Col>
        <Col xs={3}>&nbsp;</Col>
      </Row>
    }else{
      continueAndBackBtn = 
      <Row>
        <Col xs={4} >&nbsp;</Col>

        <Col xs={2}><Button  onClick={this.handleSubmit.bind(this)} bsSize="large" bsStyle="info" >Continue</Button></Col>
        <Col xs={1}><Button style={{marginLeft:-25}} onClick={()=>this.props.setState(STATE.NOT_STARTED)} bsSize="large" bsStyle="warning">Back</Button></Col>
        <Col xs={3}>&nbsp;</Col>
      </Row>
    }

  var formInstance;
  formInstance = 
<Validation.components.Form ref={c => { this.form = c }} onSubmit={this.handleSubmit.bind(this)}>
            <Row>
            <Col smOffset={1} >
                    <label>
                        <Validation.components.Input
                          onFocus={this.removeApiError.bind(this)}
                          placeholder="username"
                          type="checkbox"
                          errorClassName="is-invalid-input"
                          containerClassName=""
                          value="MRO"
                          name="MRO"
                          validations={[]}
                        />
                    </label>
              </Col>
              <Col smOffset={1}>
                    <label>
                        <Validation.components.Input
                          onFocus={this.removeApiError.bind(this)}
                          placeholder="username"
                          type="checkbox"
                          errorClassName="is-invalid-input"
                          containerClassName=""
                          value="Username"
                          name="Vendor"
                          validations={[]}
                        />
                    </label>
                </Col>
            </Row>
        </Validation.components.Form>

    var email;
    if(this.props.Rpt.openPO.emailMRO){

      email=
<div>
<h1 >
      <span style={{borderStyle:'solid'}} >

      <Label   bsStyle='default' bsSize="large" for="test">
          MRO 
      </Label>
      <Button onClick={this.props.OpenPOEmailMROToggle} name="test" bsStyle='primary' bsSize="medium"><Glyphicon style={{  opacity: 1}} glyph="ok" /></Button>
      </span>
      <span style={{marginLeft:15,borderStyle:'solid'}} >

      <Label   bsStyle='default' bsSize="large" for="test">
          Vendor
      </Label>
      <Button onClick={this.props.OpenPOEmailVendorToggle} name="test" bsStyle='primary' bsSize="medium"><Glyphicon style={{  opacity: 1}} glyph="ok" /></Button>
      </span>

</h1>
</div>
    }else{
      email=
      <div>
      <h1>
      <span style={{borderStyle:'solid'}} >
      <Label  bsStyle='default' bsSize="large" for="test">
          MRO 
      </Label>
      <Button onClick={this.props.OpenPOEmailMROToggle} bsStyle='primary' bsSize="medium"><Glyphicon style={{  opacity: 0}} glyph="ok" /></Button>
      </span>
      <span style={{marginLeft:15,borderStyle:'solid'}} >
      <Label  bsStyle='default' bsSize="large" for="test">
          Vendor 
      </Label>
      <Button onClick={this.props.OpenPOEmailVendorToggle} bsStyle='primary' bsSize="medium"><Glyphicon style={{  opacity: 0}} glyph="ok" /></Button>
      </span>

</h1>
      </div>

    }

    var pageNoClass = classNames(
      'pagination','hidden-xs', 'pull-left'
    );

    const dateHeader = (
      <h3 style={{textAlign:'center'}}>PO Date Range</h3>
    );

    const emailHeader = (
      <h3 style={{textAlign:'center'}}>EMail</h3>
    );

    return (
      <div>
          <Panel style={{marginLeft:200,marginRight:200}}>        
              <Panel  header={dateHeader}>
              <Row>
                <Col xs={1} >
                  <h1 style={{marginTop:0}}><Label  bsStyle="primary">Start</Label></h1>
                </Col>
                <Col xs={8} xsOffset={1} style={{}}>
                  <DateTimePicker 
                    onChange={(name,value)=>{
                      this.props.setOpenPODateStart(name);
                      this.props.OpenPOVendorDateRange();
                    }}
                  defaultValue={this.props.Rpt.openPO.dateStart} />
                </Col>
               </Row>
               <Row>
                 <Col xs={1}>
                    <h1 style={{marginTop:0}}><Label  bsStyle="primary">End</Label></h1>
                  </Col>
                  <Col xs={8} xsOffset={1}>
                    <DateTimePicker 
                      onChange={(name,value)=>{
                        this.props.setOpenPODateEnd(name);
                        this.props.OpenPOVendorDateRange();
                      }}
                    defaultValue={this.props.Rpt.openPO.dateEnd} />
                   </Col>
                </Row>
              </Panel>
              <Panel  header={dateHeader}>
                {email}
              </Panel>
              {formInstance}
          </Panel>

        {continueAndBackBtn}
</div>

    );
  }
}


/*
              {formInstance}

            <Col>
              <Panel  header={dateHeader}>
                <Col ><h1 style={{marginTop:0}}><Label  bsStyle="primary">Start</Label></h1>
                  <DateTimePicker style={{marginLeft:15}}
                    onChange={(name,value)=>{
                      this.props.setOpenPODateStart(name);
                      this.props.OpenPOVendorDateRange();
                    }}
                  defaultValue={this.props.Rpt.openPO.dateStart} />
                <h1 style={{marginTop:0}}><Label  bsStyle="primary">End</Label></h1>
                  <DateTimePicker style={{marginLeft:15}}
                    onChange={(name,value)=>{
                      this.props.setOpenPODateEnd(name);
                      this.props.OpenPOVendorDateRange();
                    }}
                  defaultValue={this.props.Rpt.openPO.dateEnd} />
                  </Col>
              </Panel>
              </Col>
*/