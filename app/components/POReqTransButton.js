import ProgressButton from 'react-progress-button'
import React, { Component } from 'react';

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
    this.setState({buttonState: 'loading'})
    // make asynchronous call
    setTimeout(function() {
      this.setState({buttonState: 'success'})
    }.bind(this), 3000)
  }
})

export default POReqTransButton;