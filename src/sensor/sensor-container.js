import React from "react";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import * as API_SENSORS from "../sensor/api/sensor-api";
import { Card, CardHeader, Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {Table} from "react-bootstrap";
import {Button} from "react-bootstrap";
import SensorForm from "./components/sensor-form";
import UpdateSensorForm from "../sensor/components/sensor-update-form";
import NavigationBar from "../navigation-bar";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";

class SensorContainer extends React.Component{
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
            sensor: null,
            error: null
        };
    }

    componentDidMount() {
        this.fetchSensors();
    }

    fetchSensors() {
        return API_SENSORS.getSensors((result, status, err) => {
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
        this.fetchSensors();
    }


    render() {
        {console.log(this.state.tableData)}
        return (
            <div>
                {

                    localStorage.getItem("clientRole") === "admin" &&
                    <div>
                        <NavigationBar role={"admin"}/>
                        <CardHeader>
                            <strong> Sensor Management </strong>
                        </CardHeader>
                        <Card>
                            <br/>
                            <Row>
                                <Col sm={{size: '8', offset: 1}}>
                                    <Button variant="outline-secondary" onClick={this.toggleForm}>Add Sensor </Button>
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
                                                ["ID","Description","Maximum Value", "Delete", "Update"].map((value,index)=>
                                                    <th>{value}</th>)
                                            }
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.tableData.map((value, index) =>
                                            <tr>
                                                <td>{this.state.tableData[index].id}</td>
                                                <td>{this.state.tableData[index].description}</td>
                                                <td>{this.state.tableData[index].maximumValue}</td>
                                                <td>
                                                    <Button variant="outline-secondary" onClick={()=>this.deleteSensorID(this.state.tableData[index].id)}>Delete</Button>
                                                </td>
                                                <td>
                                                    <Button variant="outline-secondary" onClick={()=>this.updateSensor(this.state.tableData[index].id)}>Update</Button>
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
                            <ModalHeader toggle={this.toggleForm}> Add Sensor: </ModalHeader>
                            <ModalBody>
                                <SensorForm reloadHandler={this.reload}/>
                            </ModalBody>
                        </Modal>


                        <Modal isOpen={this.state.selectedUpdateForm} toggle={this.toggleUpdateForm}
                               className={this.props.className} size="lg">
                            <ModalHeader toggle={this.toggleUpdateForm}> Update Sensor: </ModalHeader>
                            <ModalBody>
                                {this.state.sensor !== null && localStorage.setItem('sensor', JSON.stringify(this.state.sensor))}
                                <UpdateSensorForm reloadHandler={this.reload}/>
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

    updateSensor=(index)=>{
        API_SENSORS.getSensor(index, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    sensor: result,
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

    deleteSensorID=(index)=> {
        //TODO delete all sensor data before deleting sensor
        if(window.confirm("Are u sure u want to delete this sensor?")){
            return API_SENSORS.deleteSensor(index, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    console.log("Successfully deleted sensor with id: " + result);
                    this.fetchSensors();
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

export default withRouter(SensorContainer);