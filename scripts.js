function compare(a,b) {
  if (a.score < b.score)
    return 1;
  if (a.score > b.score)
    return -1;
  return 0;
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
  zrxAsset = zeroExInstant.assetDataForERC20TokenAddress(tokenAddress);
  zeroExInstant.render(
      {
          orderSource: 'https://api.relayer.com/sra/v2/',
          availableAssetDatas: [zrxAsset],
          defaultSelectedAssetData: zrxAsset,
          affiliateInfo: {
     feeRecipient: '0x50ff5828a216170cf224389f1c5b0301a5d0a230', // TODO: replace!
     feePercentage: 0.001
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
    input.placeholder = "Ethereum wallet ... ";
    input.classList.add('form-control');
    input.classList.add('col-5');
    
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

      const row1 = document.createElement('div');
      row1.classList.add('row');
      row1.classList.add('mt-5');
      row1.classList.add('justify-content-center');
      const h2 = document.createElement('h2');
      h2.textContent = "Recommended coins";
      h2.classList.add('display-4');

      const row2 = document.createElement('div');
      row2.classList.add('row');
      row2.classList.add('justify-content-center');
      const h2sub = document.createElement('p');
      h2sub.textContent = "for " + a;
      h2sub.classList.add('lead');

      const rowCoins = document.createElement('div');
      rowCoins.classList.add('row');
      rowCoins.classList.add('m-4');
      rowCoins.classList.add('justify-content-center');
      const coins = document.createElement('div');
      coins.classList.add('col-5');
      coins.id = "coins";

      const table = document.createElement('table');
      table.classList.add("table");
      table.classList.add("table-borderless");

      const row4 = document.createElement('div');
      row4.classList.add('row');
      row4.classList.add('justify-content-center');


      const back = document.createElement('a');
      back.textContent = "Back";
      back.href = "/";

      app.appendChild(row1);
      row1.appendChild(h2);
      row1.appendChild(h2sub);
      app.appendChild(row2);
      row2.appendChild(h2sub);
      app.appendChild(rowCoins);
      rowCoins.appendChild(coins)
      coins.appendChild(table)
      app.appendChild(row4)
      row4.appendChild(back);


      // Begin accessing JSON data here
      var data = JSON.parse(this.response);
      data.sort(compare);
      if (request.status >= 200 && request.status < 400) {
        data.forEach(coin => {
          const row = document.createElement('tr');

          const icon = document.createElement('img');
          icon.class = "tokenIcon";
          icon.style.height = '24px';
          icon.style.width = '24px';
          icon.src = getTokenIcon(coin.address);

          const name = document.createElement('td');
          name.textContent = coin.name + " (" + coin.symbol + ")";


          //const score = document.createElement('td');
          //const scoreText = document.createElement('h4');
          //scoreText.textContent = coin.rating;
          //scoreText.textContent = scoreText.textContent + "%";

          const buyButton = document.createElement('button');
          zrxCall = "renderZeroExInstant('" + coin.address + "');"
          buyButton.setAttribute("onClick", zrxCall);
          buyButton.textContent = "Buy";
          buyButton.classList.add('btn');
          buyButton.classList.add('btn-primary');

          table.appendChild(row);
          row.appendChild(icon);
          row.appendChild(name);
          //row.appendChild(score);
          //score.appendChild(scoreText);
          row.appendChild(buyButton);

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