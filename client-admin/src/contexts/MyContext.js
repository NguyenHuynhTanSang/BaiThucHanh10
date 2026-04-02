import React, { createContext, Component } from 'react';

const MyContext = createContext();

export class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('token') || '',
      username: localStorage.getItem('username') || '',
    };
  }

  setToken = (token) => {
    const value = token || '';
    this.setState({ token: value });
    if (value) localStorage.setItem('token', value);
    else localStorage.removeItem('token');
  };

  setUsername = (username) => {
    const value = username || '';
    this.setState({ username: value });
    if (value) localStorage.setItem('username', value);
    else localStorage.removeItem('username');
  };

  logout = () => {
    this.setToken('');
    this.setUsername('');
  };

  render() {
    const value = {
      token: this.state.token,
      username: this.state.username,
      setToken: this.setToken,
      setUsername: this.setUsername,
      logout: this.logout,
    };

    return <MyContext.Provider value={value}>{this.props.children}</MyContext.Provider>;
  }
}

export default MyContext;