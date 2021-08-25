import React from 'react';
import axios from 'axios';

class Modify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: null
        }
    }

    componentDidMount() {
        axios.get('http://localhost:8000/modify').then(res => {
            console.log(`in modify page - response: ${res.data}`);
            // this.setState({
            //     content: res
            // })
        })
    }
    render() {
        return (
            <div className='container modify-container'>
                <h1>You're in modify!</h1>
            </div>
        )
    }
}

export default Modify;