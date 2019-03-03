import React, { Component } from 'react'

export class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        window.addEventListener('load', async () => {
            if (window.ethereum) {
                try {
                    await window.ethereum.enable();
                    this.inputField.value = window.web3.eth.accounts[0];
                    this.props.setAddress(window.web3.eth.accounts[0]);
                } catch (error) {
                }
            }
            else if (window.web3 && window.web3.eth.accounts) {
                this.inputField.value = window.web3.eth.accounts[0];
                this.props.setAddress(window.web3.eth.accounts[0]);
            }
        })
    };

    render() {
        return (
        <React.Fragment>
            <div className='main-header px-3 py-3 pt-md-5 pp-md-4 mx-auto text-center'>
                <h1 className='display-4 m-4'>Recommended Tokens For Your Wallet</h1>
                <p className='lead'>Get personalized ERC20 tokens from a machine-learning model trained on your blockchain transactions. Try it out:</p>
            </div>
            <form className='form needs-validation' onSubmit={this.props.handleSubmit} novalidate>
                <div className='form-label-group form-row row justify-content-center'>
                    <input
                        className={'form-control mb-4 col-5 ' + this.props.checkAddressValidity()}
                        placeholder='Ethereum address ...'
                        type='text'
                        onChange={this.props.handleChange}
                        ref={elem => this.inputField = elem}
                        required
                    >
                    </input>
                </div>
                <div className='row justify-content-center'>
                    <input 
                        className='btn btn-primary col-2'
                        type='submit'
                        value='Submit'
                        ref={elem => this.submitButton = elem}
                    />
                </div>
            </form>
        </React.Fragment>
    )
  }
}

export default Search
