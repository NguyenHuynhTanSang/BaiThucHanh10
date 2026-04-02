import API from '../api';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class CategoryDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.item && this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id || '',
        txtName: this.props.item.name || '',
      });
    }

    if (!this.props.item && prevProps.item) {
      this.setState({ txtID: '', txtName: '' });
    }
  }

  btnAddClick = (e) => {
    e.preventDefault();
    const name = this.state.txtName.trim();

    if (!name) {
      alert('Please input name');
      return;
    }

    this.apiPostCategory({ name });
  };

  btnUpdateClick = (e) => {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName.trim();

    if (id && name) {
      const cate = { name };
      this.apiPutCategory(id, cate);
    } else {
      alert('Please input id and name');
    }
  };

  btnDeleteClick = (e) => {
    e.preventDefault();

    if (window.confirm('ARE YOU SURE?')) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteCategory(id);
      } else {
        alert('Please input id');
      }
    }
  };

  apiPostCategory = (cate) => {
    const config = { headers: { 'x-access-token': this.context.token } };

    API.post('/admin/categories', cate, config)
      .then(() => {
        alert('OK BABY!');
        this.apiGetCategories();
        this.setState({ txtID: '', txtName: '' });
      })
      .catch((err) => {
        console.error('apiPostCategory error:', err);
        alert('SORRY BABY!');
      });
  };

  apiPutCategory = (id, cate) => {
    const config = { headers: { 'x-access-token': this.context.token } };

    API.put(`/admin/categories/${id}`, cate, config)
      .then((res) => {
        const result = res.data;
        if (result) {
          alert('OK BABY!');
          this.apiGetCategories();
        } else {
          alert('SORRY BABY!');
        }
      })
      .catch((err) => {
        console.error('apiPutCategory error:', err);
        alert('SORRY BABY!');
      });
  };

  apiDeleteCategory = (id) => {
    const config = { headers: { 'x-access-token': this.context.token } };

    API.delete(`/admin/categories/${id}`, config)
      .then((res) => {
        const result = res.data;
        if (result) {
          alert('OK BABY!');
          this.apiGetCategories();
          this.setState({ txtID: '', txtName: '' });
        } else {
          alert('SORRY BABY!');
        }
      })
      .catch((err) => {
        console.error('apiDeleteCategory error:', err);
        alert('SORRY BABY!');
      });
  };

  apiGetCategories = () => {
    const config = { headers: { 'x-access-token': this.context.token } };

    API.get('/admin/categories', config)
      .then((res) => {
        if (this.props.updateCategories) {
          this.props.updateCategories(res.data);
        }
      })
      .catch((err) => {
        console.error('apiGetCategories error:', err);
      });
  };

  render() {
    return (
      <div className="float-right">
        <h2 className="text-center">CATEGORY DETAIL</h2>

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
                <td></td>
                <td>
                  <input type="submit" value="ADD NEW" onClick={this.btnAddClick} />
                  <input type="submit" value="UPDATE" onClick={this.btnUpdateClick} />
                  <input type="submit" value="DELETE" onClick={this.btnDeleteClick} />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }
}

export default CategoryDetail;