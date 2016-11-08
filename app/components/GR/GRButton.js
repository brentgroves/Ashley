import ProgressButton from 'react-progress-button'
import React, { Component } from 'react';

const GRButton = React.createClass({
  getInitialState () {
    return {
      buttonState: ''
    }
  },

  render () {
    if ('development'==process.env.NODE_ENV) {
      console.log('button render =' + this.props.GenR.goButton);
    }


    return (
      <div>
        <ProgressButton onClick={this.handleClick} 
        state={this.props.GenR.goButton}>
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

export default GRButton;