import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import POReqTransButton from './POReqTransButton';
//import styles from './Home.css';
//import { Jumbotron, Button, Navbar, NavbarHeader, NavbarBrand,NavbarToggle,NavbarCollapse,  Nav, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import { Glyphicon, FormGroup,ControlLabel, FormControl, Col, Checkbox, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, MenuItem, Jumbotron,Button} from 'react-bootstrap';
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

var check1Button;
if(this.props.checks.chk1="success"){
  check1Button= <Button bsStyle="warning"><Glyphicon glyph="ok" /></Button>;
  check1Button= <Button bsStyle="success"><Glyphicon glyph="ok" /></Button>;
}else{
  check1Button= <Button bsStyle="warning"><Glyphicon glyph="ok" /></Button>;
}

  const jbk ={backgroundColor: 'black' };
  const catChk ={backgroundColor: 'black' , color: 'green' };
//  const jbk ={backgroundColor: '#F16E10'};
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
  </Jumbotron>

      <POReqTransButton />


  <ListGroup>
    <ListGroupItem style={jbk}>Item 1</ListGroupItem>
    <ListGroupItem style={jbk}><span>PO Category Check.&nbsp;&nbsp;&nbsp; </span>
    {check1Button}
    </ListGroupItem>
    <ListGroupItem style={catChk}><span>PO Vendor Check.&nbsp;&nbsp;&nbsp; </span>
      <Button bsStyle="success"><Glyphicon glyph="ok" /></Button>

    </ListGroupItem>
    <CustomComponent>Item 3     
      {/* Indicates a successful or positive action */}
      <Button bsStyle="warning">Success</Button>
    </CustomComponent>
    <CustomComponent>Custom Child 2 </CustomComponent>
    <CustomComponent>Custom Child 3</CustomComponent>

  </ListGroup>

    <FormGroup>
      <Col smOffset={2} sm={10}>
        <Checkbox>Remember me</Checkbox>
      </Col>
    </FormGroup>

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