// this "price tier" fee is based on volume traded (reduces over time)
// more info here: https://help.coinbase.com/en/pro/trading-and-funding/trading-rules-and-fees/fees
const txFeePercent = 0.0015;
const upperPrice = document.getElementById('upper-price');
const lowerPrice = document.getElementById('lower-price');
const moneyIn = document.getElementById('money-in');
const calcBtn = document.getElementById('calculate');
const output = document.getElementById('output');

const validateInputs = () => {
  if (!upperPrice.value || !lowerPrice.value || !moneyIn.value) {
  	alert('Please fill in all fields');
    return false;
  }

  return true;
}

calcBtn.addEventListener('click', () => {
	if (!validateInputs()) {
  	return false;
  }
	const fee = txFeePercent * moneyIn.value;
  const gainPercentage = upperPrice.value / lowerPrice.value;
  output.innerText = (
  	`without buy $${(((gainPercentage * moneyIn.value) - fee) - moneyIn.value).toFixed(2)} 
 		with buy $${(((gainPercentage * moneyIn.value) - (fee * 2)) - moneyIn.value).toFixed(2)}`
  );
});