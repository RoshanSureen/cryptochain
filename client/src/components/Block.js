import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Transaction from "./Transaction";

export default class Block extends Component {
  state = { displayTransaction: false };

  toggleTransaction = () => {
    this.setState({ displayTransaction: !this.state.displayTransaction });
  };

  get displayTransaction() {
    const { data } = this.props.block;
    const stringfiedData = JSON.stringify(data);

    const dataDisplay =
      stringfiedData.length > 35
        ? `${stringfiedData.substring(0, 35)}...`
        : stringfiedData;

    if (this.state.displayTransaction) {
      return (
        <div>
          {data.map(transaction => (
            <div key={transaction}>
              <hr />
              <Transaction transaction={transaction} />
            </div>
          ))}
          <br />
          <Button variant="danger" size="sm" onClick={this.toggleTransaction}>
            Show Less
          </Button>
        </div>
      );
    }

    return (
      <div>
        <div>Data: {dataDisplay}</div>
        <Button variant="danger" size="sm" onClick={this.toggleTransaction}>
          Show More
        </Button>
      </div>
    );
  }
  render() {
    const { timestamp, hash } = this.props.block;

    const hashDisplay = `${hash.substring(0, 15)}...`;

    return (
      <div className="Block">
        <div>Hash: {hashDisplay}</div>
        <div>Timestamp: {new Date(timestamp).toLocaleDateString()}</div>
        {this.displayTransaction}
      </div>
    );
  }
}
