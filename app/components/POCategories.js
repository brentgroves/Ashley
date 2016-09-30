import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import fetch from 'isomorphic-fetch';
import POReqTrans from '../api/POReqTrans';
import { form, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';
import {Feedback as FeedbackX, } from 'react-bootstrap/lib/FormControl'


const POCategories = React.createClass({

	displayName: 'POCategories',
    propTypes: {
        poCategories: PropTypes.array.isRequired,
   		label: React.PropTypes.string
    },
  getInitialState() {
    return {
      value: ''
    };
  },

  handleChange(e) {
    this.setState({ value: e.target.value });
  },

	// getInitialState () {
	// 	return {
	// 		multi: false
	// 	};
	// },
	onChange (value) {
		this.props.rowData.UDF_POCATEGORY = value.UDF_POCATEGORY;
		this.setState({
			value: value,
		});
	},
	switchToMulti () {
		this.setState({
			multi: true,
			value: [this.state.value],
		});
	},
	switchToSingle () {
		this.setState({
			multi: false,
			value: this.state.value ? this.state.value[0] : null
		});
	},
	getUsers (input,callBack) {
      var that = this;
//	  POUpdateAPI.getPOCategories.call(that,callBack);
	},
	gotoUser (value, event) {
		window.open(value.html_url);
	},
	  getValidationState() {
	    const length = this.state.value.length;
	    if (length > 10) return 'success';
	    else if (length > 5) return 'warning';
	    else if (length > 0) return 'error';
	  },

	/*
	render () {
		return (
			<div className="section">
				<h3 className="section-heading">{this.props.label}</h3>
				<Select.Async multi={this.state.multi} value={this.state.value} onChange={this.onChange} onValueClick={this.gotoUser} valueKey="UDF_POCATEGORY" labelKey="descr" loadOptions={this.getUsers} minimumInput={1} backspaceRemoves={false} />
			</div>
		);
	}

				<h3 className="section-heading">{this.props.label}</h3>

				<Select 
				multi={this.state.multi} 
				value={this.state.value} 
				options={this.props.poCategories}
				onChange={this.onChange} 
				onValueClick={this.gotoUser} 
				valueKey="UDF_POCATEGORY" 
				labelKey="descr" options={this.props.poCategories} minimumInput={1} backspaceRemoves={false} />

	*/
	render () {
		return (
			<div className="section">
      <form>
        <FormGroup
          controlId="formBasicText"
          validationState={this.getValidationState()}
        >
          <ControlLabel>Working example with validation</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="Enter text"
            onChange={this.handleChange}
          />
          <FeedbackX />
          <HelpBlock>Validation is based on string length.</HelpBlock>
        </FormGroup>
      </form>

			</div>
		);
	}
});

module.exports = POCategories;