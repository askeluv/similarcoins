function compare(a,b) {
  if (a.score < b.score)
    return 1;
  if (a.score > b.score)
    return -1;
  return 0;
}

function convertToZeroExAsset(token_address) {
  var prefix = '0xf47261b0000000000000000000000000';
  return prefix + token_address.substring(2)
}

function getTokenIcon(token_address) {
  return "https://raw.githubusercontent.com/TrustWallet/tokens/master/tokens/" + token_address + ".png"
}

function renderZeroExInstant(token_address) {
  zrxAsset = convertToZeroExAsset(token_address);
  zeroExInstant.render(
      {
          orderSource: 'https://api.relayer.com/sra/v2/',
          availableAssetDatas: [zrxAsset],
          defaultSelectedAssetData: zrxAsset,
          affiliateInfo: {
     feeRecipient: '0x50ff5828a216170cf224389f1c5b0301a5d0a230',
     feePercentage: 0.03
  },
      },
      'body',
  );
  }

const app = document.getElementById('coins');

const apiUrl = 'https://demo2563751.mockable.io/' // placeholder
// old URL: https://ghibliapi.herokuapp.com/films

const container = document.createElement('table');
container.classList.add("table");
container.classList.add("table-borderless");

app.appendChild(container);

var request = new XMLHttpRequest();
request.open('GET', apiUrl, true);
request.onload = function () {

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


      const score = document.createElement('td');
      const scoreText = document.createElement('h4');
      scoreText.textContent = 100 * coin.score;
      scoreText.textContent = scoreText.textContent + "%";

      const buyButton = document.createElement('button');
      zrxCall = "renderZeroExInstant('" + coin.address + "');"
      buyButton.setAttribute("onClick", zrxCall);
      buyButton.textContent = "Buy";
      buyButton.classList.add('btn');
      buyButton.classList.add('btn-primary');

      container.appendChild(row);
      row.appendChild(icon);
      row.appendChild(name);
      row.appendChild(score);
      score.appendChild(scoreText);
      row.appendChild(buyButton);

    });
  } else {
    const errorMessage = document.createElement('marquee');
    errorMessage.textContent = `Gah, it's not working!`;
    app.appendChild(errorMessage);
  }
}

request.send();