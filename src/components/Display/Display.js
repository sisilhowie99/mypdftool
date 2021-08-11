import React from 'react';

import SinglePage from './SinglePage';

class Display extends React.Component {
    render() {
        return (
            <div className='container display-container'>
                <SinglePage file={this.props.uploadedFile} />
            </div>
        )
    }
}


export default Display;