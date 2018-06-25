document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const currencyConvertFrom = document.querySelector('.currency_convert_from');
  const currencyConvertTo = document.querySelector('.currency_convert_to');
  const currencyButton = document.querySelector('.convert_currency');
  const originalCurrencyTextArea = document.querySelector(
    'textarea#original_currency',
  );
  const convertedCurrencyTextArea = document.querySelector(
    'textarea#converted_currency',
  );

  /**
   * Create "option" HTML Element and set inline value of the currency
   */
  function createOptionNode(currency) {
    if (currency === 'undefined') {
      return 'Currency parameter cannot be undefined.';
    }

    const optionNode = document.createElement('option');
    optionNode.innerText = currency;

    return optionNode;
  }

  /**
   * Add each currency to both select HTML Elements on the DOM
   */
  function addCurrenciesToDOM(currencies) {
    if (currencies.length === 0 || currencies === 'undefined') {
      return 'Currencies array cannot be empty or undefined.';
    }

    currencies.map(currency => {
      currencyConvertFrom.appendChild(createOptionNode(currency));
      currencyConvertTo.appendChild(createOptionNode(currency));
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
    fetch('https://free.currencyconverterapi.com/api/v5/currencies')
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
   * Fetch the conversion rate between two currencies
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
    const currency1 = document.querySelector('.currency_convert_from').value;
    const currrency2 = document.querySelector('.currency_convert_to').value;

    const url = buildAPIUrl(currency1, currrency2);
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

    originalCurrencyTextArea.value = input;
    convertedCurrencyTextArea.value = convertedCurrency.toFixed(2);
  }

  /**
   * Add event listeners that is needed
   */
  function addEventListeners() {
    currencyButton.addEventListener('click', getExchangeRate);
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
