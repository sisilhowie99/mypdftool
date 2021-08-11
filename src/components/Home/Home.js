import React from 'react';
import Upload from '../Upload/Upload';

class Home extends React.Component {
    render() {
        return (
            <div className='home-container'>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/">MyPDFtool</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/">Home</a>
                                </li>
                                <li className="nav-item">
                                <a className="nav-link" href="/">View</a>
                                </li>
                                <li className="nav-item">
                                <a className="nav-link" href="/">Create</a>
                                </li>
                                <li className="nav-item">
                                <a className="nav-link" href="/">Modify</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className='intro'>
                    <p>Create fillable PDF form files or modify existing ones, and save them as a new one or overwrite the old one.</p>
                </div>
                <Upload />
            </div>
        )
    }
}

export default Home;