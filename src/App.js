import React from 'react';
import './App.css';

function App() {
  return (
    <>

      <div className='nav-bar'>
        <div className='nav-container'>
          <div className='logo'>TasKit</div>
          <div className='navigation'>
            <a href="/">Home</a>
            <a href="/task">Task</a>
          </div>
        </div>
      </div>
      <div className='container'>
        <div className='content'>
          <h2>Welcome</h2>
        </div>
      </div>
    </>
  );
}

export default App;
