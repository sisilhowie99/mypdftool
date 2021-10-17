import React from 'react';
import './Create.css';

import axios from 'axios';

class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            field: {},
            fields: [],
            option: '',
            options: [],
            numOfOptions: 0,
            createFromScratch: false,
            createFromUpload: false,
            uploadedFile: null,
            uploadSuccess: false,
            filename: '',
            author: ''
        };
        this.timer = null;
        this.handleUploadChange = this.handleUploadChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleCreateFromScratch = this.handleCreateFromScratch.bind(this);
        this.handleCreateFromUpload = this.handleCreateFromUpload.bind(this);
        this.handleFilenameChange = this.handleFilenameChange.bind(this);
        this.handleAuthorChange = this.handleAuthorChange.bind(this);
        this.handleSelectInput = this.handleSelectInput.bind(this);
        this.handleInputName = this.handleInputName.bind(this);
        this.handleCoordX = this.handleCoordX.bind(this);
        this.handleCoordY = this.handleCoordY.bind(this);
        this.handleOptionValue = this.handleOptionValue.bind(this);
        this.handleAddToOptionsList = this.handleAddToOptionsList.bind(this);
        this.handleAddNewOption = this.handleAddNewOption.bind(this);
        this.handleAddField = this.handleAddField.bind(this);
        this.createPDF = this.createPDF.bind(this);
    }

    handleUploadChange(e) {
        const uploadedFile = e.target.files[0];
        console.log(uploadedFile);

        // Save the uploaded file to component's state
        this.setState({
            uploadedFile: uploadedFile
        })
    }

    handleUpload() {
        // Create FormData object
        const data = new FormData();

        // Add key/value pair to the object
        data.append("created_uploaded_file", this.state.uploadedFile);

        // Make POST request using Axios, sending the data object to the url
        // The request returns a promise
        axios.post("http://localhost:8000/create-upload", data).then((res) => {
            // If successful, print the status text of the response
            console.log(`The request is successful. Status code: ${res.status} - ${res.statusText}`);
        });
    }

    handleCreateFromScratch() {
        this.setState({
            createFromScratch: !this.state.createFromScratch
        });
    }

    handleCreateFromUpload() {
        this.setState({
            createFromUpload: !this.state.createFromUpload
        });
    }

    handleFilenameChange(e) {
        const filename = e.target.value;
        this.setState({ filename });
    }

    handleAuthorChange(e) {
        const author = e.target.value;
        this.setState({ author });
    }

    handleSelectInput(e) {
        // console.log(e.target.value);
        const type = e.target.value;

        // clears the options every time user changes input type selected
        this.setState({
            option: '',
            options: [],
            numOfOptions: 0,
            field: {
                type
            }
        })
    }

    handleInputName(e) {
        const name = e.target.value;

        this.setState({
            field: {
                // Because a single state is used repeatedly, we're spreading (using the ... syntax) the old state's value and merging it into the new state
                ...this.state.field,
                name
            }
        })
    }

    handleCoordX(e) {
        const x = e.target.value;

        this.setState({
            field: {
                ...this.state.field,
                x
            }
        })
    }

    handleCoordY(e) {
        const y = e.target.value;

        this.setState({
            field: {
                ...this.state.field,
                y
            }
        })
    }

    handleOptionValue(e) {
        this.setState({ option: e.target.value });
    }

    handleAddToOptionsList() {
        let options = this.state.options.slice();
        // add the current options list's length
        options.length++;

        // target the last index (that was the newly added space) and add the new option to that index
        options[options.length-1] = this.state.option;
        console.log(options);

        this.setState({
            options,
            field: {
                ...this.state.field,
                options
            }
        });
    }

    handleAddNewOption(e) {
        // If no options listed, add 1 so an empty string doesn't gets added
        // otherwise, add the new option to the list of options and add number of options
        if(this.state.numOfOptions > 0) {
            this.handleAddToOptionsList();
            this.setState({ numOfOptions : this.state.numOfOptions + 1 });
        } else {
            this.setState({ numOfOptions : this.state.numOfOptions + 1 });
        };
    }

    handleAddField() {
        // copy original state fields
        let currentFields = this.state.fields.slice();
        // add to it the new field
        currentFields.push(this.state.field);

        // set the state to include the newly added input field
        this.setState({ fields: currentFields })
    }

    createPDF() {
        // grab the filename, author, input fields to create (including their names and locations on page)
        const filename = this.state.filename;
        const author = this.state.author;
        const fields = this.state.fields;

        // call to server, pass the input fields
        axios.post('http://localhost:8000/create', {filename, author, fields}).then(res => {
            console.log('server response is:');
            console.log(res.data);
        })
    }

    render() {
        return (
            <div className='container create-container'>
                <h1>Create a new PDF form</h1>

                <div className='filename'>
                    <label htmlFor='filename'>Filename:</label>
                    <input type='text' name='pdfFilename' id='filename' onChange={this.handleFilenameChange} />
                </div>

                <div className='author'>
                    <label htmlFor='author'>Author:</label>
                    <input type='text' name='pdfAuthor' id='author' onChange={this.handleAuthorChange} />
                </div>

                {/* Options how to create new fillable PDF */}
                <div className=' d-grid gap-2 create-options'>
                    {this.state.createFromUpload ? '' : <button className="btn btn-primary col-6 mx-auto" type="button" onClick={this.handleCreateFromScratch}>Create from scratch</button>}

                    {/* {this.state.createFromScratch ? '' : <button className="btn btn-primary col-6 mx-auto" type="button" onClick={this.handleCreateFromUpload}>Upload an existing PDF file</button>} */}
                </div>

                {/* If user wants to create from upload, display the file upload form */}
                {/* {
                    this.state.createFromUpload &&
                    <form method="POST" encType="multipart/form-data">
                        <div className="mb-3">
                            <input
                                className="form-control"
                                type="file"
                                id="formFile"
                                name="created_uploaded_file"
                                accept=".pdf"
                                onChange={this.handleUploadChange}
                            />
                            <div
                                className="d-grid gap-2 upload"
                                style={{ margin: "20px auto" }}
                            >
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={this.handleUpload}
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </form>
                } */}

                {/* If user wants to create from scratch */}
                {
                    this.state.createFromScratch &&
                    <div>
                        <label htmlFor='inputType'>Input field:</label>
                        <select name='inputType' id='inputType' onChange={this.handleSelectInput} defaultValue=''>
                            <option value=''>Select an input type</option>
                            <option value='dropdown'>Dropdown</option>
                            <option value='textfield'>Textfield</option>
                            <option value='checkbox'>Checkbox</option>
                            <option value='radio'>Radio button</option>
                        </select>

                        <br />

                        <label htmlFor='fieldName'>Field name:</label>
                        <input type='text' name='fieldName' id='fieldName' onChange={this.handleInputName} />

                        <br />

                        <em><p>Please note coordinates matrix begin from (0,0) which bottom left corner</p></em>

                        <label htmlFor='coordX'>Coordinate X (position):</label>
                        <input type='number' name='coordX' id='coordX' onChange={this.handleCoordX} />

                        <br />

                        <label htmlFor='coordY'>Coordinate Y (position):</label>
                        <input type='number' name='coordY' id='coordY' onChange={this.handleCoordY} />

                        <br />

                        {/* If the selected input is dropdown/checkbox/radio, prompt user to insert options for it */}
                        {Array.from(Array(this.state.numOfOptions)).map(opt => {
                            return (
                                <div className='options'>
                                    <label htmlFor='optionValue'>Option value:</label>
                                    <input type='text' name='optionValue' id='optionValue' onChange={this.handleOptionValue} />
                                </div>
                            )
                        })}

                        {/* Button to add more options */}
                        {
                            (this.state.field.type === 'dropdown' || this.state.field.type === 'checkbox' || this.state.field.type === 'radio') &&
                            <button className="btn btn-primary" type="button" onClick={this.handleAddNewOption}>Add {this.state.numOfOptions > 0 ? 'another' : 'an'} option</button>
                        }


                        <button className="btn btn-primary" type="button" onClick={this.handleAddField}>Insert field to form</button>
                    </div>
                }

                <button className="btn btn-success col-6 mx-auto" type="button" onClick={this.createPDF}>Create PDF</button>
            </div>
        )
    }
}

export default Create;