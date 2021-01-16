const storageName = 'crypto-alerts';
const alertsContainer = document.getElementById('app__left-alerts');
const addAlertBtn = document.getElementById('add-alert-btn');
const alertsDisplay = document.getElementById('app__left-alerts-display');
const alertsModal = document.getElementById('app__left-alerts-modal');
const alertsModalNameInput = document.getElementById('alerts-modal-name');
const alertsModalPriceInput = document.getElementById('alerts-modal-price');
const addAlertModalCloseBtn = document.getElementById('alerts-modal-close-btn');
const alertsModalAddBtn = document.getElementById('alerts-modal-add-btn');

const getEntries = () => {
  const storedValue = localStorage.getItem(storageName);
  const entries = storedValue ? JSON.parse(storedValue) : null;
  return entries;
};

const toggleAlertModal = (show) => {
  alertsModal.classList = show ? 'show' : '';
};

addAlertBtn.addEventListener('click', () => {
  toggleAlertModal(true);
});

addAlertModalCloseBtn.addEventListener('click', () => {
  toggleAlertModal(false);
});

const alertFieldsValid = (name, price) => {
  if (!name || !price) {
    return false;
  }

  return true;
}

const stripDecimal = (val) => {
  const valStr = val.toString()

  if (valStr.indexOf('.') !== -1) {
    return parseInt(valStr.split('.')[0]);
  }

  return parseInt(val);
};

// straight outta SO
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const makeId = (length) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;

  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const clearModalFields = () => {
  alertsModalNameInput.value = '';
  alertsModalPriceInput.value = '';
}

const addAlert = (name, price) => {
  if (!alertFieldsValid(name, price)) {
    alert('Please make sure both fields are not empty.');
    return;
  };

  const entries = getEntries();
  // this method it's not impossible to get matches but with one-way advancing time I think it's fine
  const newEntryId =  Date.now() + makeId(12); // overkill entropy with 12

  if (entries && entries.length) {
    if (entries.find(entry => (entry.name === name || entry.price === price))) {
      alert('this alert name or price already exists');
    } else {
      // repeated code
      entries.push({
        id: newEntryId,
        name,
        price: stripDecimal(price)
      });
      localStorage.setItem(storageName, JSON.stringify(entries));
    }
  } else {
    const newEntries = [];
    newEntries.push({
      id: newEntryId,
      name,
      price: stripDecimal(price)
    });
    localStorage.setItem(storageName, JSON.stringify(newEntries));
  }

  toggleAlertModal(false);
  loadAlerts();
  clearModalFields();
}

// https://stackoverflow.com/questions/13236651/allowing-only-alphanumeric-values/13237018
const alphaNumCheck = (val) => {
  var regex = new RegExp("^[a-zA-Z0-9]+$");

  if (regex.test(val)) {
    return val;
  }

  return "";
}

alertsModalAddBtn.addEventListener('click', () => {
  addAlert(
    alphaNumCheck(alertsModalNameInput.value).toUpperCase(),
    alphaNumCheck(alertsModalPriceInput.value)
  );
});

const loadAlerts = () => {
  const entries = getEntries();

  if (entries && entries.length) {
    // hopefully... XSS prevented with alphanum check on input, I needed HTML output for remove btn
    alertsDisplay.innerHTML = '';
    entries.forEach(entry => {
      alertsDisplay.innerHTML += `<span class="alert-row"><p>${entry.name} $${entry.price.toLocaleString('en')}</p>
                                  <button type="button" id="${entry.id}" class="alert-remove-btn">remove</button></span>`;
    });
  } else {
    alertsDisplay.innerHTML = "<p>No alerts</p>";
  }
}

loadAlerts();

document.addEventListener('click', (e) => {
  if (e.target.className === "alert-remove-btn") {
    const rowId = e.target.id;
    const entries = getEntries();
    entries.forEach((entry, index) => { // full loop but not a huge data set
      if (entry.id === rowId) {
        entries.splice(index, 1);
      }
    });

    localStorage.setItem(storageName, JSON.stringify(entries));
    loadAlerts();
  }
});

// this button is to make sure notifications are enabled
if (Notification.permission !== "granted") {
  const allowNotificationsBtn = document.getElementById('allow-alerts-btn');
  allowNotificationsBtn.classList = '';
  allowNotificationsBtn.addEventListener('click', () => {
    notify('Thanks for enabling desktop notifications.');
  });
}