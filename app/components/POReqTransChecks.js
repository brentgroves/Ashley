import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import POReqTransButton from '../containers/POReqTransButton';
//import styles from './Home.css';
//import { Jumbotron, Button, Navbar, NavbarHeader, NavbarBrand,NavbarToggle,NavbarCollapse,  Nav, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import { Grid, Row, Glyphicon, FormGroup,ControlLabel, FormControl, Col, Checkbox, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, MenuItem, Jumbotron,Button} from 'react-bootstrap';
import {Header as NavbarHeader, Brand as NavbarBrand, Toggle as NavbarToggle, Collapse as NavbarCollapse } from 'react-bootstrap/lib/Navbar'
/*
.jumbotron {
    background-color:black !important; 
}

    <Grid>

      <Row>
        <Col xs={3} md={3}><POReqTransButton /></Col>
      </Row>
    </Grid>
     <br/><br/>
  <ListGroup>
    <ListGroupItem >
    <Grid style={chk}>
      <Row>
        <Col xs={1} md={1}>PO Category Check</Col>
        <Col xs={1} md={1}>{check1Button}</Col>
        <Col xs={1} md={1}>{check1Button}</Col>
        <Col xs={1} md={1}>{check1Button}</Col>
        </Row>
    </Grid>
    </ListGroupItem>
    <ListGroupItem style={chk}>
      <Grid>
        <Row>
          <Col xs={6} md={4}>PO Vendor Check</Col>
          <Col xs={6} md={4}>{check2Button}</Col>
          </Row>
      </Grid>
    </ListGroupItem>
    <ListGroupItem style={chk}>
      <Grid>
        <Row>
          <Col xs={6} md={4}>Check #3</Col>
          <Col xs={6} md={4}>{check3Button}</Col>
          </Row>
      </Grid>
    </ListGroupItem>
  </ListGroup>
  </div>

      <ListGroup >
        <ListGroupItem style={chk}>
        <Grid  >
          <Row>
            <Col  xs={2} md={2}>PO Category Check</Col>
            <Col xs={2} md={2}>{check1Button}</Col>
          </Row>
        </Grid>
        </ListGroupItem>
      <ListGroupItem >
        <Grid>
          <Row>
            <Col xs={3} md={3}>PO Vendor Check</Col>
            <Col xs={1} md={1}>{check2Button}</Col>
            </Row>
        </Grid>
      </ListGroupItem>
      <ListGroupItem style={chk} >
        <Grid >
          <Row>
            <Col xs={2} md={2}>PO Category Check</Col>
            <Col xs={2} md={2}>{check1Button}</Col>
          </Row>
        </Grid>
      </ListGroupItem>
    </ListGroup>

*/


export default class POReqTransChecks extends Component {

  static propTypes = {
    checks: PropTypes.object.isRequired,
    setCheck1: PropTypes.func.isRequired
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

  var check1Button;
  switch (this.props.checks.chk1) {
      case "success":
          check1Button= <Button bsStyle="success"><Glyphicon glyph="ok" /></Button>;
          break; 
      case "failure":
          check1Button= <Button bsStyle="danger"><Glyphicon glyph="remove" /></Button>;
          break; 
      default: 
           check1Button= <Button bsStyle="info"><Glyphicon glyph="time" /></Button>;
  }

  var check2Button;
  switch (this.props.checks.chk2) {
      case "success":
          check2Button= <Button bsStyle="success"><Glyphicon glyph="ok" /></Button>;
          break; 
      case "failure":
          check2Button= <Button bsStyle="danger"><Glyphicon glyph="remove" /></Button>;
          break; 
      default: 
           check2Button= <Button bsStyle="info"><Glyphicon glyph="time" /></Button>;
  }

  var check3Button;
  switch (this.props.checks.chk3) {
      case "success":
          check3Button= <Button bsStyle="success"><Glyphicon glyph="ok" /></Button>;
          break; 
      case "failure":
          check3Button= <Button bsStyle="danger"><Glyphicon glyph="remove" /></Button>;
          break; 
      default: 
           check3Button= <Button bsStyle="info"><Glyphicon glyph="time" /></Button>;
  }

  const jbk ={backgroundColor: 'black' };
    return (
      <div>

        <Row >
          <Col xs={1}>&nbsp;</Col>
        </Row>
        <Row>
          <Col xs={1}>&nbsp;</Col>
        </Row>
        <Row>
          <Col xs={1}>&nbsp;</Col>
        </Row>
        <Row>
          <Col xs={3} >&nbsp;</Col>
          <Col xs={6}><POReqTransButton /></Col>
          <Col xs={3}>&nbsp;</Col>
        </Row>
        <Row>
          <Col xs={1}>&nbsp;</Col>
        </Row>
        <Row >
          <Col xs={11}>
              <Row style={chk} >
                <Col  xs={10}>PO Category Check</Col>
                <Col  xs={2}>{check1Button}</Col>
              </Row>
              <Row style={chk} >
                <Col xs={10}>PO Vendor Check</Col>
                <Col xs={2}>{check2Button}</Col>
              </Row>
              <Row style={chk} >
                <Col xs={10}>Transfering</Col>
                <Col xs={2}>{check3Button}</Col>
              </Row>
          </Col>
        </Row>
  </div>

    );
  }
}


