import React from "react";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import * as API_USERS from "../user/api/user-api";
import * as API_DEVICES from "../device/api/device-api";
import { Card, CardHeader, Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {Table} from "react-bootstrap";
import UserForm from "./components/user-form";
import {Button} from "react-bootstrap";
import UpdateUserForm from "./components/update-user-form";
import AddDeviceForm from "./components/add-device-form";
import {useHistory, useLocation, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import AdminNavigationBar from "../navigation-bar-admin";
import NavigationBar from "../navigation-bar";

class ViewDetailsContainer extends React.Component{

    constructor(props) {
        super(props);
        this.reload = this.reload.bind(this);
        this.state = {
            collapseForm: false,
            tableData: [],
            userData: [],
            isLoaded: false,
            errorStatus: 0,
            client: null,
            error: null,
            clientsID: this.props.history.location.state?.userID,
        };
    }


    componentDidMount() {
        this.fetchSpecificUser();
        this.fetchDevices();
    }

    fetchDevices(){
        return API_DEVICES.getDevices((result, status, err) => {
            if(result!==null && status === 200){
                console.log("devices: " + this.state.userData.id);
                let newDevices = [];
                for(let i=0;i<result.length;i++){
                    if(result[i].client!==null){
                        if(result[i].client.id === this.state.userData.id){
                            newDevices.push(result[i]);
                        }
                    }
                }
                this.setState({
                    tableData: newDevices,
                    isLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        })
    }

    fetchSpecificUser(){
        return API_USERS.getUser(this.state.clientsID, (result, status, err) => {
            if(result!==null && status === 200){
                console.log("user: " + this.state.userData);
                this.setState({
                    userData: result,
                    isLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        })
    }

    reload() {
        this.setState({
            isLoaded: false
        });
        this.fetchSpecificUser();
        this.fetchDevices();
    }

    render() {
        return (
            <div>
                {
                    localStorage.getItem("clientRole") === "guest" &&
                    <div>
                    <NavigationBar role={"guest"}/>
                    <CardHeader>
                        <strong> User Management </strong>
                    </CardHeader>
                    <Card>
                        <br/>
                        <Row>
                            <Col sm={{size: '8', offset: 1}}>
                                {this.state.isLoaded &&

                                <Table striped bordered hover variant="light">

                                    <thead>
                                    <tr>
                                        {
                                            ["ID","Address", "AVG E.C.", "MAX E.C.", "Description", "Sensor Name"].map((value,index)=>
                                                <th>{value}</th>)
                                        }
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.tableData.map((value, index) =>
                                        <tr>

                                            <td>{this.state.tableData[index].id}</td>
                                            <td>{this.state.tableData[index].address}</td>
                                            <td>{this.state.tableData[index].averageEnergyConsumption}</td>
                                            <td>{this.state.tableData[index].maximumEnergyConsumption}</td>
                                            <td>{this.state.tableData[index].description}</td>
                                            <td>{this.state.tableData[index].sensor.description}</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>
                                }
                                {this.state.errorStatus > 0 && <APIResponseErrorMessage
                                    errorStatus={this.state.errorStatus}
                                    error={this.state.error}
                                />   }
                            </Col>
                        </Row>
                    </Card>
                    </div>
                }
                {
                    localStorage.getItem("clientRole") !== "guest" &&
                    this.props.history.push({pathname: '/'})
                }
            </div>
        )
    }

}

export default withRouter(ViewDetailsContainer);