/**
 * Register Service Worker
 */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(() => {
    console.log('Service Worker Registered');
  });
}

/**
 * Add all the logic of the website in the DOMContentLoaded Event Listener
 */
document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const currencyConvertFrom = document.querySelector('.currency__convert-from');
  const currencyConvertTo = document.querySelector('.currency__convert-to');
  const button = document.querySelector('.convert');
  const originalCurrencyInputField = document.querySelector(
    'input#original_amount',
  );
  const convertedCurrencyInputField = document.querySelector(
    'input#converted_amount',
  );

  /**
   * Create HTML Element and set inline value of the currency
   */
  function createNode(nodeType, currency) {
    if (arguments.length !== 2) {
      return 'You need to specify both arguments for the node to be created correctly.';
    }

    const node = document.createElement(nodeType);
    node.innerText = currency;

    return node;
  }

  /**
   * Add each currency to both select HTML Elements on the DOM
   */
  function addCurrenciesToDOM(currencies) {
    if (currencies.length === 0 || currencies === 'undefined') {
      return 'Currencies array cannot be empty or undefined.';
    }

    const nodeTypeToCreate = 'option';

    currencies.map(currency => {
      currencyConvertFrom.appendChild(createNode(nodeTypeToCreate, currency));
      currencyConvertTo.appendChild(createNode(nodeTypeToCreate, currency));
    });
  }

  /**
   * Get amount in the input field
   */
  function getInputAmount() {
    const inputAmount = document.querySelector('input#amount').value;
    return inputAmount;
  }

  /**
   * Get a list of all the currencies using the API
   */
  function fetchListOfCurrencies() {
    const url = 'https://free.currencyconverterapi.com/api/v5/currencies';

    // Before we fetch from the API itself, check if we don't have a cached version locally
    if ('caches' in window) {
      caches.match(url).then(response => {
        if (response) {
          response.json().then(data => {
            const currencies = Object.keys(data.results).sort();

            addCurrenciesToDOM(currencies);
          });
        }
      });

      return;
    }

    // This will fetch the data from the API if we don't have a cached version
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const currencies = Object.keys(data.results).sort();

        addCurrenciesToDOM(currencies);
      })
      .catch(err =>
        console.error(
          `The following error occured while trying to get the list of currencies. ${err}`,
        ),
      );
  }

  /**
   * Fetch the exchange rate between two currencies
   */
  function fetchCurrencyRate(url) {
    if (url === 'undefined') {
      return 'URL Parameter cannot be undefined.';
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const inputAmount = getInputAmount();
        const exchangeRate = Object.values(data);

        calculateExchangeRate(...exchangeRate, inputAmount);
      })
      .catch(err =>
        console.error(
          `The following error occured while trying to get the conversion rate. ${err}`,
        ),
      );
  }

  /**
   * Build the API URL to use to get the conversion rate for a specific set of currencies
   */
  function buildAPIUrl(curr1, curr2) {
    if (arguments.length !== 2) {
      return 'You need to specify both arguments for the URL to be built correctly.';
    }

    const currencyUrl = `https://free.currencyconverterapi.com/api/v5/convert?q=${curr1}_${curr2}&compact=ultra`;
    return currencyUrl;
  }

  /**
   * Get the two currencies selected in the DOM and get the exchange rate
   */
  function getExchangeRate() {
    const currency1 = document.querySelector('.currency__convert-from').value;
    const currency2 = document.querySelector('.currency__convert-to').value;

    const url = buildAPIUrl(currency1, currency2);
    fetchCurrencyRate(url);
  }

  /**
   * Detect if the enter button has been pressed and get the exchange rate
   */
  function detectEnterPressed(event) {
    if (event === 'undefined') {
      return "Most likely the DOM key event listener wasn't started. 'Enter' key will not fire.";
    }

    if (event.keyCode === 13) {
      getExchangeRate();
    }
  }

  /**
   * Calculate the exchange rate based on the amount entered and the currencies selected
   */
  function calculateExchangeRate(exchangeRate, input) {
    if (arguments.length !== 2) {
      return 'You need to specify both arguments for the exchange rate to be calculated correctly.';
    }

    const convertedCurrency = input * exchangeRate;

    originalCurrencyInputField.value = input;
    convertedCurrencyInputField.value = convertedCurrency.toFixed(2);
  }

  /**
   * Add event listeners that is needed
   */
  function addEventListeners() {
    button.addEventListener('click', getExchangeRate);
    body.addEventListener('keydown', e => detectEnterPressed(e));
  }

  /**
   * Add Event Listeners and get the currencies to display on the DOM
   */
  function init() {
    addEventListeners();
    fetchListOfCurrencies();
  }

  init();
});
