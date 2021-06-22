import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import { Login } from "./components/Login";
import { Profile } from "./components/Profile";

// ???????????????????
const LS_KEY = "login-with-metamask:auth";

// interface State {
// 	auth?: Auth;
// }

export const App = () => {
  const [state, setState] = useState({});

  // useEffect(() => {
  //   // Access token is stored in localstorage
  //   const ls = window.localStorage.getItem(LS_KEY);
  //   const auth = ls && JSON.parse(ls);
  //   setState({ auth });
  // }, []);

  const handleLoggedIn = (auth) => {
    console.log(auth);
    localStorage.setItem(LS_KEY, JSON.stringify(auth));
    setState({ auth });
  };

  const handleLoggedOut = () => {
    localStorage.removeItem(LS_KEY);
    setState({ auth: undefined });
  };

  const { auth } = state;

  return (
    <>
      {/* <div className="App-intro">
        {auth ? (
          <Profile auth={auth} onLoggedOut={handleLoggedOut} />
        ) : (
          <Login onLoggedIn={handleLoggedIn} />
        )}
      </div> */}
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Login with MetaMask Demo</h1>
        </header>
        <div className="App-intro">
          {auth ? (
            <Profile auth={auth} onLoggedOut={handleLoggedOut} />
          ) : (
            <Login onLoggedIn={handleLoggedIn} />
          )}
        </div>
      </div>
    </>
  );
};

export default App;
