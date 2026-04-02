import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';

const API_BASE =
  process.env.REACT_APP_API_BASE || 'https://shoppingonline-server.onrender.com/api';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  render() {
    const prods = this.state.products.map((item) => {
      return (
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
              Price: {item.price}
            </figcaption>
          </figure>
        </div>
      );
    });

    return (
      <div className="text-center">
        <h2 className="text-center">LIST PRODUCTS</h2>
        {prods}
      </div>
    );
  }

  componentDidMount() {
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  componentDidUpdate(prevProps) {
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  apiGetProductsByCatID(cid) {
    axios.get(`${API_BASE}/customer/products/category/${cid}`)
      .then((res) => {
        const result = res.data;
        this.setState({ products: result || [] });
      })
      .catch((err) => {
        console.error('apiGetProductsByCatID error:', err);
      });
  }

  apiGetProductsByKeyword(keyword) {
    axios.get(`${API_BASE}/customer/products/search/${keyword}`)
      .then((res) => {
        const result = res.data;
        this.setState({ products: result || [] });
      })
      .catch((err) => {
        console.error('apiGetProductsByKeyword error:', err);
      });
  }
}

export default withRouter(Product);