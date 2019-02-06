function compare(a,b) {
  if (a.score < b.score)
    return 1;
  if (a.score > b.score)
    return -1;
  return 0;
}

function loadAddressFromWallet() {
  window.addEventListener('load', async () => {
    if (window.ethereum) {
          try {
              await ethereum.enable();
              return window.ethereum.selectedAddress;
          } catch (error) {
              // User denied account access...
          }
      }
  });
}

function getTokenIcon(tokenAddress) {
  return "https://raw.githubusercontent.com/TrustWallet/tokens/master/tokens/" + tokenAddress + ".png";
}

function getWalletAddress() {
  var url = new URL(location.href);
  var a = url.searchParams.get("a");
  if (a != undefined)
    return a.toLowerCase();
}

function setWalletAddress() {
  var a = getWalletAddress();
  document.getElementById('walletAddress').textContent = a;
  return a;
}

function getApiUrl() {
  var tmpWorkaround = "http://allow-any-origin.appspot.com/"
  var apiUrlBase = "https://crypto-etl-ethereum-dev.appspot.com/recommendation?num_recs=5&user_address="
  var address = getWalletAddress();
  return tmpWorkaround + apiUrlBase + address;
}

function renderZeroExInstant(tokenAddress) {
  var feeRecipient = '0x3d0fd32c24799d2ad8143402ea9b7cf86b429fd3';
  var feePercentage = 0.005;
  zrxAsset = zeroExInstant.assetDataForERC20TokenAddress(tokenAddress);
  zeroExInstant.render(
      {
          orderSource: 'https://api.relayer.com/sra/v2/',
          availableAssetDatas: [zrxAsset],
          defaultSelectedAssetData: zrxAsset,
          affiliateInfo: {
     feeRecipient: feeRecipient,
     feePercentage: feePercentage
  },
      },
      'body',
  );
}

function buildInputWalletComponent() {
    var h1content = "Recommended Tokens For Your Wallet";
    var h1subcontent = `Get personalized ERC20 tokens from a machine-learning model trained on your blockchain transactions. Try it out:`;

    const app = document.getElementById('appContainer');
    const landingHeader = document.createElement('div');
    landingHeader.classList.add('main-header');
    landingHeader.classList.add('px-3');
    landingHeader.classList.add('py-3');
    landingHeader.classList.add('pt-md-5');
    landingHeader.classList.add('pp-md-4');
    landingHeader.classList.add('mx-auto');
    landingHeader.classList.add('text-center');
    const h1 = document.createElement('h1');
    h1.classList.add('display-4');
    h1.classList.add('m-4');
    h1.textContent = h1content;
    const headerP = document.createElement('p');
    headerP.classList.add('lead');
    headerP.textContent = h1subcontent;

    const form = document.createElement('form');
    form.classList.add('form');

    const inputDiv = document.createElement('div');
    inputDiv.classList.add('form-label-group');
    inputDiv.classList.add('row');
    inputDiv.classList.add('mb-4');
    inputDiv.classList.add('justify-content-center');

    const input = document.createElement('input');
    input.placeholder = "Ethereum address ... ";
    input.classList.add('form-control');
    input.classList.add('col-5');

    window.addEventListener('load', async () => {

    if (window.ethereum) {
          try {
              await window.ethereum.enable();
              input.value = window.ethereum.selectedAddress;
          } catch (error) {
              
          }
      }
      else if (window.web3 && window.web3.selectedAddress) {
        input.value = window.web3.selectedAddress;
    }
    });
    
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('row');
    buttonDiv.classList.add('justify-content-center');

    const button = document.createElement('button');
    button.textContent = "Submit";
    button.classList.add('btn');
    button.classList.add('btn-primary');
    button.classList.add('col-2');
    
    button.addEventListener("click", function(event){
      event.preventDefault();
      location.href = location.href + "?a=" + input.value;
    });
    
    app.appendChild(landingHeader);
    landingHeader.appendChild(h1);
    landingHeader.appendChild(headerP);

    app.appendChild(form);
    form.appendChild(inputDiv);
    inputDiv.appendChild(input);
    form.appendChild(buttonDiv);
    buttonDiv.appendChild(button);
}

