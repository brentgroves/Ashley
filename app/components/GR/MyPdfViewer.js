//require('../../react-pivot/example/demo.css')
//import React, { Component, PropTypes } from 'react';
import React from 'react';
import PDF from 'react-pdf-js';

var _ = require('lodash');
var joins = require('lodash-joins');


 
class MyPdfViewer extends React.Component {
  constructor(props) {
    super(props);
    this.onDocumentComplete = this.onDocumentComplete.bind(this);
    this.onPageComplete = this.onPageComplete.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.state = {
//      updateChk1:this.props.updateChk1
    };

  }
 
  onDocumentComplete(pages) {

    if ('development'==process.env.NODE_ENV) {
      console.log(`onDocumentComplete:this.state = } `);
      console.dir(this.state);
    }
    this.setState({ page: 1, pages });
  }
 
  onPageComplete(page) {
    this.setState({ page });
  }
 
  handlePrevious() {
    this.setState({ page: this.state.page - 1 });
  }
 
  handleNext() {
    this.setState({ page: this.state.page + 1 });
  }
 
  renderPagination(page, pages) {
    let previousButton = <li className="previous" onClick={this.handlePrevious}><a href="#"><i className="fa fa-arrow-left"></i> Previous</a></li>;
    if (page === 1) {
      previousButton = <li className="previous disabled"><a href="#"><i className="fa fa-arrow-left"></i> Previous</a></li>;
    }
    let nextButton = <li className="next" onClick={this.handleNext}><a href="#">Next <i className="fa fa-arrow-right"></i></a></li>;
    if (page === pages) {
      nextButton = <li className="next disabled"><a href="#">Next <i className="fa fa-arrow-right"></i></a></li>;
    }
    return (
      <nav>
        <ul className="pager">
          {previousButton}
          {nextButton}
        </ul>
      </nav>
      );
  }
 
  render() {
    let pagination = null;
    if ('development'==process.env.NODE_ENV) {
      console.log(`render: this.state = } `);
      console.dir(this.state);
    }

    if (this.state.pages) {
      pagination = this.renderPagination(this.state.page, this.state.pages);
    }
    return (
      <div>
        <PDF file="/home/brent/myfile.pdf" onDocumentComplete={this.onDocumentComplete} onPageComplete={this.onPageComplete} page={this.state.page} />
        {pagination}
      </div>
      );
  }
}
 
module.exports = MyPdfViewer;