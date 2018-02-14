let totalBuy = {};
let totalSell = {};
let lastIndex = 0;

$(function () {
  $('#calculate').on('click', function () {
    reset();

    let result = calculate($('#code')[0].value);

    $('#result').html(result);

    if (totalBuy.orders && totalSell.orders) {
      let profitHeader = $('#profit');
      let ratio = totalSell.btc / totalBuy.btc;

      if (ratio < 1) {
        profitHeader.css('color', 'red');
      } else {
        profitHeader.css('color', 'green');
      }
    }
  });
});

function calculate (code) {
  let orders = code
    .replace(/\n+/g, '\n').replace(/\n/g, ' ').replace(/\s+/g, ' ')
    .replace(/^.+?(\d\d\d\d-\d\d-\d\d.+)/, '$1').split(' ');

  $('#result').html(orders);

  orders.forEach((order, index) => {
    if (index < lastIndex) return true;

  if (order.match(/\d\d\d\d-\d\d-\d\d/) && orders[index+5]) {
    lastIndex += 6;

    parseOrder(orders[index], orders[index+1], orders[index+2], orders[index+3], orders[index+4], orders[index+5], orders[index+6]);
  }
});

  let text = '';

  if (totalBuy.orders) {
    text += '<h2>Покупки BUY</h2>';
    text += `Средняя цена: ${(totalBuy.price/totalBuy.orders).toFixed(8)}<br>`;
    text += `Общее кол-во монет: ${totalBuy.amount.toFixed(8)}<br>`;
    text += `Всего потрачено BTC: ${totalBuy.btc.toFixed(8)}<br>`;
  }

  if (totalSell.orders) {
    text += '<h2>Покупки SELL</h2>';
    text += `Средняя цена: ${(totalSell.price/totalSell.orders).toFixed(8)}<br>`;
    text += `Общее кол-во монет: ${totalSell.amount.toFixed(8)}<br>`;
    text += `Всего получено BTC: ${totalSell.btc.toFixed(8)}<br>`;
  }

  if (totalBuy.orders && totalSell.orders) {
    let ratio = totalSell.btc / totalBuy.btc;
    let percent = Math.round(ratio < 1 ? 100 - (100 * (ratio)) : (100 * ratio) - 100)

    text += `<h2 id="profit">Итог: ${(ratio < 1 ? '-' : '') + percent + '%'}</h2>`;
    text += `Всего монет осталось: ${(totalBuy.amount - totalSell.amount).toFixed(8)}<br>`;
    text += `${ratio < 1 ? 'Убыток' : 'Профит'}: ${(totalSell.btc - totalBuy.btc).toFixed(8)} BTC`
  }

  return text;
}

function parseOrder (date, time, pair, type, price, amount, btc) {
  if (type === 'BUY') {
    totalBuy.orders += 1;
    totalBuy.price += parseFloat(price);
    totalBuy.amount += parseFloat(amount);
    totalBuy.btc += parseFloat(btc);
  } else if (type === 'SELL') {
    totalSell.orders += 1;
    totalSell.price += parseFloat(price);
    totalSell.amount += parseFloat(amount);
    totalSell.btc += parseFloat(btc);
  }
}

function reset () {
  totalBuy = {
    orders: 0,
    price: 0,
    amount: 0,
    btc: 0
  };

  totalSell = {
    orders: 0,
    price: 0,
    amount: 0,
    btc: 0
  };

  lastIndex = 0;
}