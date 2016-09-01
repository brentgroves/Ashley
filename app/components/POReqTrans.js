import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import POReqTransButton from './POReqTransButton';
//import styles from './Home.css';
//import { Jumbotron, Button, Navbar, NavbarHeader, NavbarBrand,NavbarToggle,NavbarCollapse,  Nav, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import { Grid, Row, Glyphicon, FormGroup,ControlLabel, FormControl, Col, Checkbox, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, MenuItem, Jumbotron,Button} from 'react-bootstrap';
import {Header as NavbarHeader, Brand as NavbarBrand, Toggle as NavbarToggle, Collapse as NavbarCollapse } from 'react-bootstrap/lib/Navbar'
/*
.jumbotron {
    background-color:black !important; 
}
*/


export default class POReqTrans extends Component {

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


/*
if (loggedIn) {
  loginButton = <LogoutButton />;
} else {
  loginButton = <LoginButton />;
}
*/

  render() {

  var isSuccess = true;
  const  chk ={backgroundColor: 'black' , color: 'green' };

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
  <Navbar inverse>
    <NavbarHeader>
      <NavbarBrand>
        <a href="#">IT Groves</a>
      </NavbarBrand>
      <NavbarToggle />
    </NavbarHeader>
    <NavbarCollapse>
      <Nav>
        <LinkContainer to="/POUpdateApp">
          <NavItem eventKey={1}>PO Update</NavItem>
        </LinkContainer>      
        <NavItem eventKey={2} href="#">Link</NavItem>
        <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
          <MenuItem eventKey={3.1}>Action</MenuItem>
          <LinkContainer to="/POUpdateApp">
            <MenuItem eventKey={3.2}>PO Update</MenuItem>
          </LinkContainer>      
          <MenuItem eventKey={3.3}>Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey={3.3}>Separated link</MenuItem>
        </NavDropdown>
      </Nav>
      <Nav pullRight>
        <NavItem eventKey={1} href="#">Link Right</NavItem>
        <NavItem eventKey={2} href="#">Link Right</NavItem>
      </Nav>
    </NavbarCollapse>
  </Navbar>

  <Jumbotron style={jbk} >
    <h1>PO Request Transfer</h1>
    <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
    <p><Button bsStyle="primary">Learn more</Button></p>
    <Grid>

      <Row>
        <Col xs={2} md={4}></Col>
        <Col xs={4} md={4}><POReqTransButton /></Col>
        <Col xs={2} md={4}></Col>
      </Row>
    </Grid>

  </Jumbotron>

      

      {/*     <CustomComponent>Custom Child 3</CustomComponent>  */}

  <ListGroup>
    <ListGroupItem style={chk}>
    <Grid>
      <Row>
        <Col xs={6} md={4}>PO Category Check</Col>
        <Col xs={6} md={4}>{check1Button}</Col>
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

    {/*
    <ListGroupItem style={chk}><span>PO Vendor Check.&nbsp;&nbsp;&nbsp; </span>
    {check3Button}
    </ListGroupItem>
    <ListGroupItem style={chk}><span>PO Vendor Check.&nbsp;&nbsp;&nbsp; </span>
    {check4Button}
    </ListGroupItem>
*/}
  
  </ListGroup>


  </div>

    );
  }
}

const CustomComponent = React.createClass({

  render() {
  const jbk ={backgroundColor: 'black'};
    return (
      <li
        className="list-group-item"
        style={jbk}
        onClick={() => {}}>
        {this.props.children}
      </li>
    );
  }
});


/*
      <div>
        <header>
          <div className="header-brand">
            <img src="../logodoc.bmp" height="35" />
            <p>PO Request Transfer</p>
          </div>
        </header>
        <div className={styles.container}>
          <h2>Home</h2>
          <Link to="/counter">to Counter</Link> 
          <br/>
          <Link to="/POUpdateApp">PO Update</Link>
        </div>
     </div>
            <Jumbotron >
    <h1>Hello, world!</h1>
    <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
    <p><Button bsStyle="primary">Learn more</Button></p>
  </Jumbotron>
    <Navbar inverse>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#">React-Bootstrap</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavItem eventKey={1} href="#">Link</NavItem>
        <NavItem eventKey={2} href="#">Link</NavItem>
        <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
          <MenuItem eventKey={3.1}>Action</MenuItem>
          <MenuItem eventKey={3.2}>Another action</MenuItem>
          <MenuItem eventKey={3.3}>Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey={3.3}>Separated link</MenuItem>
        </NavDropdown>
      </Nav>
      <Nav pullRight>
        <NavItem eventKey={1} href="#">Link Right</NavItem>
        <NavItem eventKey={2} href="#">Link Right</NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>

    <Nav bsStyle="pills" activeKey={1} >
    <NavItem eventKey={1} href="/home">NavItem 1 content</NavItem>
    <NavItem eventKey={2} title="Item">NavItem 2 content</NavItem>
    <NavItem eventKey={3} disabled>NavItem 3 content</NavItem>
</Nav>


        */