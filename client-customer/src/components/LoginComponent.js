import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';

const API_BASE =
  process.env.REACT_APP_API_BASE || 'https://shoppingonline-server.onrender.com/api';
// nếu URL backend của bạn khác thì thay lại cho đúng

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: 'sonkk',
      txtPassword: '123'
    };
  }

  render() {
    return (
      <div className="align-center">
        <h2 className="text-center">CUSTOMER LOGIN</h2>
        <form>
          <table className="align-center">
            <tbody>
              <tr>
                <td>Username</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtUsername}
                    onChange={(e) => { this.setState({ txtUsername: e.target.value }) }}
                  />
                </td>
              </tr>
              <tr>
                <td>Password</td>
                <td>
                  <input
                    type="password"
                    value={this.state.txtPassword}
                    onChange={(e) => { this.setState({ txtPassword: e.target.value }) }}
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <input
                    type="submit"
                    value="LOGIN"
                    onClick={(e) => this.btnLoginClick(e)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }

  btnLoginClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;

    if (username && password) {
      const account = { username, password };
      this.apiLogin(account);
    } else {
      alert('Please input username and password');
    }
  }

  apiLogin(account) {
    axios.post(`${API_BASE}/customer/login`, account)
      .then((res) => {
        const result = res.data;
        console.log('customer login result =', result);

        if (result.success === true && result.token) {
          this.context.setToken(result.token);
          this.context.setCustomer(result.customer);
          this.props.navigate('/home');
        } else {
          alert(result.message || 'Login failed');
        }
      })
      .catch((err) => {
        console.error('customer login error:', err);
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message ||
          'Cannot login';
        alert(msg);
      });
  }
}

export default withRouter(Login);