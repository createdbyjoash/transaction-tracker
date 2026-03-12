import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { CreateTransaction } from './pages/Create';
import { Track } from './pages/Track';
import { Toaster } from 'react-hot-toast';

function App() {
  console.log('APP COMPONENT: Initializing...');
  return (
    <Router>
      <div id="app-test-container" className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-700">
        <h1 style={{ position: 'fixed', top: 0, left: 0, background: 'red', color: 'white', zIndex: 9999 }}>REACT LOADED SUCCESS</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateTransaction />} />
          <Route path="/track/:id" element={<Track />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
    </Router>
  );
}

export default App;

