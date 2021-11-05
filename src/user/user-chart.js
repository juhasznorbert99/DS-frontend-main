import React from "react";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import * as API_USERS from "../user/api/user-api";
import * as API_DEVICES from "../device/api/device-api";
import * as API_SENSORS from "../sensor/api/sensor-api";
import * as API_SENSOR_DATA from "../sensor/api/sensor-data-api";
import {Card, CardHeader, Col, Input, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {Table} from "react-bootstrap";
import UserForm from "./components/user-form";
import {Button} from "react-bootstrap";
import UpdateUserForm from "./components/update-user-form";
import AddDeviceForm from "./components/add-device-form";
import {useHistory, useLocation, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import AdminNavigationBar from "../navigation-bar-admin";
import NavigationBar from "../navigation-bar";
import { LineChart, Line, YAxis, XAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


class UserChartContainer extends React.Component{

    constructor(props) {
        super(props);
        this.reload = this.reload.bind(this);
        this.state = {
            collapseForm: false,
            deviceData: [],
            userData: [],
            sensorData: [],
            chartSensorName: [],
            isLoaded: false,
            errorStatus: 0,
            client: null,
            error: null,
            clientsID: localStorage.getItem('userID'),
            data : [
                {
                    "name": "00",
                    "sensor a": 1,
                    "sensor b": 2
                },
                {
                    "name": "01",
                    "sensor a": 3,
                    "sensor b": 4
                },
                {
                    "name": "02",
                    "sensor a": 5,
                    "sensor b": 6
                },
                {
                    "name": "03",
                    "sensor a": 7,
                    "sensor b": 8
                },
                {
                    "name": "04",
                    "sensor a": 9,
                    "sensor b": 10
                },
                {
                    "name": "05",
                    "sensor a": 11,
                    "sensor b": 12
                },
                {
                    "name": "06",
                    "sensor a": 13,
                    "sensor b": 14
                },
                {
                    "name": "07",
                    "sensor a": 15,
                    "sensor b": 16
                },
                {
                    "name": "08",
                    "sensor a": 17,
                    "sensor b": 18
                },
                {
                    "name": "09",
                    "sensor a": 19,
                    "sensor b": 20
                },
                {
                    "name": "10",
                    "sensor a": 21,
                    "sensor b": 22
                },
                {
                    "name": "11",
                    "sensor a": 23,
                    "sensor b": 24
                },
                {
                    "name": "12",
                    "sensor a": 25,
                    "sensor b": 26
                },
                {
                    "name": "13",
                    "sensor a": 27,
                    "sensor b": 28
                },
                {
                    "name": "14",
                    "sensor a": 29,
                    "sensor b": 30
                },
                {
                    "name": "15",
                    "sensor a": 31,
                    "sensor b": 32
                },
                {
                    "name": "16",
                    "sensor a": 33,
                    "sensor b": 34
                },
                {
                    "name": "17",
                    "sensor a": 35,
                    "sensor b": 36
                },
                {
                    "name": "18",
                    "sensor a": 37,
                    "sensor b": 38
                },
                {
                    "name": "19",
                    "sensor a": 39,
                    "sensor b": 40
                },
                {
                    "name": "20",
                    "sensor a": 41,
                    "sensor b": 42
                },
                {
                    "name": "21",
                    "sensor a": 43,
                    "sensor b": 44
                },
                {
                    "name": "22",
                    "sensor a": 45,
                    "sensor b": 46
                },
                {
                    "name": "23",
                    "sensor a": 47,
                    "sensor b": 48
                }
            ],
            chartData: [],
        };
    }



    componentDidMount() {
        this.fetchSpecificUser();
        this.fetchSensorData();
        this.fetchDevices();
        this.fetchSensors("04");
    }

    fetchSensorData(){
        return API_SENSOR_DATA.getSensorDatas((result, status, err) => {
            if(result!==null && status === 200){
                this.setState({
                    sensorData: result,
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

    fetchSensors(value){
        this._value = value;
        return API_DEVICES.getDevices((result, status, err) => {
            if(result!==null && status === 200){
                console.log("devices: " + this.state.userData.id);
                let newDevices = [];
                for(let i=0;i<result.length;i++){
                    if(result[i].client!==null){
                        if(result[i].client.id === this.state.clientsID){
                            newDevices.push(result[i]);
                        }
                    }
                }
                console.log(newDevices);
                let newSensors = []
                for(let i=0;i<newDevices.length;i++){
                    let okay=1;
                    for(let j=0;j<newSensors.length;j++){
                        if(newSensors[j].id === newDevices[i].sensor.id){
                            okay=0;
                        }
                    }
                    if(okay===1){
                        newSensors.push(newDevices[i].sensor);
                    }
                }
                console.log(newSensors);
                this.setState({chartSensorName: newSensors});
                let showValue = [];
                for(let i=0;i<24;i++){
                    let value = {};
                    value["name"] = i.toString();
                    for(let j=0;j<newSensors.length;j++){
                        //TODO instead of i.toString() la valoarea 10
                        let sum=0;
                        for(let k=0;k<this.state.sensorData.length;k++){
                            if(parseInt(this.state.sensorData[k].timestamp.substring(11,13),10) === i){
                                console.log(this.state.sensorData[k].timestamp.substring(5,7));
                                if(this.state.sensorData[k].timestamp.substring(8,10) === this._value)
                                    sum=sum+this.state.sensorData[k].energyConsumption;

                                console.log(this.state.sensorData[k].timestamp.substring(11,13));
                            }
                        }
                        value[newSensors[j].description.toString()] = sum.toString();
                    }
                    showValue.push(value);
                }
                console.log(this.state.sensorData);
                console.log("norbert: ");
                console.log(showValue);
                this.setState({
                    chartData: showValue,
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
                console.log(newDevices);
                let newSensors = []
                for(let i=0;i<newDevices.length;i++){
                    let okay=1;
                    for(let j=0;j<newSensors.length;j++){
                        if(newSensors[j].id === newDevices[i].sensor.id){
                            okay=0;
                        }
                    }
                    if(okay===1){
                        newSensors.push(newDevices[i].sensor);
                    }
                }
                console.log(newSensors);
                this.setState({
                    deviceData: newDevices,
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
        this.fetchSensorData();
        this.fetchDevices();
        this.fetchSensors("04");
    }
    handleChange = event => {
        console.log(event.target.value.substring(8,10));
        console.log(event.target.value);
        this.fetchSensors(event.target.value.substring(8,10));
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
                        <Input type={"date"} onChange={this.handleChange}></Input>
                        <LineChart width={1300} height={250} data={this.state.chartData}
                                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {
                                this.state.chartSensorName && this.state.chartSensorName.map((value, index)=>
                                this.state.chartSensorName[index] &&  this.state.chartSensorName[index].description &&
                                <Line type="monotone" dataKey={this.state.chartSensorName[index].description} stroke="#0095FF" />
                                )
                            }



                        </LineChart>
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

export default withRouter(UserChartContainer);