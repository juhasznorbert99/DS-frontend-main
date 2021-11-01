import React from 'react'
import logo from './commons/images/energy.png';
import {Container} from "react-bootstrap";
import {Navbar} from "react-bootstrap";
import {NavDropdown} from "react-bootstrap";
import {Nav} from "react-bootstrap";


const textStyle = {
    color: 'white',
    textDecoration: 'none'
};

const check = false;

const userLink = (
    <>
    <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
            <Nav.Link href="/user">Users</Nav.Link>
            <Nav.Link href="/device">Device</Nav.Link>
            <Nav.Link href="/sensor">Sensor</Nav.Link>
        </Nav>
    </Navbar.Collapse>
    </>
);
const guestLink = (
    <>
        <Navbar.Collapse className="justify-content-end">
            <Nav.Link href="/login">Login</Nav.Link>
        </Navbar.Collapse>
    </>
);

const NavigationBar = () => (
    <div>
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
                {userLink}
                {guestLink}


            </Container>
        </Navbar>
    </div>
);

export default NavigationBar
