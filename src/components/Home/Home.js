import React from "react";

import './Home.css';
import logo from '../../resources/logo.png';

class Home extends React.Component {
    render() {
        return (
            <div className="container home-container">
                <div className="intro">
                    <img src={logo} alt='MyPDFtool logo' className='logo' />
                    <h1>
                        Create or modify fillable PDF files.<br />
                        Overwrite the old one or create a new file.
                    </h1>
                </div>

                <div className="d-grid gap-2 button-container">
                    <a href="/upload" className="btn btn-primary" type="button">
                        Upload
                    </a>
                    <a href="/create" className="btn btn-primary" type="button">
                        Create
                    </a>
                </div>
            </div>
        );
    }
}

export default Home;
