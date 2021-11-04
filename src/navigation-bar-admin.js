import React from 'react'
import logo from './commons/images/energy.png';
import {Container} from "react-bootstrap";
import {Navbar} from "react-bootstrap";
import {NavDropdown} from "react-bootstrap";
import {Nav} from "react-bootstrap";
import {withRouter} from "react-router-dom";


const textStyle = {
    color: 'white',
    textDecoration: 'none'
};

const check = false;

const adminLink = (
    <>
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="/admin/user">Users</Nav.Link>
                <Nav.Link href="/admin/device">Device</Nav.Link>
                <Nav.Link href="/admin/sensor">Sensor</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </>
);

const userLink = (
    <>
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="/guest/details">View Details</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </>
);
const logoutLink = (
    <>
        <Navbar.Collapse className="justify-content-end">
            <Nav.Link href="/login">Logout</Nav.Link>
        </Navbar.Collapse>
    </>
);
class AdminNavigationBar extends React.Component{
    constructor(props) {
        super(props);
        this.reload = this.reload.bind(this);
    }

    reload(){
        window.location.reload(false);
        console.log(window.location);
    }

    render(){
        return (<div>

            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">
                        <img
                            src={logo}
                            width="50"
                            height="50"
                            className="d-inline-block align-top"
                            alt="React Bootstrap logo"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    {adminLink}
                    {logoutLink}
                </Container>
            </Navbar>
        </div>)
    }
}

export default AdminNavigationBar
