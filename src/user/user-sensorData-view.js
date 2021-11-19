import React from "react";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import * as API_USERS from "../user/api/user-api";
import * as API_DEVICES from "../device/api/device-api";
import * as API_SENSOR_DATA from "../sensor/api/sensor-data-api";
import { Card, CardHeader, Col, Row} from "reactstrap";
import {Table} from "react-bootstrap";
import { withRouter} from "react-router-dom";
import NavigationBar from "../navigation-bar";
import * as SockJS from "sockjs-client";
import * as Stomp from "stompjs";

class ViewSensorDataContainer extends React.Component{

    constructor(props) {
        super(props);
        this.reload = this.reload.bind(this);
        this.state = {
            collapseForm: false,
            tableData: [],
            tableSensorData: [],
            userData: [],
            isLoaded: false,
            errorStatus: 0,
            client: null,
            error: null,
            clientsID: localStorage.getItem('userID'),
            sensorID: [],
            sensorDatas: [],
        };
    }


    componentDidMount() {
        this.fetchSpecificUser();
        this.fetchDevices();
        this.fetchSensorData();
        this.connect();
    }

    connect() {
        const URL = "http://localhost:8080/socket";
        const websocket = new SockJS(URL);
        this.stompClient = Stomp.over(websocket);
        const stomp=this.stompClient;
        stomp.connect({}, frame => {
          stomp.subscribe(
            `/topic/client/${this.state.clientsID}`,
            (notification) => {
              let message = notification.body;
              if (message != null) {
                alert(message);
              }
            }
          );
        });
    }
    fetchSensorData(){
        return API_SENSOR_DATA.getSensorDatas((result, status, err) => {
            if(result!==null && status === 200){
                console.log(result);
                let newSesnorDatas = [];
                for(let i=0;i<result.length;i++){
                    for(let j=0;j<this.state.tableData.length;j++){
                        if(result[i].sensor.id == this.state.tableData[j].sensor.id){
                            newSesnorDatas.push(result[i]);
                        }
                    }
                }
                this.setState({
                    isLoaded: true,
                    sensorDatas: newSesnorDatas
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err,
                }));
            }
        })
    }

    fetchDevices(){
        return API_DEVICES.getDevices((result, status, err) => {
            if(result!==null && status === 200){
                console.log("devices: " + this.state.userData.id);
                let newDevices = [];
                for(let i=0;i<result.length;i++){
                    if(result[i].client!==null){
                        if(result[i].client.id === this.state.userData.id){
                            result[i]["norbi"] = "muie rusu";
                            let aux = result[i];
                            console.log(result[i]);
                            newDevices.push(aux);
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
        this.fetchSensorData();
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
                                            ["ID", "Value"].map((value,index)=>
                                                <th>{value}</th>)
                                        }
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.sensorDatas.map((value, index) =>
                                        <tr>
                                            <td>{this.state.sensorDatas[index].id}</td>
                                            <td>{this.state.sensorDatas[index].energyConsumption}</td>
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

export default withRouter(ViewSensorDataContainer);