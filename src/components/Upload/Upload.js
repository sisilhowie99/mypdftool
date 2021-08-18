import React from "react";
import axios from "axios";
import { Redirect } from 'react-router-dom';

class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadedFile: null,
            isUploadSuccess: false
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
        data.append("uploaded_file", this.state.uploadedFile);

        // Make POST request using Axios, sending the data object to the url
        // The request returns a promise
        axios.post("http://localhost:8000/upload", data).then((res) => {
            // If successful, print the status text of the response
            console.log(`The request is successful. Status code: ${res.status} - ${res.statusText}`);
        });

        // Call redirect function to update state, after the file's uploaded to server
        this.redirect();
    }

    redirect() {
        // Set state to indicate upload successful
        this.setState({
            isUploadSuccess: true
        })
    }

    render() {
        return (
            <div className="container upload-container">
                <h1>Upload fillable PDF file</h1>
                <form method="POST" encType="multipart/form-data">
                    <div className="mb-3">
                        <input
                            className="form-control"
                            type="file"
                            id="formFile"
                            name="uploaded_file"
                            accept=".pdf"
                            onChange={this.handleChange}
                        />
                        <div
                            className="d-grid gap-2 upload"
                            style={{ margin: "20px auto" }}
                        >
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={this.handleClick}
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </form>

                {/* Check if upload is successful then redirect user to Display, otherwise display empty string (nothing) */}
                {this.state.isUploadSuccess ? <Redirect to='/display' /> : ""}
            </div>
        );
    }
}

export default Upload;
