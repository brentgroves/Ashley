import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import { Grid, Row, Glyphicon, Col, Button} from 'react-bootstrap';


export default class POReqTransChecks extends Component {

  static propTypes = {
    POReqTrans: PropTypes.object.isRequired
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

  var check1Button,check2Button;
 switch (this.props.POReqTrans.chk1) {
     case "success":
        check1Button = 
                  <Row style={chk} >
                    <Col  xs={10}>PO Category Check</Col>
                    <Col  xs={2}><Button bsStyle="success"><Glyphicon glyph="ok" /></Button></Col>
                  </Row>
          break; 
      case "error":
        check1Button = 
                  <Row style={chk} >
                    <Col  xs={10}>PO Category Check</Col>
                    <Col  xs={2}><Button bsStyle="danger"><Glyphicon glyph="remove" /></Button></Col>
                  </Row>;
        break;
      default: 
        check1Button = 
                  <Row style={chk} >
                    <Col  xs={10}>PO Category Check</Col>
                    <Col  xs={2}><Button bsStyle="info"><Glyphicon glyph="time" /></Button></Col>
                  </Row>;
        break;

  }

 switch (this.props.POReqTrans.chk2) {
     case "success":
        check2Button = 
                  <Row style={chk} >
                    <Col  xs={10}>CribMaster Vendor Check</Col>
                    <Col  xs={2}><Button bsStyle="success"><Glyphicon glyph="ok" /></Button></Col>
                  </Row>
          break; 
      case "error":
        check2Button = 
                  <Row style={chk} >
                    <Col  xs={10}>CribMaster Vendor Check</Col>
                    <Col  xs={2}><Button bsStyle="danger"><Glyphicon glyph="remove" /></Button></Col>
                  </Row>;
        break;
      default: 
        check2Button = 
                  <Row style={chk} >
                    <Col  xs={10}>CribMaster Vendor Check</Col>
                    <Col  xs={2}><Button bsStyle="info"><Glyphicon glyph="time" /></Button></Col>
                  </Row>;
        break;

  }

  const jbk ={backgroundColor: 'black' };
    return (
      <div>
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
      </div>
    );
  }
}


