import React from "react";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import * as API_USERS from "../user/api/user-api";
import * as API_DEVICES from "../device/api/device-api";
import { Card, CardHeader, Col, Row} from "reactstrap";
import {Table} from "react-bootstrap";
import { withRouter} from "react-router-dom";
import NavigationBar from "../navigation-bar";
import * as SockJS from "sockjs-client";
import * as Stomp from "stompjs";

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
            clientsID: localStorage.getItem('userID'),
        };
    }


    componentDidMount() {
        this.fetchSpecificUser();
        this.fetchDevices();
        this.connect();
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

    connect() {
        const URL = "https://juhasz-norbert.herokuapp.com/socket";
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
