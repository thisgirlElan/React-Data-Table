import React, {Component} from 'react';
import {Typography, Button} from '@mui/material'
import BusinessData from './data'
import '../modal.css'
import '../table.css'
import '../footer.css'

class BusinessTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businesses: [],
      selectedOrder: {},
      isModalOpen: false,
      rowsPerPage: 5,
      currentPage: 1
    }
  }

  componentDidMount() {
    this.setState({businesses:BusinessData});
  }

  openModal = (order) => {
    this.setState({
      isModalOpen: true,
      selectedOrder: order.details
    })
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false,
      selectedOrder: null,
      orderDetails: null
    })
  };

  pageChange = (pageNumber) => {
    this.setState({
      currentPage: pageNumber
    })
  };

  render () {
    const indexOfLastRow = this.state.currentPage * this.state.rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - this.state.rowsPerPage;
    const currentRows = this.state.businesses.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(this.state.businesses.length / this.state.rowsPerPage)
    
    return (
      <div className="main">
        <div className="table-container">
      <table>
       <thead>
          <tr>
            <th>Business</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((business) => (
            <tr className="tcell" key={business.id}>
              <td>{business.businessname}</td>
              <td>
                {business.order.length > 0 ? (
                  <ul>
                    {business.order.map((order, index) => (
                    <li className="list" key={index} onClick={() => this.openModal(order)}>{order.item}</li>
                    ))}
                  </ul>
                ) :  (
                  <ul>
                 <li className="no-list">no order</li>
                 </ul>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div className="footer">
         <div className='pagination'>
        <p className='row-text'>Rows per page: </p>
        <select className='selectPage'
          value={this.state.rowsPerPage}
          onChange={(e) => this.setState({
            rowsPerPage: Number(e.target.value)
            })}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={this.state.businesses.length}>All</option>
        </select>
      </div>

      <div className='pageChange'>
        <Button
        className={"button"}
          disabled={this.state.currentPage === 1}
          onClick={() => this.pageChange(this.state.currentPage - 1)}
        >
          ⏮ Prev
        </Button>

        <Typography className={"button-text"} variant="body1" display="inline" gutterBottom>
          Page {this.state.currentPage} of {totalPages}
        </Typography>

        <Button
        className={"button"}
          disabled={this.state.currentPage === totalPages}
          onClick={() => this.pageChange(this.state.currentPage + 1)}
        >
          Next ⏭
        </Button>
      </div>
      </div>

      {this.state.isModalOpen && (
       <div className="modal-overlay" onClick={this.closeModal}>
       <div className="modal">
           <Typography className="header" variant="body1" display="inline" gutterBottom>
               Order Details
           </Typography>
           <Typography variant="body1" display="inline" gutterBottom>
               Total number of orders: {this.state.selectedOrder.order_total}
           </Typography>
           <Typography variant="body1" display="inline" gutterBottom>
               Total order sales: {this.state.selectedOrder.order_amt}
           </Typography>
           <Typography variant="body1" display="inline" gutterBottom>
               Total number of orders today: {this.state.selectedOrder.today_order_total}
           </Typography>
           <Typography variant="body1" display="inline" gutterBottom>
               Total sales today: {this.state.selectedOrder.today_order_amt}
           </Typography>
           
           <Button onClick={this.closeModal}>Close</Button>
       </div>
   </div>
      )}

    </div>
    
    )
  }
}

export default BusinessTable;