function buildRecommendationsComponent() {
  const app = document.getElementById('appContainer');
  var request = new XMLHttpRequest();
  request.open('GET', getApiUrl(), true);
  request.onload = function () {

      const rowHeader = document.createElement('div');
      rowHeader.classList.add('row');
      rowHeader.classList.add('mt-5');
      rowHeader.classList.add('justify-content-center');
      const h2 = document.createElement('h2');
      h2.textContent = "Recommended coins";
      h2.classList.add('display-4');

      const rowLead = document.createElement('div');
      rowLead.classList.add('row');
      rowLead.classList.add('justify-content-center');
      const h2sub = document.createElement('p');
      h2sub.textContent = "for " + a;
      h2sub.classList.add('lead');

      const rowCoins = document.createElement('div');
      rowCoins.classList.add('row');
      rowCoins.classList.add('mt-4');
      rowCoins.classList.add('justify-content-center');
      const coins = document.createElement('div');
      coins.classList.add('col-5');
      coins.id = "coins";

      const table = document.createElement('table');
      table.classList.add("table");
      table.classList.add("table-borderless");

      const rowExplanation = document.createElement('div');
      rowExplanation.classList.add('row');
      rowExplanation.classList.add('justify-content-center');
      const explanation = document.createElement('span');
      explanation.classList.add("col-6");
      explanation.classList.add("mb-4");
      explanation.classList.add("small");
      explanation.textContent = `These recommendations are not investment advice; 
      a machine-learning model has been trained to make statistical associations between tokens and wallets.
      To learn more about how it recommends tokens based on your transaction history, check out `;
      explanation.classList.add("text-center");
      const mediumLink = document.createElement('a');
      mediumLink.textContent = "this article.";
      mediumLink.href = "https://medium.com/"; // TODO

      const rowBack = document.createElement('div');
      rowBack.classList.add('row');
      rowBack.classList.add('justify-content-center');

      const back = document.createElement('a');
      back.textContent = "Back";
      back.href = "/";

      app.appendChild(rowHeader);
      rowHeader.appendChild(h2);
      rowHeader.appendChild(h2sub);
      app.appendChild(rowLead);
      rowLead.appendChild(h2sub);
      app.appendChild(rowCoins);
      rowCoins.appendChild(coins);
      coins.appendChild(table);
      app.appendChild(rowExplanation);
      rowExplanation.appendChild(explanation);
      explanation.appendChild(mediumLink);
      app.appendChild(rowBack)
      rowBack.appendChild(back);


      // Begin accessing JSON data here
      var data = JSON.parse(this.response);
      data.sort(compare);
      if (request.status >= 200 && request.status < 400) {
        data.forEach(coin => {
          const row = document.createElement('tr');

          const iconCell = document.createElement('td');
          iconCell.classList.add('align-middle');
          const icon = document.createElement('img');
          icon.class = "tokenIcon";
          icon.style.height = '24px';
          icon.style.width = '24px';
          icon.src = getTokenIcon(coin.address);

          const name = document.createElement('td');
          name.classList.add('align-middle');
          name.textContent = coin.name + " (" + coin.symbol + ")";


          //const score = document.createElement('td');
          //const scoreText = document.createElement('h4');
          //scoreText.textContent = coin.rating;
          //scoreText.textContent = scoreText.textContent + "%";

          const buyButtonCell = document.createElement('td');
          buyButtonCell.classList.add('align-middle');
          const buyButton = document.createElement('button');
          zrxCall = "renderZeroExInstant('" + coin.address + "');"
          buyButton.setAttribute("onClick", zrxCall);
          buyButton.textContent = "Buy";
          buyButton.classList.add('btn');
          buyButton.classList.add('btn-primary');
          buyButton.classList.add('buy-button');

          table.appendChild(row);
          row.appendChild(iconCell);
          iconCell.appendChild(icon);
          row.appendChild(name);
          //row.appendChild(score);
          //score.appendChild(scoreText);
          row.appendChild(buyButtonCell);
          buyButtonCell.appendChild(buyButton);

        });
      } else {
        const errorMessage = document.createElement('marquee');
        errorMessage.textContent = `Error:`;
        app.appendChild(errorMessage);
      }
    } 
  request.send();
}

var a = getWalletAddress();
if (a === undefined)
  buildInputWalletComponent();
else
  buildRecommendationsComponent();