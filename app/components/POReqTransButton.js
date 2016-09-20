import ProgressButton from 'react-progress-button'
import React, { Component } from 'react';
import POReqTrans from '../api/POReqTrans';

const POReqTransButton = React.createClass({
  getInitialState () {
    return {
      buttonState: ''
    }
  },

  render () {
    return (
      <div>
        <ProgressButton onClick={this.handleClick} state={this.state.buttonState}>
          Go!
        </ProgressButton>
      </div>
    )
  },

  handleClick () {
    this.setState({buttonState: 'loading'});
      POReqTrans.call(this);

   // make asynchronous call
  //   setTimeout(function() {
  //     POReqTrans.call(this);
  // //    this.props.setCheck1('failure');
  // //    this.setState({buttonState: 'success'})
  //   }.bind(this), 3000)
  }
})

export default POReqTransButton;