import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const API_BASE =
  process.env.REACT_APP_API_BASE || 'https://shoppingonline-server.onrender.com/api';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: []
    };
  }

  componentDidMount() {
    this.apiGetNewProducts();
    this.apiGetHotProducts();
  }

  apiGetNewProducts() {
    axios.get(`${API_BASE}/customer/products/new`)
      .then((res) => {
        this.setState({ newprods: res.data || [] });
      })
      .catch((err) => {
        console.error('apiGetNewProducts error:', err);
      });
  }

  apiGetHotProducts() {
    axios.get(`${API_BASE}/customer/products/hot`)
      .then((res) => {
        this.setState({ hotprods: res.data || [] });
      })
      .catch((err) => {
        console.error('apiGetHotProducts error:', err);
      });
  }

  render() {
    const newprods = this.state.newprods.map((item) => (
      <div key={item._id} className="inline">
        <figure>
          <Link to={'/product/' + item._id}>
            <img
              src={'data:image/jpg;base64,' + item.image}
              width="300px"
              height="300px"
              alt=""
            />
          </Link>
          <figcaption className="text-center">
            {item.name}
            <br />
            Price: {item.price}$
          </figcaption>
        </figure>
      </div>
    ));

    const hotprods = this.state.hotprods.map((item) => (
      <div key={item._id} className="inline">
        <figure>
          <Link to={'/product/' + item._id}>
            <img
              src={'data:image/jpg;base64,' + item.image}
              width="300px"
              height="300px"
              alt=""
            />
          </Link>
          <figcaption className="text-center">
            {item.name}
            <br />
            Price: {item.price}$
          </figcaption>
        </figure>
      </div>
    ));

    return (
      <div>
        <div className="align-center">
          <h2 className="text-center">NEW PRODUCTS</h2>
          {newprods}
        </div>

        {this.state.hotprods.length > 0 ? (
          <div className="align-center">
            <h2 className="text-center">HOT PRODUCTS</h2>
            {hotprods}
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default Home;