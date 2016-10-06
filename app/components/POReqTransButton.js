import ProgressButton from 'react-progress-button'
import React, { Component } from 'react';
import POReqTrans,{linuxSQLPrime} from '../api/POReqTrans';

const POReqTransButton = React.createClass({
  getInitialState () {
    return {
      buttonState: ''
    }
  },

  render () {
    console.log('button render =' + this.props.POReqTrans.goButton);
    /*
    var btnState;
    switch (this.props.POReqTrans.chk1) {
        case "success":
            btnState = 'success';
            break; 
        case "failure":
            btnState = 'error';
            break; 
        default: 
            btnState = '';
            break; 
    }
    */

    return (
      <div>
        <ProgressButton onClick={this.handleClick} state={this.props.POReqTrans.goButton}>
          Go!
        </ProgressButton>
      </div>
    )
  },

  handleClick () {
    console.log('handleClick');

//    this.setState({buttonState: 'loading'});
//    this.props.getPOCategories();
    this.props.startPORT();
     // POReqTrans.call(this);
//        <ProgressButton onClick={this.handleClick} state={this.state.buttonState}>

   // make asynchronous call
  //   setTimeout(function() {
  //     POReqTrans.call(this);
  // //    this.props.setCheck1('failure');
  // //    this.setState({buttonState: 'success'})
  //   }.bind(this), 3000)
  }
})

export default POReqTransButton;