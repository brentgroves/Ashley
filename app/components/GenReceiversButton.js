import ProgressButton from 'react-progress-button'
import React, { Component } from 'react';
import POReqTrans,{linuxSQLPrime} from '../api/POReqTrans';

const GenReceiversButton = React.createClass({
  getInitialState () {
    return {
      buttonState: ''
    }
  },

  render () {
    if ('development'==process.env.NODE_ENV) {
      console.log('button render =' + this.props.POReqTrans.goButton);
    }


    return (
      <div>
        <ProgressButton onClick={this.handleClick} 
        state={this.props.POReqTrans.goButton}>
          Go!
        </ProgressButton>
      </div>
    )
  },

  handleClick () {
    if ('development'==process.env.NODE_ENV) {
      console.log('handleClick');
    }


 //   this.props.startPORT(true);

   // make asynchronous call
  //   setTimeout(function() {
  //     POReqTrans.call(this);
  // //    this.props.setCheck1('failure');
  // //    this.setState({buttonState: 'success'})
  //   }.bind(this), 3000)
  }
})

export default GenReceiversButton;