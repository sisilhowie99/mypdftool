import { NavLink, Switch, Route } from "react-router-dom";

import "./App.css";

import Home from "../Home/Home";
import Upload from "../Upload/Upload";
import Modify from "../Modify/Modify";
import Create from "../Create/Create";
import logo from '../../resources/logo.png';
import Display from "../Display/Display";

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            <img src={logo} alt='MyPDFtool logo' id='logo' />
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/upload">
                  Upload
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/create">
                  Create
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/modify">
                  Modify
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Switch>
        <Route path="/upload">
          <Upload />
        </Route>

        <Route path="/modify">
          <Modify />
        </Route>

        <Route path="/create">
          <Create />
        </Route>

        <Route path="/display">
          <Display />
        </Route>

        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
