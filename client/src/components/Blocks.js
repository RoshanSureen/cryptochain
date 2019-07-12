import React, { Component } from "react";
import { Link } from "react-router-dom";
import Block from "./Block";

export default class Blocks extends Component {
  state = { blocks: [] };
  componentDidMount() {
    fetch("http://localhost:3000/api/blocks")
      .then(response => response.json())
      .then(json => this.setState({ blocks: json }))
      .catch(err => console.log(err));
  }
  render() {
    console.log("this.state", this.state);
    return (
      <div>
        <div>
          <Link to="/">Home</Link>
        </div>
        <h3>Blocks</h3>
        {this.state.blocks.map(block => {
          return <Block key={block.hash} block={block} />;
        })}
      </div>
    );
  }
}
