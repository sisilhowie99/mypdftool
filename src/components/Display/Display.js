import React from 'react';
import axios from 'axios';

class Display extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdowns: [],
            checkboxes: [],
            radios: [],
            textfields: [],
            isModified: false,
            isSavedToNewFile: false,
            newData: null
        }
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
        axios.get('http://localhost:8000/display').then(res => {
            // console.log(res.data);
            const { dropdowns, checkboxes, textfields, radios } = res.data;
            this.setState({
                dropdowns,
                checkboxes,
                textfields,
                radios
            });
        }).catch(err => {
            console.error(err);
        });
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

    handleModifyDoc() {
        // console.log(this.state.dropdowns);
        // console.log(this.state.textfields);
        // console.log(this.state.checkboxes);
        // console.log(this.state.radios);
        axios.post('http://localhost:8000/modify', {
            dropdowns: this.state.dropdowns,
            textfields: this.state.textfields,
            checkboxes: this.state.checkboxes,
            radios: this.state.radios
        }).then(res => {
            console.log(res);
            console.log(res.data);

            this.setState({
                isModified: true
            })
        }).catch(err => console.error(err));
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
            </div>
        )
    }
}


export default Display;