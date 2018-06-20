import React from "react";
import "./Spinner.css";

class Spinner extends React.Component {
  constructor(props) {
    super(props);

    this.state = { count: 0 };
  }

  componentDidMount() {
    this.timer = setInterval(
      () => this.setState(prevState => ({ count: (prevState.count + 1) % 5 })),
      200
    );
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return <div className="Spinner">{".".repeat(this.state.count + 1)}</div>;
  }
}

export default Spinner;
