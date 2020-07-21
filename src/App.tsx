import React from 'react';
import './App.css';
import GetArtists from './GetArtists';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Last.fm Artist Search</h1>
      </header>
        <GetArtists/>
    </div>
  );
}

export default App;
