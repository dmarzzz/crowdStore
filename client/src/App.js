import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          crowdStore prototype frontend 
        </p>

        <label >
          Upload File: 
      </label>

        <input
        accept="image/*"
        multiple
        type="file"
      />


      </header>
    </div>
  );
}

export default App;
