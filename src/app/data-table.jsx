import React, {Component} from 'react';
import { Modal, Box, Typography, Button} from '@mui/material'
import BusinessData from './data'

class BusinessTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businesses: [],
      selectedOrder: null,
      isModalOpen: false,
      rowsPerPage: 10,
      currentPage: 1
    }
  }

  componentDidMount() {
    this.setState({businesses:BusinessData});
  }

  openModal = (order) => {
    console.log("order props", order)
    this.setState({
      isModalOpen: true,
      selectedOrder: order
    })
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false,
      selectedOrder: null,
      orderDetails: null
    })
  };

  paginate = (pageNumber) => {
    this.setState({
      currentPage: pageNumber
    })
  };

  render () {

    const indexOfLastRow = this.state.currentPage * this.state.rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - this.state.rowsPerPage;
    const currentRows = this.state.businesses.slice(indexOfFirstRow, indexOfLastRow);
    
    return (
      <div>
      <table>
       <thead>
          <tr>
            <th>Business</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((business) => (
            {...console.log("business name", business.businessname)},
            <tr key={business.id}>
              <td>{business.businessname}</td>
              {business.order.map((order, index) => (
              <td key={index} onClick={() => this.openModal(order.details)}>{order.item}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

         <div>
        Rows per page:
        <select
          value={this.state.rowsPerPage}
          onChange={(e) => this.setState({
            rowsPerPage: Number(e.target.value)
            })}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={this.state.businesses.length}>All</option>
        </select>
      </div>

      <div>
        {this.state.businesses.length > this.state.rowsPerPage && (
          <div>
            {Array.from(Array(Math.ceil(this.state.businesses.length / this.state.rowsPerPage)).keys()).map((pageNumber) => (
              <button key={pageNumber} onClick={() => this.paginate(pageNumber + 1)}>
                {pageNumber + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {this.state.selectedOrder && (
        <Modal 
        open={this.state.isModalOpen} 
        onClose={() => this.closeModal()}
        >
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'slate', boxShadow: 24, p:4}}>
          <Typography variant="h6" component="div" gutterBottom>
            Order Details
          </Typography>
          <Typography variant="body1" gutterBottom>
          Total number of orders: {this.state.selectedOrder && this.state.selectedOrder.order_total}
          </Typography>
          <Typography variant="body1" gutterBottom>
          Total amount of orders: {this.state.selectedOrder && this.state.selectedOrder.order_amt}
          </Typography>
          <Typography variant="body1" gutterBottom>
          Total number of orders today: {this.state.selectedOrder && this.state.selectedOrder.today_order_total}
          </Typography>
          <Typography variant="body1" gutterBottom>
          Total amount of orders today: {this.state.selectedOrder && this.state.selectedOrder.today_order_amt}
          </Typography>

          <Button onClick={this.closeModal()}>Close</Button>
        </Box>
        </Modal>
      )}
    </div>
    
    )
  }
}

export default BusinessTable;