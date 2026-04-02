import axios from 'axios';
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
    // khi click 1 dòng bên trái -> props.item đổi -> fill vào form
    if (this.props.item && this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id || '',
        txtName: this.props.item.name || '',
      });
    }
    // nếu bỏ chọn
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

  apiPostCategory = (cate) => {
    const token = this.context?.token;
    const config = { headers: { 'x-access-token': token } };

    axios
      .post('/api/admin/categories', cate, config)
      .then(() => {
        alert('OK BABY!');
        this.apiGetCategories(); // load lại list và đẩy lên cha
      })
      .catch((err) => {
        console.error(err);
        alert('SORRY BABY!');
      });
  };
  btnUpdateClick(e) {
  e.preventDefault();
  const id = this.state.txtID;
  const name = this.state.txtName;

  if (id && name) {
    const cate = { name: name };
    this.apiPutCategory(id, cate);
  } else {
    alert('Please input id and name');
  }
}
apiPutCategory(id, cate) {
  const config = { headers: { 'x-access-token': this.context.token } };

  axios.put('/api/admin/categories/' + id, cate, config).then((res) => {
    const result = res.data;
    if (result) {
      alert('OK BABY!');
      this.apiGetCategories(); // load lại list và cập nhật bảng bên trái
    } else {
      alert('SORRY BABY!');
    }
  }).catch((err) => {
    console.error(err);
    alert('SORRY BABY!');
  });
}
apiGetCategories() {
  const config = { headers: { 'x-access-token': this.context.token } };
  axios.get('/api/admin/categories', config).then((res) => {
    this.props.updateCategories(res.data);
  });
}

  apiGetCategories = () => {
    const token = this.context?.token;
    const config = { headers: { 'x-access-token': token } };

    axios
      .get('/api/admin/categories', config)
      .then((res) => {
        const result = res.data; // thường là mảng
        if (this.props.updateCategories) {
          this.props.updateCategories(result);
        }
      })
      .catch((err) => console.error(err));
  };
  apiDeleteCategory(id) {
  const config = { headers: { 'x-access-token': this.context.token } };

  axios
    .delete('/api/admin/categories/' + id, config)
    .then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetCategories(); // load lại list và cập nhật bảng bên trái
        // có thể clear form luôn nếu muốn
        this.setState({ txtID: '', txtName: '' });
      } else {
        alert('SORRY BABY!');
      }
    })
    .catch((err) => {
      console.error(err);
      alert('SORRY BABY!');
    });
}
apiGetCategories() {
  const config = { headers: { 'x-access-token': this.context.token } };
  axios.get('/api/admin/categories', config).then((res) => {
    this.props.updateCategories(res.data);
  });
}
  btnDeleteClick(e) {
  e.preventDefault();
  if (window.confirm('ARE YOU SURE?')) {
    const id = this.state.txtID;
    if (id) {
      this.apiDeleteCategory(id);
    } else {
      alert('Please input id');
    }
  }
}

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
                  <input type="submit" value="UPDATE" onClick={(e) => this.btnUpdateClick(e)} />
                  <input type="submit" value="DELETE" onClick={(e) => this.btnDeleteClick(e)} />
                  {/* UPDATE/DELETE bạn làm sau */}
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