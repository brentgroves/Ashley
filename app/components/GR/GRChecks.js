import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import { Grid, Row, Glyphicon, Col, Button} from 'react-bootstrap';
import * as CHK from "../../actions/ChkConst.js"


export default class GRChecks extends Component {

  static propTypes = {
    GenR: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };

  }

  toggle() {
    this.setState({loading: !this.state.loading});
  }


  render() {

  var isSuccess = true;
  const  chk ={backgroundColor: 'black' , color: 'green',border: '1px solid blue',   padding: '10px 30px 10px 10px' };
  const  chk1 ={backgroundColor: 'black' , color: 'green',border: '1px solid blue',   };

  var check0Button,check1Button,check2Button,check3Button;
  switch (this.props.GenR.chk0) {
    case CHK.SUCCESS:
      check0Button = 
        <Row style={chk} >
          <Col  xs={10}>Previous Session Check</Col>
          <Col  xs={2}><Button bsStyle="success"><Glyphicon glyph="ok" /></Button></Col>
        </Row>
      break; 
    case CHK.FAILURE:
        check0Button = 
          <Row style={chk} >
            <Col  xs={10}>Previous Session Check</Col>
            <Col  xs={2}><Button bsStyle="danger"><Glyphicon glyph="remove" /></Button></Col>
          </Row>;
        break;
      default: 
        check0Button = 
          <Row style={chk} >
            <Col  xs={10}>Previous Session Check</Col>
            <Col  xs={2}><Button bsStyle="info"><Glyphicon glyph="time" /></Button></Col>
          </Row>;
        break;

  }

  switch (this.props.GenR.chk1) {
    case CHK.SUCCESS:
      check1Button = 
        <Row style={chk} >
          <Col  xs={10}>Receiver Limit Check</Col>
          <Col  xs={2}><Button bsStyle="success"><Glyphicon glyph="ok" /></Button></Col>
        </Row>
      break; 
    case CHK.FAILURE:
        check1Button = 
          <Row style={chk} >
            <Col  xs={10}>Receiver Limit Check</Col>
            <Col  xs={2}><Button bsStyle="danger"><Glyphicon glyph="remove" /></Button></Col>
          </Row>;
        break;
      default: 
        check1Button = 
          <Row style={chk} >
            <Col  xs={10}>Receiver Limit Check</Col>
            <Col  xs={2}><Button bsStyle="info"><Glyphicon glyph="time" /></Button></Col>
          </Row>;
        break;

  }

  switch (this.props.GenR.chk2) {
    case CHK.SUCCESS:
      check2Button = 
        <Row style={chk} >
          <Col  xs={10}>Preparing Receivers</Col>
          <Col  xs={2}><Button bsStyle="success"><Glyphicon glyph="ok" /></Button></Col>
        </Row>
      break; 
    case CHK.FAILURE:
        check2Button = 
          <Row style={chk} >
            <Col  xs={10}>Preparing Receivers</Col>
            <Col  xs={2}><Button bsStyle="danger"><Glyphicon glyph="remove" /></Button></Col>
          </Row>;
        break;
      default: 
        check2Button = 
          <Row style={chk} >
            <Col  xs={10}>Preparing Receivers</Col>
            <Col  xs={2}><Button bsStyle="info"><Glyphicon glyph="time" /></Button></Col>
          </Row>;
        break;

  }


  switch (this.props.GenR.chk3) {
    case CHK.SUCCESS:
      check3Button = 
        <Row style={chk} >
          <Col  xs={10}>Update Made2Manage</Col>
          <Col  xs={2}><Button bsStyle="success"><Glyphicon glyph="ok" /></Button></Col>
        </Row>
      break; 
    case CHK.FAILURE:
        check3Button = 
          <Row style={chk} >
            <Col  xs={10}>Update Made2Manage</Col>
            <Col  xs={2}><Button bsStyle="danger"><Glyphicon glyph="remove" /></Button></Col>
          </Row>;
        break;
      default: 
        check3Button = 
          <Row style={chk} >
            <Col  xs={10}>Update Made2Manage</Col>
            <Col  xs={2}><Button bsStyle="info"><Glyphicon glyph="time" /></Button></Col>
          </Row>;
        break;

  }

  const jbk ={backgroundColor: 'black' };
    return (
      <div>
        <Row >
          <Col xs={11}>
              {check0Button}
          </Col>
        </Row>
        <Row >
          <Col xs={11}>
              {check1Button}
          </Col>
        </Row>
        <Row >
          <Col xs={11}>
              {check2Button}
          </Col>
        </Row>
        <Row >
          <Col xs={11}>
              {check3Button}
          </Col>
        </Row>
      </div>
    );
  }
}


