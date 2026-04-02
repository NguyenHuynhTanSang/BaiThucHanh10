import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';

class Category extends Component {
  
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null,
      loading: false,
      error: '',
    };
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  trItemClick = (item) => {
    this.setState({ itemSelected: item });
  };
  updateCategories = (categories) => {
  const list = this.normalizeCategories(categories);
  this.setState({ categories: list });
};

  // Helper: chuẩn hoá response về mảng categories
  normalizeCategories = (data) => {
    if (Array.isArray(data)) return data;

    // các kiểu hay gặp: {categories: []}, {categorys: []}, {data: []}, {result: []}
    if (data && typeof data === 'object') {
      if (Array.isArray(data.categories)) return data.categories;
      if (Array.isArray(data.categorys)) return data.categorys;
      if (Array.isArray(data.data)) return data.data;
      if (Array.isArray(data.result)) return data.result;

      // đôi khi: { success: true, categories: [...] }
      if (data.success && Array.isArray(data.categories)) return data.categories;
    }

    return [];
  };

  apiGetCategories = () => {
    const token = this.context?.token;

    // nếu chưa có token thì báo rõ (đỡ trắng trang)
    if (!token) {
      this.setState({
        categories: [],
        error: 'Missing token. Please login again then open /admin/category.',
      });
      return;
    }

    const config = {
      headers: { 'x-access-token': token },
    };

    this.setState({ loading: true, error: '' });

    axios
      .get('/api/admin/categories', config)
      .then((res) => {
        const list = this.normalizeCategories(res.data);

        // debug khi cần:
        // console.log('GET /api/admin/categories =>', res.data);

        this.setState({ categories: list, loading: false });
      })
      .catch((err) => {
        const status = err?.response?.status;
        const msgFromServer =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Unknown error';

        let friendly = `apiGetCategories error: ${msgFromServer}`;
        if (status === 401 || status === 403) {
          friendly = 'Unauthorized. Token invalid/expired. Please login again.';
        } else if (status === 404) {
          friendly =
            'API not found (404). Check server route: /api/admin/categories';
        }

        console.error('apiGetCategories error full:', err);

        this.setState({
          categories: [],
          loading: false,
          error: friendly,
        });
      });
  };

  render() {
    const list = Array.isArray(this.state.categories) ? this.state.categories : [];

    const cates = list.map((item) => (
      <tr
        key={item._id}
        className="datatable"
        onClick={() => this.trItemClick(item)}
        style={{ cursor: 'pointer' }}
      >
        <td>{item._id}</td>
        <td>{item.name}</td>
      </tr>
    ));

    return (
      <div>
        <div className="float-left">
          <h2 className="text-center">CATEGORY LIST</h2>

          {this.state.loading && (
            <p style={{ margin: '8px 0' }}>Loading categories...</p>
          )}

          {this.state.error && (
            <p style={{ margin: '8px 0', color: 'red' }}>
              {this.state.error}
            </p>
          )}

          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Name</th>
              </tr>

              {cates}

              {!this.state.loading && !this.state.error && list.length === 0 && (
                <tr className="datatable">
                  <td colSpan="2" style={{ textAlign: 'center' }}>
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="inline" />

        <CategoryDetail 
        item={this.state.itemSelected}
        updateCategories={this.updateCategories} />

        <div className="float-clear" />
      </div>
    );
  }
  
}



export default Category;