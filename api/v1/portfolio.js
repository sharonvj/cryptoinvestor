const express = require('express');
const axios = require('axios');
const fileReader = require('../utils/filereader');
const {
  sort,
  search,
  group,
} = require('../utils/common');

const router = express.Router();

/**
 * Method for Get Exchange of crypto currencies
 * @param {cryptoCurrencies} - list of cryptoCurrencies
 * @param {otherCurrencies} - list of other currencies
 * @returns {exchange rates}
 */

const getExchangeRates = (cryptoCurrencies, otherCurrencies) => {
  const endpoints = cryptoCurrencies.map((cryptoCurrency) => `https://min-api.cryptocompare.com/data/price?fsym=${cryptoCurrency}&tsyms=${otherCurrencies.join()}`);
  const promise = new Promise((resolve) => {
    axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
      (response) => {
        const rates = {};
        response.forEach((each) => {
          const url = new URL(each.config.url);
          const fsym = url.searchParams.get('fsym');

          rates[fsym] = each.data;
        });

        resolve(rates);
      },
    );
  });

  return promise;
};

/**
 * Method for Get all portfolios
 * @returns {list of portfolios}
 */
const getAllPortfolios = () => {
  const promise = new Promise((resolve, reject) => {
    const csvSchema = ['timestamp', 'transaction_type', 'token', 'amount'];
    fileReader.readCsvFile('transactions.csv', csvSchema).then((result) => {
      resolve(result);
    }, (err) => {
      reject(err)
    });
  });

  return promise;
};

/**
 * REST API endpoint method for get all portfolios
 * @param {*} REST API request
 * @returns {latest portfolios}
 */

const handleAllPortFolios = (req, res, next) => {
  getAllPortfolios().then((result) => {
    res.locals.portFolios = result;
    next();
  }, (error) => {
     res.status(200).send(error);
  });
};

/**
 * REST API endpoint method for exchangeRate
 * @param {*} REST API request
 * @returns {latest portfolios}
 */

const handleExchangeRates = (req, res, next) => {
  const { portFolios } = res.locals;
  const cryptoCurrencies = Object.keys(group(portFolios));
  const otherCurrencies = ['USD'];

  getExchangeRates(cryptoCurrencies, otherCurrencies).then((result) => {
    res.locals.exchgeRates = result;
    next();
  });
};

/**
 * REST API endpoint method
 * @param {*} REST API request
 * @returns {latest portfolios}
 */

const latestPortfolios = (req, res) => {
  const { portFolios, exchgeRates } = res.locals;
  const sortedPortfolio = sort(portFolios, 'timestamp');

  let response = sortedPortfolio.reduce((acc, currentValue) => {
    if (!acc[currentValue.token]) {
      const usdExchangeRate = exchgeRates[currentValue.token].USD;
      const withCurrencyRate = { ...currentValue, usdExchangeRate, amountInUsd: currentValue.amount * usdExchangeRate };

      (acc[currentValue.token] = acc[currentValue.token] || []).push(withCurrencyRate);
    }

    return acc;
  }, {});

  if (req.params.token) {
    response = response[req.params.token.toUpperCase()];
  }

  res.status(200).send(response);
};

/**
 * REST API endpoint method
 * @param {*} REST API request
 * @returns {portfolios}
 */

const searchPortfolios = (req, res) => {
  const { portFolios, exchgeRates } = res.locals;
  const searchedPortfolio = search(portFolios, 'timestamp', req.params.timestamp);
  const withExchangeRate = searchedPortfolio.map((each) => {
    const usdExchangeRate = exchgeRates[each.token].USD;

    return {
      ...each,
      amountInUsd: each.amount * usdExchangeRate,
    };
  });

  let response = group(withExchangeRate, 'token');

  if (req.params.token) {
    response = response[req.params.token.toUpperCase()];
  }

  res.status(200).send(response);
};

router.get('/latest/:token?', handleAllPortFolios, handleExchangeRates, latestPortfolios);
router.get('/search/:timestamp/:token?', handleAllPortFolios, handleExchangeRates, searchPortfolios);

module.exports = router;
