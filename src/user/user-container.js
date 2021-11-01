import React from "react";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import * as API_USERS from "../user/api/user-api";
import { Card, CardHeader, Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {Table} from "react-bootstrap";
import UserForm from "./components/user-form";
import {Button} from "react-bootstrap";
import UpdateUserForm from "./components/update-user-form";
import AddDeviceForm from "./components/add-device-form";

class UserContainer extends React.Component{
    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.toggleUpdateForm = this.toggleUpdateForm.bind(this);
        this.toggleAddDeviceForm = this.toggleAddDeviceForm.bind(this);
        this.reload = this.reload.bind(this);
        this.state = {
            selected: false,
            selectedUpdateForm: false,
            selectedAddDeviceForm: false,
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

    toggleAddDeviceForm(){
        this.setState({selectedAddDeviceForm: !this.state.selectedAddDeviceForm});
    }

    reload() {
        this.setState({
            isLoaded: false
        });
        this.toggleForm();
        this.fetchUsers();
    }


    render() {
        {console.log(this.state.tableData)}
        return (
            <div>
                <CardHeader>
                    <strong> User Management </strong>
                </CardHeader>
                <Card>
                    <br/>
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            <Button variant="outline-secondary" onClick={this.toggleForm}>Add User </Button>
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
                                             ["ID","Username", "Token", "Role", "Name", "Address", "BirthDate", "Delete", "Update", "Device"].map((value,index)=>
                                             <th>{value}</th>)
                                         }
                                     </tr>
                                 </thead>
                                 <tbody>
                                 {this.state.tableData.map((value, index) =>
                                    <tr>
                                        <td>{this.state.tableData[index].id}</td>
                                        <td>{this.state.tableData[index].username}</td>
                                        <td>{this.state.tableData[index].token}</td>
                                        <td>{this.state.tableData[index].role}</td>
                                        <td>{this.state.tableData[index].name}</td>
                                        <td>{this.state.tableData[index].address}</td>
                                        <td>{this.state.tableData[index].birthDay.substring(0,10)}</td>
                                        <td>
                                            <Button variant="outline-secondary" onClick={()=>this.deleteUserID(this.state.tableData[index].id)}>Delete</Button>
                                        </td>
                                        <td>
                                            <Button variant="outline-secondary" onClick={()=>this.updateUser(this.state.tableData[index].id)}>Update</Button>
                                        </td>
                                        <td>
                                            <Button variant="outline-secondary" onClick={()=>this.addDevice(this.state.tableData[index].id)}>Add Device</Button>
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
                    <ModalHeader toggle={this.toggleForm}> Add User: </ModalHeader>
                    <ModalBody>
                        <UserForm reloadHandler={this.reload}/>
                    </ModalBody>
                </Modal>


                <Modal isOpen={this.state.selectedUpdateForm} toggle={this.toggleUpdateForm}
                       className={this.props.className} size="lg">
                    <ModalHeader toggle={this.toggleUpdateForm}> Update User: </ModalHeader>
                    <ModalBody>
                        {this.state.client !== null && localStorage.setItem('client', JSON.stringify(this.state.client))}
                        <UpdateUserForm reloadHandler={this.reload}/>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.selectedAddDeviceForm} toggle={this.toggleAddDeviceForm}
                       className={this.props.className} size="lg">
                    <ModalHeader toggle={this.toggleAddDeviceForm}> Add Device: </ModalHeader>
                    <ModalBody>
                        {this.state.client !== null && localStorage.setItem('client', JSON.stringify(this.state.client))}
                        <AddDeviceForm reloadHandler={this.reload}/>
                    </ModalBody>
                </Modal>
            </div>
        )
    }

    updateUser=(id)=>{
        API_USERS.getUser(id, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    client: result,
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

    deleteUserID=(id)=> {
        if(window.confirm("Are u sure u want to delete this user?")){
            //TODO delete user
            return API_USERS.deleteUser(id, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    console.log("Successfully deleted user with id: " + result);
                    this.fetchUsers();
                } else {
                    this.setState(({
                        errorStatus: status,
                        error: error
                    }));
                }
            });
        }
    }

    addDevice=(id)=> {
        API_USERS.getUser(id, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    client: result,
                    isLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
        this.toggleAddDeviceForm();
    }
}

export default UserContainer;