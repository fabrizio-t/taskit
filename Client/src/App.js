import React from 'react';
import './App.css';
import Home from './pages/Home.js';
import Projects from './pages/Projects.js';
import { CallbackPage } from "./pages/callback-page";
import { PageLoader } from "./pages/page-loader";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Navigation from './components/Navigation.js'

function App() {

  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className='container'>
          <PageLoader />
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className='container'>
        <div className='content'>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/projects" component={Projects} />
            <Route path="/callback" component={CallbackPage} />
            <Route path="*" component={Home} />
          </Switch>
        </div>
      </div>
    </>
  );
}

export default App;
