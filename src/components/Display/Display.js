import React from 'react';
import SinglePage from './SinglePage';
// Import uploaded file
import file from "../../resources/uploaded_file.pdf";

class Display extends React.Component {
    render() {
        return (
            <div className='container display-container'>
                <SinglePage file={file} />
            </div>
        )
    }
}


export default Display;