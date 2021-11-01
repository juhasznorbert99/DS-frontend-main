import React from "react";
import validate from "./validators/user-validator";
import {Button} from "react-bootstrap";
import * as API_USERS from "../api/user-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import * as API_DEVICES from "../../device/api/device-api";
import $ from 'jquery';

class AddDeviceForm extends React.Component{
    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;
        this.formControls= {
            username: {
                value: '',
                placeholder: 'Username:',
                valid: false,
                touched: false,
                validationRules: {
                    isRequired: true
                }
            },
            password: {
                value: '',
                placeholder: 'Password:',
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
            devices: [],
            errorStatus: 0,
            error: null,
            formIsValid: false,


        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    toggleForm(){
        this.setState({collapseForm: !this.state.collapseForm});
    }

    componentDidMount() {
        this.fetchDevices();
    }
    reload(){
        this.fetchDevices();
    }
    fetchDevices(){
        return API_DEVICES.getDevices((result, status, err) => {
            if (result !== null && status === 200) {
                //TODO add all devices to result where client == null
                let newResult = [];
                for(let i=0;i<result.length; i++){
                    if(result[i].client === null)
                        newResult.push(result[i]);
                }
                //console.log(result);
                this.setState({
                    devices: newResult,
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

    handleChange = event => {

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

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        });

    };


    handleSubmit() {
        let values = $('#select-item').val();
        console.log(values);
    }
    render() {
        return (
            <div>
                <FormGroup>
                    <select id={"select-item"} className="js-example-basic-multiple form-select" name="states[]" multiple="multiple">
                        {this.state.devices.map((value, index) =>
                            <option value={this.state.devices[index].id}>{this.state.devices[index].description}</option>
                        )}
                    </select>
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

export default AddDeviceForm;