import React from 'react';
// Import PDF-LIB library
import { PDFDocument } from 'pdf-lib';

class Display extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            dropdowns: [],
            checkboxes: [],
            radios: [],
            textfields: [],
            optionLists: []
        }
        this.readFile = this.readFile.bind(this);
        this.extract = this.extract.bind(this);
        this.displayOptions = this.displayOptions.bind(this);
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
                    const dropdownOptions = dropdown.getOptions();
                    dropdowns.push({
                        name: dropdownName,
                        options: dropdownOptions
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
        console.log(`${e.target.name}: ${e.target.value}`);
    }

    handleDropdownChange(e) {
        console.log(`${e.target.name}: ${e.target.value}`);
    }

    handleCheckboxChange(e) {
        // console.log(e.target.value);
        let oldValue;
        let newValue;
        if(e.target.value === 'false') {
            oldValue = false;
        } else if(e.target.value === 'true') {
            oldValue = true;
        }
        newValue = !oldValue;
        // console.log(newValue);
        console.log(`${e.target.name}: ${newValue}`);
    }

    handleRadioChange(e) {
        console.log(`${e.target.name}: ${e.target.value}`);
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
                            <select name={dropdown.name} defaultValue={dropdown.options[0]} onChange={this.handleDropdownChange}>
                                {dropdown.options.map((option, i) => {
                                    return <option value={option} key={i}>{option}</option>
                                })}
                            </select>
                        </div>
                    )
                })}

                {/* Buttons */}
                <div className="d-grid gap-2 col-6 mx-auto button-container">
                    <a href="/modify" className="btn btn-primary" type="button">Modify</a>
                    <a href="/create" className="btn btn-success" type="button">Save to a new file</a>
                    <a href="/" className="btn btn-secondary" type="button">Cancel</a>
                </div>
            </div>
        )
    }
}


export default Display;