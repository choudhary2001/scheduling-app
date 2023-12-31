import React from 'react';
import './App.css';
import MyCalendar from './MyCalendar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:username/:event_link" element={<MyCalendar />} />
      </Routes>
    </Router>
  );
}

export default App;
