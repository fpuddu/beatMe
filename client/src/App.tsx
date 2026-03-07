import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { CreateChallenge } from './pages/CreateChallenge';
import { PlayChallenge } from './pages/PlayChallenge';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateChallenge />} />
          <Route path="/play/:id" element={<PlayChallenge />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
