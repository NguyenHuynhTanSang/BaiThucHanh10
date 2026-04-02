import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Menu extends Component {
  static contextType = MyContext;

  btnLogoutClick = () => {
    this.context.logout();
    window.location.replace('/admin');
  };

  render() {
    const token = this.context?.token;
    const username = this.context?.username || 'admin';

    if (!token) return null;

    return (
      <div>
        <ul>
          <li className="menu"><Link to="/admin/home">Home</Link></li>
          <li className="menu"><Link to="/admin/category">Category</Link></li>
          <li className="menu"><Link to="/admin/product">Product</Link></li>
          <li className="menu"><Link to="/admin/order">Order</Link></li>
          <li className="menu"><Link to="/admin/customer">Customer</Link></li>
          <li className="menu">
            Hello <b>{username}</b> |{' '}
            <span
              onClick={this.btnLogoutClick}
              style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            >
              Logout
            </span>
          </li>
        </ul>
        <hr />
      </div>
    );
  }
}

export default Menu;