// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
// DOM Element Selectors
const stateInput = document.querySelector('#state-input') || document.querySelector('input');
const fetchButton = document.querySelector('#fetch-btn') || document.querySelector('button');
const alertsDisplay = document.querySelector('#alerts-display') || document.querySelector('#alerts');
const errorMessage = document.querySelector('#error-message');
const spinnerElement = document.querySelector('#loading-spinner');

// Event Listener for the Submit Button
fetchButton.addEventListener('click', () => {
  const stateAbbr = stateInput.value.trim();
  handleFetchFlow(stateAbbr);
});

// Main orchestration flow
async function handleFetchFlow(state) {
  // 1. Reset previous UI states
  clearError();
  if (alertsDisplay) alertsDisplay.innerHTML = '';
  
  // 2. Input Validation (Bonus)
  if (!state) {
    displayError('Please enter a state abbreviation.');
    stateInput.value = '';
    return;
  }
  
  const stateRegex = /^[A-Z]{2}$/;
  if (!stateRegex.test(state)) {
    displayError('Validation Error: Input must be exactly two capital letters (e.g., NY).');
    stateInput.value = '';
    return;
  }

  // Clear input field immediately after capture as required by tests
  stateInput.value = '';

  try {
    showLoadingSpinner();
    
    // 3. Fetch data from National Weather Service API
    const response = await fetch(`https://api.weather.gov/alerts/active?area=${state}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 4. Render successful data
    renderAlerts(data);
  } catch (error) {
    // 5. Handle errors gracefully
    displayError(error.message);
  } finally {
    hideLoadingSpinner();
  }
}

// Render data to the DOM
function renderAlerts(data) {
  if (!alertsDisplay) return;

  const title = data.title || 'Current watches, warnings, and advisories';
  const count = data.features ? data.features.length : 0;

  // Create Summary Message Line
  const summaryMessage = document.createElement('h3');
  summaryMessage.textContent = `${title}: ${count}`;
  alertsDisplay.append(summaryMessage);

  // If no alerts, stop here
  if (count === 0) {
    const noAlerts = document.createElement('p');
    noAlerts.textContent = 'No active alerts for this area.';
    alertsDisplay.append(noAlerts);
    return;
  }

  // Create List of Headlines
  const listElement = document.createElement('ul');
  data.features.forEach(alert => {
    const headlineText = alert.properties?.headline || 'No headline available';
    const listItem = document.createElement('li');
    listItem.textContent = headlineText;
    listElement.append(listItem);
  });

  alertsDisplay.append(listElement);
}

// Error Handling UI Changes
function displayError(message) {
  if (!errorMessage) return;
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  errorMessage.classList.add('error'); // Bonus styling class
}

function clearError() {
  if (!errorMessage) return;
  errorMessage.textContent = '';
  errorMessage.style.display = 'none';
  errorMessage.classList.remove('error');
}

// Loading Spinner Helpers (Bonus)
function showLoadingSpinner() {
  if (spinnerElement) spinnerElement.style.display = 'block';
}

function hideLoadingSpinner() {
  if (spinnerElement) spinnerElement.style.display = 'none';
}
