import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: 0,
      cmbCategory: '',
      imgProduct: '', // preview url (dataURL)
      fileImage: null, // file upload
    };
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.item && this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id || '',
        txtName: this.props.item.name || '',
        txtPrice: this.props.item.price || 0,
        cmbCategory: this.props.item.category?._id || this.props.item.category_id || '',
        imgProduct: this.props.item.image
          ? 'data:image/jpg;base64,' + this.props.item.image
          : '',
        fileImage: null,
      });
    }
  }

  // event-handlers
  previewImage = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    this.setState({ fileImage: file });

    const reader = new FileReader();
    reader.onload = (evt) => {
      this.setState({ imgProduct: evt.target.result }); // dataURL
    };
    reader.readAsDataURL(file);
  };

  btnAddClick(e) {
  e.preventDefault();
  const name = this.state.txtName;
  const price = parseInt(this.state.txtPrice);
  const category = this.state.cmbCategory;
  const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');

  if (name && price && category && image) {
    const prod = { name: name, price: price, category: category, image: image };
    this.apiPostProduct(prod);
  } else {
    alert('Please input name and price and category and image');
  }
}

  btnUpdateClick = (e) => {
  e.preventDefault();

  const id = this.state.txtID;
  const name = this.state.txtName;
  const price = parseInt(this.state.txtPrice);
  const category = this.state.cmbCategory;

  const image = this.state.imgProduct
    ? this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, '')
    : '';

  if (id && name && price && category && image) {
    const prod = { id: id, name: name, price: price, category: category, image: image };
    this.apiPutProduct(prod);
  } else {
    alert('Please input id and name and price and category and image');
  }
};

  btnDeleteClick = (e) => {
  e.preventDefault();

  if (window.confirm('ARE YOU SURE?')) {
    const id = this.state.txtID;
    if (id) {
      this.apiDeleteProduct(id);
    } else {
      alert('Please input id');
    }
  }
};
  

  // apis
  apiGetCategories = () => {
    const config = { headers: { 'x-access-token': this.context.token } };

    axios
      .get('/api/admin/categories', config)
      .then((res) => {
        // thường res.data là mảng categories
        const result = Array.isArray(res.data)
          ? res.data
          : (res.data.categories || res.data.categorys || res.data.data || []);
        this.setState({ categories: result });

        // set default category nếu chưa có
        if (!this.state.cmbCategory && result.length > 0) {
          this.setState({ cmbCategory: result[0]._id });
        }
      })
      .catch((err) => console.error('apiGetCategories error:', err));
  };
  apiDeleteProduct = (id) => {
  const config = { headers: { 'x-access-token': this.context.token } };

  axios
    .delete('/api/admin/products/' + id, config)
    .then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetProductsAfterChange(); // refresh list
        // clear form
        this.setState({ txtID: '', txtName: '', txtPrice: 0, imgProduct: '', fileImage: null });
      } else {
        alert('SORRY BABY!');
      }
    })
    .catch((err) => {
      console.error(err);
      alert('SORRY BABY!');
    });
};
apiPutProduct = (prod) => {
  const config = { headers: { 'x-access-token': this.context.token } };

  axios
    .put('/api/admin/products', prod, config)
    .then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        // refresh list bên trái
        if (this.apiGetProductsAfterChange) this.apiGetProductsAfterChange();
        else if (this.apiGetProducts) this.apiGetProducts();
      } else {
        alert('SORRY BABY!');
      }
    })
    .catch((err) => {
      console.error(err);
      alert('SORRY BABY!');
    });
};
apiPostProduct(prod) {
  const config = { headers: { 'x-access-token': this.context.token } };
  axios.post('/api/admin/products', prod, config).then((res) => {
    const result = res.data;
    if (result) {
      alert('OK BABY!');
      this.apiGetProducts();
    } else {
      alert('SORRY BABY!');
    }
  });
}

apiGetProducts() {
  const config = { headers: { 'x-access-token': this.context.token } };
  axios.get('/api/admin/products?page=' + this.props.curPage, config).then((res) => {
    const result = res.data;
    this.props.updateProducts(result.products, result.noPages);
  });
}
  render() {
    const cates = (this.state.categories || []).map((cate) => (
      <option key={cate._id} value={cate._id}>
        {cate.name}
      </option>
    ));
    

    return (
      <div className="float-right">
        <h2 className="text-center">PRODUCT DETAIL</h2>

        <form>
          <table>
            <tbody>
              <tr>
                <td>ID</td>
                <td>
                  <input type="text" value={this.state.txtID} readOnly />
                </td>
              </tr>

              <tr>
                <td>Name</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtName}
                    onChange={(e) => this.setState({ txtName: e.target.value })}
                  />
                </td>
              </tr>

              <tr>
                <td>Price</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtPrice}
                    onChange={(e) => this.setState({ txtPrice: e.target.value })}
                  />
                </td>
              </tr>

              <tr>
                <td>Image</td>
                <td>
                  <input
                    type="file"
                    name="fileImage"
                    accept="image/jpeg, image/png, image/gif"
                    onChange={this.previewImage}
                  />
                </td>
              </tr>

              <tr>
                <td>Category</td>
                <td>
                  <select
                    value={this.state.cmbCategory}
                    onChange={(e) => this.setState({ cmbCategory: e.target.value })}
                  >
                    {cates}
                  </select>
                </td>
              </tr>

              <tr>
                <td></td>
                <td>
                  <input type="submit" value="ADD NEW" onClick={(e) => this.btnAddClick(e)} />
                  <input type="submit" value="UPDATE" onClick={(e) => this.btnUpdateClick(e)} />
                  <input type="submit" value="DELETE" onClick={(e) => this.btnDeleteClick(e)} />
                </td>
              </tr>

              <tr>
                <td colSpan="2">
                  {this.state.imgProduct ? (
                    <img src={this.state.imgProduct} width="300px" height="300px" alt="" />
                  ) : null}
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }
}

export default ProductDetail;