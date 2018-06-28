import Database from './idb';

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
      console.error(
        'You need to specify both arguments for the node to be created correctly.',
      );
    }

    const node = document.createElement(nodeType);
    node.innerText = currency;

    return node;
  }

  /**
   * Add each currency to both select HTML Elements on the DOM
   */
  function addCurrenciesToDOM(arrayOfCurrencies) {
    if (
      arrayOfCurrencies.length === 0 ||
      typeof arrayOfCurrencies === 'undefined'
    ) {
      console.error('Currency array cannot be empty or undefined.');
    }

    const nodeTypeToCreate = 'option';

    arrayOfCurrencies.map(currency => {
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

    // This will fetch the data from the API if we don't have a cached version
    fetch(url, {
      cache: 'default',
    })
      .then(res => res.json())
      .then(data => {
        const arrayOfCurrencies = Object.keys(data.results).sort();

        // Save currency list to IndexedDB to be used when the user is offline
        Database.saveCurrencyArray('allCurrencies', arrayOfCurrencies);

        addCurrenciesToDOM(arrayOfCurrencies);
      })
      .catch(err => {
        console.error(
          `The following error occured while trying to get the list of currencies. ${err}`,
        );
        // Get currency exchange rate when the user is offline
        Database.getCurrencies('allCurrencies').then(arrayOfCurrencies => {
          if (typeof arrayOfCurrencies === 'undefined') return;
          addCurrenciesToDOM(arrayOfCurrencies);
        });
      });
  }

  /**
   * Fetch the exchange rate between two currencies
   */
  function fetchCurrencyRate(url, queryString) {
    if (arguments.length !== 2) {
      console.error('You need to specify both arguments for fetch to work.');
    }

    const inputAmount = getInputAmount();

    fetch(url, {
      cache: 'default',
    })
      .then(res => res.json())
      .then(data => {
        const exchangeRate = Object.values(data);

        // Save currency exchange rate to IndexedDB to be used when the user is offline
        Database.saveCurrencies(queryString, exchangeRate);

        calculateExchangeRate(...exchangeRate, inputAmount);
      })
      .catch(err => {
        console.error(
          `The following error occured while trying to get the conversion rate. ${err}`,
        );
        // Get currency exchange rate when the user is offline
        Database.getCurrencies(queryString).then(data => {
          if (typeof data === 'undefined') return;
          calculateExchangeRate(data, inputAmount);
        });
      });
  }

  /**
   * Build the API URL to use to get the conversion rate for a specific set of currencies
   */
  function buildAPIUrl(queryString) {
    if (typeof queryString === 'undefined') {
      console.error('The parameter passed to the function is undefined.');
    }

    const currencyUrl = `https://free.currencyconverterapi.com/api/v5/convert?q=${queryString}&compact=ultra`;
    return currencyUrl;
  }

  /**
   * Get the two currencies selected in the DOM and get the exchange rate
   */
  function getExchangeRate() {
    const currency1 = document.querySelector('.currency__convert-from').value;
    const currency2 = document.querySelector('.currency__convert-to').value;

    const currencyQueryString = `${currency1}_${currency2}`;

    const url = buildAPIUrl(currencyQueryString);
    fetchCurrencyRate(url, currencyQueryString);
  }

  /**
   * Detect if the enter button has been pressed and get the exchange rate
   */
  function detectEnterPressed(event) {
    if (typeof event === 'undefined') {
      console.error(
        "Most likely the DOM key event listener wasn't started. 'Enter' key will not fire.",
      );
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
      console.error(
        'You need to specify both arguments for the exchange rate to be calculated correctly.',
      );
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
