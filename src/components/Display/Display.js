import React from 'react';
// Import PDF-LIB library
import { PDFDocument } from 'pdf-lib';
import axios from 'axios';
import SinglePage from './SinglePage';

class Display extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            fields: null,
            dropdowns: [],
            checkboxes: [],
            radios: [],
            textfields: [],
            optionLists: [],
            isModified: false,
            isSavedToNewFile: false,
            newData: null
        }
        this.readFile = this.readFile.bind(this);
        this.extract = this.extract.bind(this);
        this.displayOptions = this.displayOptions.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleModifyDoc = this.handleModifyDoc.bind(this);
        this.handleSaveNewFile = this.handleSaveNewFile.bind(this);
        this.updateTextField = this.updateTextField.bind(this);
        this.updateCheckbox = this.updateCheckbox.bind(this);
        this.updateDropdown = this.updateDropdown.bind(this);
        this.updateRadio = this.updateRadio.bind(this);
    }

    componentDidMount() {
        this.readFile();
    }

    readFile() {
        // console.log(this.props.file.location.state);
        const reader = new FileReader();
        reader.readAsArrayBuffer(this.props.file.location.state);

        reader.onload = async e => {
            // console.log(reader.result);
            const pdf = await PDFDocument.load(reader.result, { ignoreEncryption: true });
            const fileTitle = pdf.getTitle();

            this.setState({
                file: pdf,
                fileTitle
            })

            this.extract();
        };
    }

    extract() {
        // Grab the file
        const file = this.state.file;
        // Grab the form in the file
        const form = file.getForm();
        // Access all fields in the form - returned as an array
        const formFields = form.getFields();

        // An object that will contain field objects (field type and name)
        let fields = {};

        // Loop through the array of fields, store each in the object as fieldName: fieldType
        formFields.forEach(field => {
            const fieldType = field.constructor.name;
            const fieldName = field.getName();
            // console.log(`${fieldName}: ${fieldType}`);

            // Store the fieldName and fieldType pair in the fields object
            fields[fieldName] = fieldType;
        });

        // Store the object in the component's state
        this.setState({ fields });
        // console.log(this.state.fields);
        this.displayOptions();
    }

    displayOptions() {
        const file = this.state.file;
        const form = file.getForm();
        const fields = this.state.fields;

        // Array of field types
        let dropdowns = [];
        let checkboxes = [];
        let radios = [];
        let textfields = [];
        let numfields = [];
        let optionLists = [];

        for (const key in fields) {
            switch (fields[key]) {
                case 'PDFDropdown':
                    /*
                        1. Get dropdown element with the given key/name
                        2. Set the name and get the option values, then store as an object to append to the dropdowns array
                            - dropdownName will be used in name attribute for the HTML tag
                            - dropdownOptions will be used in value attribute for the HTML tag
                    */
                    const dropdown = form.getDropdown(key);
                    const dropdownName = key;
                    const selectedDropdown = dropdown.getSelected()[0];
                    const dropdownOptions = dropdown.getOptions();
                    dropdowns.push({
                        name: dropdownName,
                        options: dropdownOptions,
                        selectedDropdown
                    });
                    break;
                case 'PDFCheckBox':
                    const checkbox = form.getCheckBox(key);
                    const checkboxName = key;
                    const checkboxValue = checkbox.isChecked();
                    checkboxes.push({
                        name: checkboxName,
                        value: checkboxValue
                    });
                    break;
                case 'PDFRadioGroup':
                    const radio = form.getRadioGroup(key);
                    // Prevent deselecting radio button if it's already selected
                    radio.disableOffToggling();
                    // Get the radio button that's selected
                    const selectedRadio = radio.getSelected();
                    const radioName = key;
                    const radioOptions = radio.getOptions();
                    radios.push({
                        name: radioName,
                        options: radioOptions,
                        selectedRadio
                    });
                    break;
                case 'PDFTextField':
                    const textfield = form.getTextField(key);
                    const textfieldName = key;
                    const textfieldValue = textfield.getText();
                    textfields.push({
                        name: textfieldName,
                        value: textfieldValue
                    })
                    break;
                case 'PDFOptionList':
                    const optionList = form.getOptionList(key);
                    const optionListName = key;
                    const optionListOptions = optionList.getOptions();
                    optionLists.push({
                        name: optionListName,
                        options: optionListOptions
                    });
                    break;
                default:
                    // const field = form.getTextField(key);
                    // const fieldName = key;
                    // const fieldValue = field.getText();
                    // textfields.push({
                    //     name: fieldName,
                    //     value: fieldValue
                    // })
                    break;
            }
        }

        this.setState({
            dropdowns,
            checkboxes,
            radios,
            textfields,
            numfields,
            optionLists
        })
    }

    handleTextInputChange(e) {
        // Create a copy of the textfields state array
        let textfields = this.state.textfields.slice();
        // Find selected textfield based on its name, in the textfields state array
        let textfield = textfields.find(textfield => textfield.name === e.target.name);
        // Find the matched textfield's index
        const index = textfields.findIndex(element => element.name === textfield.name);

        // Update the textfield's value with the new one
        textfield.value = e.target.value;
        // Update the textfield entry in the array via the index with the updated value entry
        textfields[index] = textfield;
        // Update the state array to the array with the updated textfield value
        this.updateTextField(textfields);
    }

    updateTextField(newTextFields) {
        this.setState({
            textfields: newTextFields
        })
    }

    handleCheckboxChange(e) {
        // Access the checkboxes state array
        let checkboxes = this.state.checkboxes.slice();
        // Find selected checkbox based on its name, in the checkboxes state array
        let checkbox = checkboxes.find(checkbox => checkbox.name === e.target.name);
        // Find the matched checkbox's index
        const index = checkboxes.findIndex(element => element.name === checkbox.name);

        // Change its value and save to a new variable
        checkbox.value = !checkbox.value;
        // Update the checkbox entry in the array via the index with the updated value entry
        checkboxes[index] = checkbox;

        // Update the state array to the array with the updated checkbox value
        this.updateCheckbox(checkboxes);
    }

    updateCheckbox(newCheckboxes) {
        this.setState({
            checkboxes: newCheckboxes
        })
    }

    handleDropdownChange(e) {
        let dropdowns = this.state.dropdowns.slice();
        let dropdown = dropdowns.find(dropdown => dropdown.name === e.target.name);
        const index = dropdowns.findIndex(element => element.name === dropdown.name);

        dropdown.selectedDropdown = e.target.value;
        dropdowns[index] = dropdown;
        const updatedDropdowns = dropdowns;

        this.updateDropdown(updatedDropdowns);
    }

    updateDropdown(newDropdowns) {
        this.setState({
            dropdowns: newDropdowns
        })
    }

    handleRadioChange(e) {
        let radios = this.state.radios;
        let radio = radios.find(radio => radio.name === e.target.name);
        const index = radios.findIndex(element => element.name === radio.name);

        radio.selectedRadio = e.target.value;
        radios[index] = radio;
        const updatedRadios = radios;

        this.updateRadio(updatedRadios);
    }

    updateRadio(newRadios) {
        this.setState({
            radios: newRadios
        })
    }

    async handleModifyDoc() {
        // current file with its current state
        const file = this.state.file;
        const form = file.getForm();

        // Update dropdowns in the file
        this.state.dropdowns.slice().forEach(item => {
            const dropdown = form.getDropdown(item.name);
            dropdown.select(item.selectedDropdown);
        })

        // Update checboxes
        this.state.checkboxes.slice().forEach(item => {
            const checkbox = form.getCheckBox(item.name);
            if(item.value) {
                checkbox.check();
            } else {
                checkbox.uncheck();
            }
        })

        // Update radio buttons
        this.state.radios.slice().forEach(item => {
            const radio = form.getRadioGroup(item.name);
            radio.select(item.selectedRadio);
        })

        // Update textfields
        this.state.textfields.slice().forEach(item => {
            const textfield = form.getTextField(item.name);
            textfield.setText(item.value);
        })

        // save file - returned as fulfilled promise Uint8Array
        const updatedFile = await file.save();
        // console.log(updatedFile); // Uint8Array

        // const response = await axios.post('http://localhost:8000/modify', updatedFile);
        // console.log(response.data);

        this.setState({
            isModified: true,
            newData: updatedFile
        })
    }

    handleSaveNewFile() {
        console.log('Created a new document!');
    }

    handleCancel() {
        let isCancel = window.confirm('Are you sure you want to cancel modifying this document?');
        if (isCancel) {
            alert('Document modification cancelled. Returning to homepage.');
        } else {
            console.log('Still modifying document');
        }
    }

    render() {
        return (
            <div className='container display-container'>
                {this.state.fileTitle ? <h1>{this.state.fileTitle}</h1> : <h1>Your uploaded file</h1>}
                <hr />

                {/* Display text fields */}
                {this.state.textfields.map((textfield, i) => {
                    return (
                        <div className='textfields'>
                            <label htmlFor={textfield.name} className='left'>{textfield.name}:</label>
                            <input type='text' name={textfield.name} defaultValue={textfield.value} id={textfield.name} className='right' key={i.toString()} onChange={this.handleTextInputChange} />
                        </div>
                    )
                })}

                {/* Display checkboxes */}
                {this.state.checkboxes.map((checkbox, i) => {
                    return (
                        <div className='checkboxes'>
                            <label htmlFor={checkbox.name} className='left'>{checkbox.name}</label>
                            <input type="checkbox" name={checkbox.name} value={checkbox.value} defaultChecked={checkbox.value} id={checkbox.name} className='right' key={i.toString()} onChange={this.handleCheckboxChange} />
                        </div>
                    )
                })}

                {/* Display radio buttons */}
                {this.state.radios.map(radio => {
                    return (
                        <div className='radios'>
                            <span className='left'>{radio.name}:</span>
                            {radio.options.map((option, i) => {
                                return (
                                    <div>
                                        <label htmlFor={option[i]}>{option}</label>
                                        <input type="radio" name={radio.name} value={option} id={option[i]} className='right' key={i.toString()} defaultChecked={option === radio.selectedRadio} onChange={this.handleRadioChange} />
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}

                {/* Display dropdowns */}
                {this.state.dropdowns.map(dropdown => {
                    return (
                        <div className='dropdowns'>
                            <label htmlFor={dropdown.name}>{dropdown.name}:</label>
                            <select name={dropdown.name} defaultValue={dropdown.selectedDropdown} onChange={this.handleDropdownChange}>
                                {dropdown.options.map((option, i) => {
                                    return <option value={option} key={i}>{option}</option>
                                })}
                            </select>
                        </div>
                    )
                })}

                {/* Buttons */}
                <div className="d-grid gap-2 col-6 mx-auto button-container">
                    <button className="btn btn-primary" type="button" onClick={this.handleModifyDoc}>Modify</button>
                    {this.state.isModified ? <p>Document successfully modified</p> : ""}

                    <button href="/create" className="btn btn-success" type="button" onClick={this.handleSaveNewFile}>Save to a new file</button>

                    <button className="btn btn-secondary" type="button" onClick={this.handleCancel}>Cancel</button>
                </div>

                {this.state.isModified ? <SinglePage file={{data: this.state.newData}} /> : '' }
            </div>
        )
    }
}


export default Display;