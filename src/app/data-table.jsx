import React, { Component } from "react";
import { Typography, Button } from "@mui/material";
import Orders from "./orders.json";
import BusinessData from "./businesses.json";
import "../modal.css";
import "../table.css";
import "../footer.css";

import { BUSINESS_URL, ORDERS_URL } from "../apiUtil";

class BusinessTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      business: [],
      businessOrders: [],
      mergedData: [],
      selectedOrder: {},
      isModalOpen: false,
      rowsPerPage: 5,
      currentPage: 1,
    };
  }

  componentDidMount() {
    this.fetchBusiness();
    this.fetchOrders();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.business.length !== this.state.business.length ||
      prevState.businessOrders.length !== this.state.businessOrders.length
    ) {
      this.mergedData();
    }
  }

  fetchBusiness = () => {
    this.setState({business: BusinessData})
    // fetch(BUSINESS_URL)
    //   .then((res) => res.json())
    //   .then((result) => {
    //     this.setState({
    //       business: result,
    //     });
    //   })
    //   .catch((err) => console.error("fetch error:", err));
  };

  fetchOrders = () => {
    this.setState({businessOrders: Orders})
    // fetch(ORDERS_URL)
    //   .then((res) => res.json())
    //   .then((result) => {
    //     this.setState({
    //       businessOrders: result,
    //     });
    //   })
    //   .catch((err) => console.error("fetch error:", err));
  };

  mergedData = () => {
    const { business, businessOrders } = this.state;
    const merged = business.map((business) => {
      const orders = businessOrders.find(
        (order) => order.businessId === business.id
      );
      return { ...business, orders };
    });
    this.setState({
      mergedData: merged,
    });
  };

  openModal = (order) => {
    this.setState({
      isModalOpen: true,
      selectedOrder: order,
    });
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false,
      selectedOrder: null,
      orderDetails: null,
    });
  };

  pageChange = (pageNumber) => {
    this.setState({
      currentPage: pageNumber,
    });
  };

  render() {
    const indexOfLastRow = this.state.currentPage * this.state.rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - this.state.rowsPerPage;
    const currentRows = this.state.mergedData.slice(
      indexOfFirstRow,
      indexOfLastRow
    );
    const totalPages = Math.ceil(
      this.state.mergedData.length / this.state.rowsPerPage
    );

    return (
      <div className="main">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Business</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((business) => (
                <tr className="tcell" key={business.id}>
                  <td>{business.id}</td>
                  <td>{business.businessname}</td>
                  <td>
                    {business.orders ? (
                      <ul>
                       <li
                          className="list"
                          key={business.orders.id}
                          onClick={() =>
                            this.openModal(business.orders.details)
                          }
                        >
                          {business.orders.name}
                        </li>
                      </ul>
                    ) : (
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
          <div className="pagination">
            <p className="row-text">Rows per page: </p>
            <select
              className="selectPage"
              value={this.state.rowsPerPage}
              onChange={(e) =>
                this.setState({
                  rowsPerPage: Number(e.target.value),
                })
              }
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={this.state.business.length}>All</option>
            </select>
          </div>

          <div className="pageChange">
            <Button
              className={"button"}
              disabled={this.state.currentPage === 1}
              onClick={() => this.pageChange(this.state.currentPage - 1)}
            >
              ⏮ Prev
            </Button>

            <Typography
              style={{fontSize: '13px'}}
              variant="body1"
              display="inline"
              gutterBottom
            >
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
              <Typography
                className="header"
                variant="body1"
                display="inline"
                gutterBottom
              >
                Order Details
              </Typography>
              <Typography variant="body1" display="inline" gutterBottom>
                Total number of orders: {this.state.selectedOrder.total_orders}
              </Typography>
              <Typography variant="body1" display="inline" gutterBottom>
                Total order sales: {this.state.selectedOrder.total_sales}
              </Typography>
              <Typography variant="body1" display="inline" gutterBottom>
                Total number of orders today:{" "}
                {this.state.selectedOrder.orders_today}
              </Typography>
              <Typography variant="body1" display="inline" gutterBottom>
                Total sales today: {this.state.selectedOrder.sales_today}
              </Typography>

              <Button onClick={this.closeModal}>Close</Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default BusinessTable;
