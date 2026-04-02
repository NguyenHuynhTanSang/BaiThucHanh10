import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../contexts/MyContext';

const API_BASE =
  process.env.REACT_APP_API_BASE || 'https://shoppingonline-server.onrender.com/api';

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = { username: '', password: '' };
  }

  btnLoginClick = async () => {
    const { username, password } = this.state;

    if (!username || !password) {
      alert('Please input username & password');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/admin/login`, { username, password });
      const result = res.data;

      console.log('login res.data =', result);

      const token = result?.token;

      if (!token) {
        alert(result?.message || 'Login failed: token not found in response');
        return;
      }

      this.context.setToken(token);
      this.context.setUsername(result?.username || result?.admin?.username || username);

      window.location.replace('/category');
    } catch (err) {
      console.error('login error:', err);
      const msg = err?.response?.data?.message || err.message || 'cannot login';
      alert('Error: ' + msg);
    }
  };

  render() {
    return (
      <div className="align-center">
        <h2 className="text-center">ADMIN LOGIN</h2>
        <table className="login">
          <tbody>
            <tr>
              <td>Username</td>
              <td>
                <input
                  type="text"
                  value={this.state.username}
                  onChange={(e) => this.setState({ username: e.target.value })}
                />
              </td>
            </tr>
            <tr>
              <td>Password</td>
              <td>
                <input
                  type="password"
                  value={this.state.password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
              </td>
            </tr>
            <tr>
              <td />
              <td>
                <button onClick={this.btnLoginClick}>Login</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Login;