import React from "react";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import * as API_DEVICES from "../device/api/device-api";
import { Card, CardHeader, Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {Table} from "react-bootstrap";
import DeviceForm from "./components/device-form";
import {Button} from "react-bootstrap";
import UpdateDeviceForm from "./components/device-update-form";

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
            isLoaded: false,
            errorStatus: 0,
            device: null,
            error: null
        };
    }

    componentDidMount() {
        this.fetchDevices();
    }

    fetchDevices() {
        return API_DEVICES.getDevices((result, status, err) => {

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
        this.fetchDevices();
    }

    render() {
        return (
            <div>
                <CardHeader>
                    <strong> Device Management </strong>
                </CardHeader>
                <Card>
                    <br/>
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            <Button variant="outline-secondary" onClick={this.toggleForm}>Add Device </Button>
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
                                        ["ID","Address", "AVG E.C.", "MAX E.C.", "Description", "Sensor Name", "Delete", "Update"].map((value,index)=>
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
                                        <td>
                                            <Button variant="outline-secondary" onClick={()=>this.deleteUserID(this.state.tableData[index].id)}>Delete</Button>
                                        </td>
                                        <td>
                                            <Button variant="outline-secondary" onClick={()=>this.updateDevice(this.state.tableData[index].id)}>Update</Button>
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
        )

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

    deleteUserID=(index)=> {
        if(window.confirm("Are u sure u want to delete this device?")){
            //TODO delete user
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
}

export default DeviceContainer;