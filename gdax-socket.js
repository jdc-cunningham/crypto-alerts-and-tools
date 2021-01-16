// const gdaxSocket = new WebSocket("wss://ws-feed.gdax.com");
const subscribeJson = {
  type: "subscribe",
  product_ids: [
    "BTC-USD"
  ],
  channels: [
    "ticker"
  ]
};

// gdaxSocket.onopen = (event) => {
//   gdaxSocket.send(JSON.stringify(subscribeJson));
// };

// gdaxSocket.onmessage = (event) => {
//   console.log(event.data);
// };