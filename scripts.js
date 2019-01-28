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

const app = document.getElementById('coins');

var request = new XMLHttpRequest();
request.open('GET', getApiUrl(), true);
request.onload = function () {
  var a = getWalletAddress();
  if (a != undefined) {

    const container = document.createElement('table');
    container.classList.add("table");
    container.classList.add("table-borderless");

    app.appendChild(container);


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

        container.appendChild(row);
        row.appendChild(icon);
        row.appendChild(name);
        //row.appendChild(score);
        //score.appendChild(scoreText);
        row.appendChild(buyButton);

      });
      back = document.createElement('button');
      back.addEventListener("click", function(event){
        event.preventDefault();
        window.history.back();
    });
      back.textContent = "Back";
      back.classList.add('btn');
      back.classList.add('btn-secondary');
      app.appendChild(back);
    } else {
      const errorMessage = document.createElement('marquee');
      errorMessage.textContent = `Gah, it's not working!`;
      app.appendChild(errorMessage);
    }
  } else {
    const form = document.createElement('form');
    form.classList.add('form-inline');
    const input = document.createElement('input');
    const button = document.createElement('button');
    input.placeholder = "Ethereum wallet ... ";
    button.textContent = "Submit";
    button.classList.add('btn');
    button.classList.add('btn-primary');
    button.addEventListener("click", function(event){
      event.preventDefault();
      location.href = location.href + "?a=" + input.value;
    });
    
    app.appendChild(form);
    form.appendChild(input);
    form.appendChild(button);
}
}

request.send();