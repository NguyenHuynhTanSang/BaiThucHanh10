import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Menu from './MenuComponent';
import Category from './CategoryComponent';
import Product from './ProductComponent';
import Order from './OrderComponent';
import Customer from './CustomerComponent';

const Home = () => <h2>HOME</h2>;

class Main extends Component {
  render() {
    return (
      <div>
        <Menu />

        <Routes>
          <Route path="/admin" element={<Navigate to="/admin/home" />} />
          <Route path="/admin/home" element={<Home />} />
          <Route path="/admin/category" element={<Category />} />
          <Route path="/admin/product" element={<Product />} />
          <Route path="/admin/order" element={<Order />} />
          <Route path="/admin/customer" element={<Customer />} />
          <Route path="*" element={<Navigate to="/admin/home" />} />
        </Routes>
      </div>
    );
  }
}

export default Main;