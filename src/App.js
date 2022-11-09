import React from 'react';
import './App.css';
import Home from './pages/Home.js';
import Projects from './pages/Projects.js';
import { CallbackPage } from "./pages/callback-page";
import { PageLoader } from "./pages/page-loader";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function App() {

  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="page-layout">
        <PageLoader />
      </div>
    );
  }

  return (
    <>
      <div className='nav-bar'>
        <div className='nav-container'>
          <div className='logo'>TasKit</div>
          <div className='navigation'>
            <a href="/">Home</a>
            <a href="/projects">Projects</a>
            <a href="/profile">Profile</a>
          </div>
        </div>
      </div>
      <div className='container'>
        <div className='content'>
          <BrowserRouter>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/projects" component={Projects} />
              <Route path="/callback" component={CallbackPage} />
              <Route path="*" component={Home} />
            </Switch>
          </BrowserRouter>
        </div>
      </div>
    </>
  );
}

export default App;
