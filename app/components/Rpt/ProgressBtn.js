import ProgressButton from 'react-progress-button'
import React, { Component } from 'react';

const ProgressBtn = React.createClass({
  getInitialState () {
    return {
      buttonState: ''
    }
  },

  render () {
    if ('development'==process.env.NODE_ENV) {
      console.log('button render =' + this.props.Rpt.progressBtn);
    }


    return (
      <div>
        <ProgressButton onClick={this.handleClick}         
        state={this.props.Rpt.progressBtn}>
          Go!
        </ProgressButton>
      </div>
    )
  },

  handleClick () {
    if ('development'==process.env.NODE_ENV) {
      console.log('handleClick');
    }
    this.props.start(true);

  }
})

export default ProgressBtn;