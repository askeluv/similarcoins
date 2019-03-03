import React, { Component } from 'react'

export class Recommendations extends Component {

  constructor(props) {
    super(props);
    this.state = {coins: [], loading: true};
  }

  app = document.getElementById('root');

  getTokenIcon = (tokenAddress) => {
    return "https://raw.githubusercontent.com/TrustWallet/tokens/master/tokens/" + tokenAddress + ".png";
  }

  getApiUrl = () => {
    var apiUrlBase = "https://crypto-etl-ethereum-dev.appspot.com/recommendation?num_recs=5&user_address="
    var address = this.props.address;
    return apiUrlBase + address;
  }

  renderZeroExInstant = (tokenAddress) => {
    const feeRecipient = '0xDeaf7D87d0f6159841bD96b398eF7494d177395c';
    const feePercentage = 0.005;
    const zrxAsset = window.zeroExInstant.assetDataForERC20TokenAddress(tokenAddress);
    try {
      window.zeroExInstant.render(
            {
                orderSource: 'https://api.radarrelay.com/0x/v2/',
                availableAssetDatas: [zrxAsset],
                defaultSelectedAssetData: zrxAsset,
                affiliateInfo: {
                    feeRecipient: feeRecipient,
                    feePercentage: feePercentage
                },
            },
            'body',
        );
    } catch (err){
        console.log(err);
        window.zeroExInstant.render(
            {
                orderSource: 'https://api.radarrelay.com/0x/v2/',
                availableAssetDatas: [zrxAsset],
                affiliateInfo: {
                    feeRecipient: feeRecipient,
                    feePercentage: feePercentage
                },
            },
            'body',
        );
    }
}

  _fetchAvailableCoinsOn0x = async () => {
    const url = 'https://api.radarrelay.com/0x/v2/asset_pairs?assetDataA=0xf47261b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&networkId=1&perPage=1000'
    let availableCoins;
    await fetch(url).then(
      results => {
        return results.json();
      }).catch(error => {
        return new Set([]);
      }).then(data => {
          availableCoins = new Set(data.records.map(record => {
            let assetData = record.assetDataB.assetData;
            let tokenAddress = assetData.substring(Math.max(assetData.length - 40, 0), assetData.length);
            tokenAddress = '0x' + tokenAddress;
            return tokenAddress.toLowerCase();
        }));
        })
    return availableCoins;
  }

  fetchAndRenderRecommendedCoins = async () => {
    const availableCoins = await this._fetchAvailableCoinsOn0x();
    const imgStyle = {height: '24px', width: '24px'};
    fetch(this.getApiUrl()).then(
      results => {
        return results.json();
      }).then(data => {
        let coins = data.map( coin => {
        let potentialBuyButton;
        if (availableCoins.has(coin.address)) {
          potentialBuyButton = 
            <button
              className='btn btn-primary buy-button'
              onClick={this.renderZeroExInstant.bind(this, coin.address)}
            >Buy</button>;
        }
        return (
          <tr key={coin.symbol}>
            <td className='iconCell'>
              <img
                className='tokenIcon'
                src={this.getTokenIcon(coin.address)}
                alt={coin.symbol}
                style={imgStyle}
                >
              </img>
            </td>
            <td className='align-middle'>
              {coin.name + " (" + coin.symbol + ")"} 
            </td>
            <td className='align-middle'>{potentialBuyButton}</td>
          </tr>
          )
        })
        this.setState({coins, loading: false});
        console.log("coins", this.state.coins);
      }).catch(
        error => {
          return (<tr><td>Error</td></tr>)
      }
      )
  }

  componentDidMount() {
    this.fetchAndRenderRecommendedCoins();
  };

  render() {
    if (this.state.loading) {
      return (
      <div class="d-flex justify-content-center">
        <div class="spinner-border text-primary justify-content-center" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      )
    } else {
    return (
      <React.Fragment>
      <div className='row mt-5 justify-content-center'>
        <h2 className='display-4'>Recommended coins</h2>
      </div>
      <div className='row justify-content-center'>
        <p className='lead'>for {this.props.address}</p>
      </div>
      <div className='row mt-4 justify-content-center'>
        <div className='col-5' id='coins'>
          <table className='table table-borderless'>
            <tbody>
              {this.state.coins}
            </tbody>
          </table>
        </div>
      </div>
      <div className='row justify-content-center'>
        <span className='col-6 mb-4 small text-center' id='explanation'>
        These recommendations are not investment advice; 
  a machine-learning model has been trained to make statistical associations between tokens and wallets.
  To learn more about how it recommends tokens based on your transaction history, check out&nbsp;
          <a href='https://medium.com/@ASvanevik/machine-learning-on-ethereum-data-recommending-tokens-5a2a1c779849'>
          this article
          </a>
        </span>
      </div>
      <div className='row justify-content-center'>
        <button className='btn btn-secondary' onClick={this.props.reset.bind(this)}>Back</button>
      </div>
      </React.Fragment>
    )
  }
}
}

export default Recommendations
