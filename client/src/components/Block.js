import React, { Component } from "react";

export default class Block extends Component {
  render() {
    const { timestamp, hash, data } = this.props.block;

    const hashDisplay = `${hash.substring(0, 15)}...`;
    const stringfiedData = JSON.stringify(data);

    const dataDisplay =
      stringfiedData.length > 35
        ? `${stringfiedData.substring(0, 35)}...`
        : stringfiedData;

    return (
      <div className="Block">
        <div>Hash: {hashDisplay}</div>
        <div>Timestamp: {new Date(timestamp).toLocaleDateString()}</div>
        <div>Data: {dataDisplay}</div>
      </div>
    );
  }
}
