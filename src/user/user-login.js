import React from "react";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import * as API_USERS from "../user/api/user-api";
import {Card, CardHeader, Col, Input, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {Container, Form, FormGroup, Table} from "react-bootstrap";
import {Button} from "react-bootstrap";
import * as API_LOGIN from "../user/api/login-api";
import * as API_SENSORS from "../sensor/api/sensor-api";

class Login extends React.Component{
    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.toggleUpdateForm = this.toggleUpdateForm.bind(this);
        this.reload = this.reload.bind(this);
        this.state = {
            selected: false,
            selectedUpdateForm: false,
            collapseForm: false,
            tableData: [],
            isLoaded: false,
            errorStatus: 0,
            client: null,
            error: null
        };
    }

    componentDidMount() {
        this.fetchUsers();
    }

    fetchUsers() {
        return API_USERS.getClients((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    tableData: result,
                    isLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

    toggleForm() {
        this.setState({selected: !this.state.selected});
    }

    toggleUpdateForm(){
        this.setState({selectedUpdateForm: !this.state.selectedUpdateForm});
    }

    reload() {
        this.setState({
            isLoaded: false
        });
        this.toggleForm();
        this.fetchUsers();
    }



    render() {
        return (
            <div className="maincontainer">
                <div className="container-fluid">
                    <div className="row no-gutter">
                        <div className="col-md-6 offset-3 bg-light">
                            <div className="login d-flex align-items-center py-5">

                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-10 col-xl-7 mx-auto">
                                            <center><h3 className="display-4">Login</h3></center>
                                            <br/>
                                            <Form>
                                                <div className="mb-3">
                                                    <Input id="inputEmail" type="text" placeholder="Email address"
                                                           required="" autoFocus=""
                                                           className="form-control rounded-pill border-0 shadow-sm px-4"/>
                                                </div>
                                                <div className="mb-3">
                                                    <input id="inputPassword" type="password" placeholder="Password"
                                                           required=""
                                                           className="form-control rounded-pill border-0 shadow-sm px-4 text-primary"/>
                                                </div>

                                                <div className="d-grid gap-2 mt-2">
                                                    <Button
                                                        type="button"
                                                        className="btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm"
                                                        onClick={()=>this.login()}>Sign in
                                                    </Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

    login=()=> {
        console.log("gregr");
        let usernameLogin = document.getElementById('inputEmail').value;
        let passwordLogin = document.getElementById('inputPassword').value;
        let user = {
            username: usernameLogin,
            password: passwordLogin
        };
        API_LOGIN.getUser(user, (result, status, err) => {
            if (result !== null && status === 200) {
                console.log(result);
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }
}

export default Login;