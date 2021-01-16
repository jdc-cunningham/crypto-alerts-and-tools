/**
 * This is going to check against alerts saved by the alert.js script which
 * stores into localStorage
 */

const gdaxSocket = new WebSocket("wss://ws-feed.gdax.com");
const subscribeJson = {
  type: "subscribe",
  product_ids: [
    "BTC-USD"
  ],
  channels: [
    "ticker"
  ]
};
const priceDisplay = document.getElementById('app__right-ticker-prices');

// Desktop browser notifications from MDN docs
const notify = (notificationStr) => {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(notificationStr);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(notificationStr);
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}

const checkAlert = (price) => {
  const storedValue = localStorage.getItem(storageName);
  const entries = storedValue ? JSON.parse(storedValue) : null;

  if (entries && entries.length) {
    entries.forEach((entry, index) => { // full loop but not a huge data set

      if (entry.price ===  parseInt(price.split(',').join(''))) { // this is nasty
        notify(`BTC price alert $${price}`)
        entries.splice(index, 1);
      }
    });

    localStorage.setItem(storageName, JSON.stringify(entries));
    loadAlerts();
  }
};

gdaxSocket.onopen = (event) => {
  gdaxSocket.send(JSON.stringify(subscribeJson));
};

gdaxSocket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.price) {
    priceDisplay.innerText = `BTC price $${parseInt(data.price).toLocaleString('en')}`;

    checkAlert(parseInt(data.price).toLocaleString('en'));
  }
};