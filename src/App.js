import React from 'react';
import {Routes,Route} from "react-router-dom"

// Style Sheets
import './App.css';

// Components
import Home from './pages/Home';
import Watch from './pages/Watch';
import NoPage from './pages/NoPage';
import Header from './components/Header';

export default function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route index element={<Home/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/watch/:id" element={<Watch/>}/>
        <Route path="*" element={<NoPage/>}/>
      </Routes>
    </div>
  );
}

