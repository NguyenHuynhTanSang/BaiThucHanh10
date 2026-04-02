import './App.css';
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import MyProvider from './contexts/MyProvider';
import MyContext from './contexts/MyContext';
import Login from './components/LoginComponent';
import Main from './components/MainComponent';

class App extends Component {
  render() {
    return (
      <MyProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </MyProvider>
    );
  }
}

class AppContent extends Component {
  static contextType = MyContext;

  render() {
    const token = this.context?.token;

    // Chưa login -> chỉ hiện Login
    if (!token) return <Login />;

    // Đã login -> hiện Main (Menu + các trang)
    return <Main />;
  }
}

export default App;