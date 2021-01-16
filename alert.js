const addAlertBtn = document.getElementById('add-alert-btn');
const alertsDisplay = document.getElementById('app__left-alerts-display');
const alertsModal = document.getElementById('app__left-alerts-modal');
const addAlertModalCloseBtn = document.getElementById('alerts-modal-close-btn');

const toggleAlertModal = (show) => {
  alertsModal.classList = show ? 'show' : '';
}

addAlertBtn.addEventListener('click', () => {
  toggleAlertModal(true);
});

addAlertModalCloseBtn.addEventListener('click', () => {
  toggleAlertModal(false);
});