import React from 'react';
import './App.css';
import Home from './pages/Home.js';
import Projects from './pages/Projects.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>

      <div className='nav-bar'>
        <div className='nav-container'>
          <div className='logo'>TasKit</div>
          <div className='navigation'>
            <a href="/">Home</a>
            <a href="/projects">Projects</a>
          </div>
        </div>
      </div>
      <div className='container'>
        <div className='content'>
          <BrowserRouter>
            <Routes>
              <Route path="/">
                <Route index element={<Home />} />
                <Route path="projects" element={<Projects />} />
                <Route path="*" element={<Home />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </>
  );
}

export default App;
