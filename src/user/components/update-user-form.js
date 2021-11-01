import React from "react";
import validate from "./validators/user-validator";
import {Button} from "react-bootstrap";
import * as API_USERS from "../api/user-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';

class UpdateSensorForm extends React.Component{
    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;
        this.okay=0;
        this.formControls = {
            username: {
                value: '',
                placeholder: 'Username:',
                valid: false,
                touched: false,
                validationRules: {
                    isRequired: true
                }
            },
            name: {
                value: '',
                placeholder: 'Name:',
                valid: false,
                touched: false,
                validationRules: {
                    isRequired: true
                }
            },
            address: {
                value: '',
                placeholder: 'Address:',
                valid: false,
                touched: false,
                validationRules: {
                    isRequired: true
                }
            },
            birthDay: {
                value: '',
                placeholder: 'Birth Day:',
                valid: false,
                touched: false,
                validationRules: {
                    isRequired: true
                }
            },
        }
        this.state = {

            errorStatus: 0,
            error: null,
            formIsValid: false,


        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate() {
        const client = JSON.parse(localStorage.getItem('client'));
        if(client!=null){
            this.formControls.name.placeholder = client.name;
            this.formControls.username.placeholder = client.username;
            this.formControls.address.placeholder = client.address;
            this.formControls.birthDay.placeholder = client.birthDay.substr(0,10);
        }
    }

    toggleForm(){
        this.setState({collapseForm: !this.state.collapseForm});
    }

    handleChange = event => {
        console.log(this.formControls);
        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = this.formControls;

        const updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }
        this.formControls = updatedControls;
        this.setState({
            formIsValid: formIsValid
        });

    };

    updateUser(id, user){
        return API_USERS.updateUser(id, user, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully updated user with id: " + result);
                this.reloadHandler();
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    handleSubmit() {
        //TODO in cazul in care e field-ul gol atunci punem valoarea veche
        const client = JSON.parse(localStorage.getItem('client'));
        console.log(client);
        let clientUsername='';
        let clientName='';
        let clientAddress='';
        let clientBirthDay='';
        if(this.formControls.username.value===''){
            clientUsername = client.username;
        }else{
            clientUsername = this.formControls.username.value;
        }
        if(this.formControls.name.value===''){
            clientName = client.name;
        }else{
            clientName = this.formControls.name.value;
        }
        if(this.formControls.address.value===''){
            clientAddress = client.address;
        }else{
            clientAddress = this.formControls.address.value;
        }
        if(this.formControls.birthDay.value===''){
            clientBirthDay = client.birthDay;
        }else{
            clientBirthDay = this.formControls.birthDay.value;
        }
        let user = {
            username: clientUsername,
            name: clientName,
            password: client.password,
            address: clientAddress,
            birthDay: clientBirthDay,
            role: "guest"
        };
        this.updateUser(client.id,user);
    }

    render() {
        return (
            <div>
                <FormGroup id='username'>
                    <Label for='usernameField'> Username: </Label>
                    <Input name='username' id='usernameField' placeholder={this.formControls.username.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.formControls.username.value}
                           touched={this.formControls.username.touched? 1 : 0}
                           valid={this.formControls.username.valid}
                           required
                    />
                    {this.formControls.username.touched && !this.formControls.username.valid &&
                    <div className={"error-message row"}> * Username Required </div>}
                </FormGroup>

                <FormGroup id='name'>
                    <Label for='nameField'> Name: </Label>
                    <Input name='name' id='nameField' placeholder={this.formControls.name.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.formControls.name.value}
                           touched={this.formControls.name.touched? 1 : 0}
                           valid={this.formControls.name.valid}
                           required
                    />
                    {this.formControls.name.touched && !this.formControls.name.valid &&
                    <div className={"error-message row"}> * Name Required </div>}
                </FormGroup>

                <FormGroup id='address'>
                    <Label for='addressField'> Address: </Label>
                    <Input name='address' id='addressField' placeholder={this.formControls.address.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.formControls.address.value}
                           touched={this.formControls.address.touched? 1 : 0}
                           valid={this.formControls.address.valid}
                           required
                    />
                    {this.formControls.address.touched && !this.formControls.address.valid &&
                    <div className={"error-message row"}> * Address Required </div>}
                </FormGroup>

                <FormGroup id='birthDay'>
                    <Label for='birthDayField'> Birth Day: </Label>
                    <Input type="date" name='birthDay' id='birthDayField' placeholder={this.formControls.birthDay.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.formControls.birthDay.value}
                           touched={this.formControls.birthDay.touched? 1 : 0}
                           valid={this.formControls.birthDay.valid}
                           required
                    />
                    {this.formControls.birthDay.touched && !this.formControls.birthDay.valid &&
                    <div className={"error-message row"}> * Birth Day Required </div>}
                </FormGroup>

                <Row>
                    <Col sm={{size: '4', offset: 8}}>
                        <Button type={"submit"} onClick={this.handleSubmit}>  Submit </Button>
                    </Col>
                </Row>
                {
                    this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error}/>
                }
            </div>
        ) ;
    }
}

export default UpdateSensorForm;