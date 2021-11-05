import React from "react";
import validate from "./validators/device-validator";
import {Button} from "react-bootstrap";
import * as API_DEVICES from "../api/device-api";
import * as API_SENSORS from "../../sensor/api/sensor-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import {FormGroup, Input, Label} from 'reactstrap';

class DeviceForm extends React.Component{
    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;
        this.formControls= {
            address: {
                value: '',
                placeholder: 'Address:',
                valid: false,
                touched: false,
                validationRules: {
                    isRequired: true
                }
            },
            description: {
                value: '',
                placeholder: 'Description:',
                valid: false,
                touched: false,
                validationRules: {
                    isRequired: true
                }
            },
            averageEnergyConsumption: {
                value: '',
                placeholder: 'Average Energy Consumption:',
                valid: false,
                touched: false,
                validationRules: {
                    isRequired: true,
                    numberValidator: true
                }
            },
            maximumEnergyConsumption: {
                value: '',
                placeholder: 'Maximum Energy Consumption:',
                valid: false,
                touched: false,
                validationRules: {
                    isRequired: true,
                    numberValidator: true
                }
            },
        }
        this.state = {
            sensors: [],
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
        this.fetchSensors();
    }
    reload() {
        this.fetchSensors();
    }
    fetchSensors() {
        return API_SENSORS.getSensors((result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    sensors: result,
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

    registerDevice(device){
        return API_DEVICES.postDevice(device, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted device with id: " + result);
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
        let e = document.getElementById("sensorSelect");
        let sensorIndex = e.options[e.selectedIndex].value;
        API_SENSORS.getSensor(sensorIndex,(result, status, err) => {
            if (result !== null && status === 200) {
                let device = {
                    address: this.formControls.address.value,
                    description: this.formControls.description.value,
                    maximumEnergyConsumption: this.formControls.maximumEnergyConsumption.value,
                    averageEnergyConsumption: this.formControls.averageEnergyConsumption.value,
                    sensor: result
                };
                this.registerDevice(device);
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });

    }
    render() {
        return (
            <div>
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
                    <div className={"error-message"}> * Description Required</div>}
                </FormGroup>

                <FormGroup id='maximumEnergyConsumption'>
                    <Label for='maximumEnergyConsumptionField'> Maximum Energy Consumption: </Label>
                    <Input name='maximumEnergyConsumption' id='maximumEnergyConsumptionField' placeholder={this.formControls.maximumEnergyConsumption.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.formControls.maximumEnergyConsumption.value}
                           touched={this.formControls.maximumEnergyConsumption.touched? 1 : 0}
                           valid={this.formControls.maximumEnergyConsumption.valid}
                           required
                    />
                    {this.formControls.maximumEnergyConsumption.touched && !this.formControls.maximumEnergyConsumption.valid &&
                    <div className={"error-message row"}> * Name Required </div>}
                </FormGroup>

                <FormGroup id='averageEnergyConsumption'>
                    <Label for='averageEnergyConsumptionField'> Average Energy Consumption: </Label>
                    <Input name='averageEnergyConsumption' id='averageEnergyConsumptionField' placeholder={this.formControls.averageEnergyConsumption.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.formControls.averageEnergyConsumption.value}
                           touched={this.formControls.averageEnergyConsumption.touched? 1 : 0}
                           valid={this.formControls.averageEnergyConsumption.valid}
                           required
                    />
                    {this.formControls.averageEnergyConsumption.touched && !this.formControls.averageEnergyConsumption.valid &&
                    <div className={"error-message row"}> * Average Energy Consumption Required </div>}
                </FormGroup>

                <FormGroup>
                    <Label for='sensorSelect'> Sensor: </Label>
                    <select id='sensorSelect' className="form-select" aria-label="Default select example">
                        {this.state.sensors.map((value, index) =>
                            <option value={this.state.sensors[index].id}>{this.state.sensors[index].description}</option>
                        )}
                    </select>
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

export default DeviceForm;