import React, { Component } from 'react';
import Search from './components/Search'
import Recommendations from './components/Recommendations';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {submitted: false};
  }

  setAddress = (newAddress) => {
    this.setState({address: newAddress});
  }

  reset = () => {
    this.setState({submitted: false, address: ''});
  }

  checkAddressValidity = () => {
    const address = this.state.address;
    if (address === undefined || address.length === 0) {
      return '';
    } else if (address.length !== 42) {
      return 'is-invalid';
    } else {
      return 'is-valid';
    };
  }


  handleChange = (event) => {
    this.setState({address: event.target.value});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.checkAddressValidity() === 'is-valid') {
      this.setState({submitted: true});
    }
    else {
      alert('Invalid Ethereum address');
    }
  };

  render() {
    if (!this.state.submitted) {
        return <Search
                setAddress={this.setAddress}
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
                address={this.state.address}
                checkAddressValidity={this.checkAddressValidity}
                />
    }
    else {
        return <Recommendations
                address={this.state.address}
                reset={this.reset}
                />
    }
}
}

export default App;
