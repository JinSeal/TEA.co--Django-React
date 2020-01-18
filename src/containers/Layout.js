import React from "react";
import { withRouter } from "react-router-dom";
import Nav from "./Nav";

class CustomLayout extends React.Component {
  state = {
    fixed: null,
    activeItem: ""
  };

  render() {
    return (
      <div>
        <Nav />
        {this.props.children}
      </div>
    );
  }
}

export default withRouter(CustomLayout);
