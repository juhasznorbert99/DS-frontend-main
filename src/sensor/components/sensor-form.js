import React from "react";
import validate from "./validators/sensor-validator";
import {Button} from "react-bootstrap";
import * as API_SENSORS from "../api/sensor-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';

class SensorForm extends React.Component{
    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;
        this.formControls= {
            description: {
                value: '',
                placeholder: 'Description:',
                valid: false,
                touched: false,
                validationRules: {
                    isRequired: true
                }
            },
            maximumValue: {
                value: '',
                placeholder: 'Maximum Value:',
                valid: false,
                touched: false,
                validationRules: {
                    isRequired: true,
                    numberValidator: true
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
    toggleForm(){
        this.setState({collapseForm: !this.state.collapseForm});
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

    insertSensor(sensor){
        return API_SENSORS.postSensor(sensor, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted sensor with id: " + result);
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
        let sensor = {
            description: this.formControls.description.value,
            maximumValue: this.formControls.maximumValue.value
        };

        console.log(sensor);
        this.insertSensor(sensor);
    }
    render() {
        return (
            <div>
                <FormGroup id='description'>
                    <Label for='descriptionField'> Description: </Label>
                    <Input name='description' id='descriptionField' placeholder={this.formControls.description.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.formControls.description.value}
                           touched={this.formControls.description.touched? 1 : 0}
                           valid={this.formControls.description.valid}
                           required
                    />
                    {this.formControls.description.touched && !this.formControls.description.valid &&
                    <div className={"error-message row"}> * Username Required </div>}
                </FormGroup>

                <FormGroup id='maximumValue'>
                    <Label for='maximumValueField'> Maximum Value: </Label>
                    <Input name='maximumValue' id='maximumValueField' placeholder={this.formControls.maximumValue.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.formControls.maximumValue.value}
                           touched={this.formControls.maximumValue.touched? 1 : 0}
                           valid={this.formControls.maximumValue.valid}
                           required
                    />
                    {this.formControls.maximumValue.touched && !this.formControls.maximumValue.valid &&
                    <div className={"error-message"}> * Password Required</div>}
                </FormGroup>

                <Row>
                    <Col sm={{size: '4', offset: 8}}>
                        <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleSubmit}>  Submit </Button>
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

export default SensorForm;