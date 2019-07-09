import React, { Component } from "react";
import Blocks from "./Blocks";
import logo from "../assets/logo.png";

class App extends Component {
  state = {
    walletInfo: {}
  };

  componentDidMount() {
    fetch("http://localhost:3000/api/wallet-info")
      .then(response => response.json())
      .then(json => this.setState({ walletInfo: json }))
      .catch(err => console.log(err));
  }
  render() {
    const { address, balance } = this.state.walletInfo;
    return (
      <div className="App">
        <img src={logo} className="logo" />
        <br />
        <div>Welcome to blockchain...</div>
        <br />
        <div className="WalletInfo">
          <div>Address: {address}</div>
          <div>Balance: {balance}</div>
        </div>
        <br />
        <Blocks />
      </div>
    );
  }
}

export default App;
