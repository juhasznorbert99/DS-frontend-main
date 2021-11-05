import React from "react";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import * as API_DEVICES from "../device/api/device-api";
import * as API_SENSORS from "../sensor/api/sensor-api";
import { Card, CardHeader, Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {Table} from "react-bootstrap";
import DeviceForm from "./components/device-form";
import {Button} from "react-bootstrap";
import UpdateDeviceForm from "./components/device-update-form";
import * as API_USERS from "../user/api/user-api";
import AdminNavigationBar from "../navigation-bar-admin";
import NavigationBar from "../navigation-bar";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";

class DeviceContainer extends React.Component{
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
            sensorData: [],
            userData: [],
            isLoaded: false,
            errorStatus: 0,
            device: null,
            error: null,
            username: null
        };
    }

    componentDidMount() {
        this.fetchDevices();
        this.fetchUsers();
    }

    fetchDevices() {
        return API_DEVICES.getDevices((result, status, err) => {

            if (result !== null && status === 200) {
                let newDevices = [];
                for(let i=0;i<result.length;i++){
                    let device = result[i];
                    if(device.client === null)
                        device.client = ""
                    newDevices.push(device);
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
        });
    }

    fetchUsers(){
        return API_USERS.getClients((result, status, err) => {

            if (result !== null && status === 200) {
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
        });
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };
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
        if(this.state.selected)
            this.toggleForm();
        if(this.state.selectedUpdateForm)
            this.toggleUpdateForm();
        this.fetchDevices();
        this.fetchUsers();
    }


    render() {
        return (
            <div>
                {
                    localStorage.getItem("clientRole") === "admin" &&
                    <div>
                        <NavigationBar role={"admin"}/>
                        <CardHeader>
                            <strong> Device Management </strong>
                        </CardHeader>
                        <Card>
                            <br/>
                            <Row>
                                <Col sm={{size: '8', offset: 1}}>
                                    <Button variant="outline-secondary" onClick={() => this.addDevice()}>Add Device </Button>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col sm={{size: '8', offset: 1}}>
                                    {this.state.isLoaded &&

                                    <Table striped bordered hover variant="light">

                                        <thead>
                                        <tr>
                                            {
                                                ["ID","Address", "AVG E.C.", "MAX E.C.", "Description", "Sensor Name", "Clients Name", "Delete", "Update", "Delete User"].map((value,index)=>
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
                                                <td>{this.state.tableData[index].client.username}</td>
                                                <td>
                                                    <Button variant="outline-secondary" onClick={()=>this.deleteDeviceID(this.state.tableData[index].id)}>Delete</Button>
                                                </td>
                                                <td>
                                                    <Button variant="outline-secondary" onClick={()=>this.updateDevice(this.state.tableData[index].id)}>Update</Button>
                                                </td>
                                                <td>
                                                    <Button variant="outline-secondary" onClick={()=>this.deleteUserFromDevice(this.state.tableData[index])}>Delete User</Button>
                                                </td>
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

                        <Modal isOpen={this.state.selected} toggle={this.toggleForm}
                               className={this.props.className} size="lg">
                            <ModalHeader toggle={this.toggleForm}> Add Device: </ModalHeader>
                            <ModalBody>
                                <DeviceForm reloadHandler={this.reload}/>
                            </ModalBody>
                        </Modal>


                        <Modal isOpen={this.state.selectedUpdateForm} toggle={this.toggleUpdateForm}
                               className={this.props.className} size="lg">
                            <ModalHeader toggle={this.toggleUpdateForm}> Update Device: </ModalHeader>
                            <ModalBody>
                                {this.state.device !== null && localStorage.setItem('device', JSON.stringify(this.state.device))}
                                <UpdateDeviceForm reloadHandler={this.reload}/>
                            </ModalBody>
                        </Modal>
                    </div>
                }
                {
                    localStorage.getItem("clientRole") !== "admin" &&
                    this.props.history.push({pathname: '/'})
                }

            </div>
        )

    }

    addDevice=()=>{
        API_SENSORS.getSensors((result, status, err) =>{
            if(result!==null && status === 200){
                if(result.length>0){
                    this.toggleForm();
                }
            }
        })
    }

    updateDevice=(index)=>{
        API_DEVICES.getDevice(index, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    device: result,
                    isLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
        this.toggleUpdateForm();
    }

    deleteDeviceID=(index)=> {
        if(window.confirm("Are u sure u want to delete this device?")){
            return API_DEVICES.deleteDevice(index, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    console.log("Successfully deleted device with id: " + result);
                    this.fetchDevices();
                } else {
                    this.setState(({
                        errorStatus: status,
                        error: error
                    }));
                }
            });
        }
    }

    deleteUserFromDevice=(device)=>{
        if(window.confirm("Are u sure u want to delete this user from device?")) {
            device.client = null;
            API_DEVICES.postDevice(device, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    console.log("Successfully deleted user from device with id: " + result);
                    this.fetchDevices();
                } else {
                    this.setState(({
                        errorStatus: status,
                        error: error
                    }));
                }
            });
        }
    }

}

export default withRouter(DeviceContainer);