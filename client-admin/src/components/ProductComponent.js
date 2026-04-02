import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null,
    };
  }

  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
  }

  // event-handlers
  lnkPageClick = (page) => {
    this.apiGetProducts(page);
  };

  trItemClick = (item) => {
    this.setState({ itemSelected: item });
  };
  updateProducts = (products, noPages) => {
  this.setState({ products: products, noPages: noPages });
};

  // apis
  apiGetProducts = (page) => {
    const config = { headers: { 'x-access-token': this.context.token } };

    axios
      .get('/api/admin/products?page=' + page, config)
      .then((res) => {
        const result = res.data; // { products, noPages, curPage }
        this.setState({
          products: result.products || [],
          noPages: result.noPages || 0,
          curPage: result.curPage || page,
        });
      })
      .catch((err) => {
        console.error('apiGetProducts error:', err);
      });
  };

  render() {
    const prods = (this.state.products || []).map((item) => (
      <tr
        key={item._id}
        className="datatable"
        onClick={() => this.trItemClick(item)}
        style={{ cursor: 'pointer' }}
      >
        <td>{item._id}</td>
        <td>{item.name}</td>
        <td>{item.price}</td>
        <td>{item.cdate ? new Date(item.cdate).toLocaleString() : ''}</td>
        <td>{item.category?.name || ''}</td>
        <td>
          {item.image ? (
            <img
              src={'data:image/jpg;base64,' + item.image}
              width="100px"
              height="100px"
              alt=""
            />
          ) : null}
        </td>
      </tr>
    ));

    const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
      const page = index + 1;
      if (page === this.state.curPage) return <span key={page}><b>{page}</b> </span>;
      return (
        <span
          key={page}
          className="link"
          style={{ cursor: 'pointer' }}
          onClick={() => this.lnkPageClick(page)}
        >
          {page}{' '}
        </span>
      );
    });

    return (
      <div>
        <div className="float-left">
          <h2 className="text-center">PRODUCT LIST</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Creation date</th>
                <th>Category</th>
                <th>Image</th>
              </tr>

              {prods}

              <tr>
                <td colSpan="6">{pagination}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="inline" />

        <ProductDetail 
            item={this.state.itemSelected} 
            curPage={this.state.curPage}
            updateProducts={this.updateProducts}
        />

        <div className="float-clear" />
      </div>
    );
  }
}

export default Product;