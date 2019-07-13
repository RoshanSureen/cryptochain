import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Transaction from "./Transaction";
import history from "../history";

const POLL_INTERVAL_MS = 6000;

export default class TransactionPool extends Component {
  state = { transactionPoolMap: {} };

  fetchTransactionPoolMap = () => {
    fetch(`${document.location.origin}/api/transaction-pool-map`)
      .then(response => response.json())
      .then(json => this.setState({ transactionPoolMap: json }));
  };

  mineTransactions = () => {
    fetch(`${document.location.origin}/api/mine-transactions`).then(
      response => {
        if (response.status === 200) {
          alert("success");
          history.push("/blocks");
        } else {
          alert("The mine-transactions block request did not complete");
        }
      }
    );
  };

  componentDidMount() {
    this.fetchTransactionPoolMap();

    this.TransactionPoolInterval = setInterval(
      () => this.fetchTransactionPoolMap(),
      POLL_INTERVAL_MS
    );
  }

  componentWillUnmount() {
    clearInterval(this.TransactionPoolInterval);
  }

  render() {
    return (
      <div className="TransactionPool">
        <div>
          <Link to="/">Home</Link>
        </div>
        <h3>Transaction Pool</h3>
        {Object.values(this.state.transactionPoolMap).map(transaction => {
          return (
            <div key={transaction}>
              <hr />
              <Transaction transaction={transaction} />
            </div>
          );
        })}
        <hr />
        <Button variant="danger" onClick={this.mineTransactions()}>
          Mine the transactions
        </Button>
      </div>
    );
  }
}
