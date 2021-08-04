import React from 'react';
import axios from 'axios';

class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadedFile: null
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(e) {
        console.log(e.target.files[0]);

        // Save the uploaded file to component's state
        this.setState({
            uploadedFile: e.target.files[0]
        })
    }

    handleClick() {
        // Create FormData object
        const data = new FormData();

        // Add key/value pair to the object
        data.append('uploaded_file', this.state.uploadedFile);

        // Make POST request using Axios, sending the data object to the url
        // The request returns a promise
        axios.post('http://localhost:8000/upload', data).then(res => {
            // If successful, print the status text of the response
            console.log(`The request is successful. Status code: ${res.status} - ${res.statusText}`);
        })
    }


    render() {
        return (
            <div className='container upload-container'>
                <form
                    method="POST"
                    encType="multipart/form-data"
                >
                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">Upload PDF file</label>
                        <input
                            className="form-control"
                            type="file"
                            id="formFile"
                            name="uploaded_file"
                            accept=".pdf"
                            onChange={this.handleChange}
                        />
                        <div className="d-grid gap-2">
                            <button className="btn btn-primary" type="button" onClick={this.handleClick}>Upload</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default Upload;