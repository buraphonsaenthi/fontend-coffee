import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Register from './components/pages/Register'
import Login from './components/pages/Login'
import Promotion from './components/pages/Promotion'
import ForgotPassword from './components/pages/ForgotPassword'
import Enter from './components/pages/entrepreneur'

import AuthCheck from './components/AuthCheck'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Promotion />} />
      <Route path='/Register' element={<Register />} />
      <Route path='/Login' element={<Login />} />
      <Route path='/Promotion' element={<Promotion />} />
      <Route path='/ForgotPassword' element={<ForgotPassword />} />
      
      <Route path='/Enter' element={<Enter />} />


    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
