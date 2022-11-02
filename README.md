#INTRODUCTION
------------

Let us assume you are a crypto investor. You have made transactions over a period of time which is logged in a CSV file. we need to process the data 


#REQUIREMENTS
------------

Write a command line program that does the following

1. Given no parameters, return the latest portfolio value per token in USD

2. Given a token, return the latest portfolio value for that token in USD

3. Given a date, return the portfolio value per token in USD on that date

4. Given a date and a token, return the portfolio value of that token in USD on that date


#RECOMMENDED MODULES
-------------------

"axios": "^1.1.3",
"csv-parser": "^3.0.0",
"express": "^4.18.2",
"fs": "^0.0.1-security"


#DESIGN OVERVIEW
---------------
  Code Flow
  app.js => v1/index.js => portfolio 



  A. app.js

     Entry point. express server is running on 3000 port

  B. v1/index.js

      Routing file


  C. portfolio 

      Here 2 endpoints are available


        1. router.get('/latest/:token', handleAllPortFolios, handleExchangeRates, latestPortfolios);

        2. router.get('/search/:timestamp/:token', handleAllPortFolios, handleExchangeRates, searchPortfolios);


        In which different methods are avilable

         handleAllPortFolios => fetach all portfolio from csv

         handleExchangeRates => Get latest exchange rate 

         latestPortfolios => get latest portfolios

         searchPortfolios => search portfolio by token & time


We have utils folder

    Contain two files

      1. common.js which is contain common method like sort, search, group by

      2. filereader which is responsible for csv reading.


#INSTALLATION
------------
 
 * install dependencies by

    npm install
    

#EXCUTION STEPS
------------
Go to CryptoInvestors directory

1. Open a terminal 

2. Run node app.js

3. Open another terminal 

4. To get latest portfolio value per token in USD - 
   
   Run `curl http://localhost:3000/api/v1/portfolio/latest`

5.  To get latest portfolio value for given token in USD

   Run `curl http://localhost:3000/api/v1/portfolio/latest/<token>`

   ex. `curl http://localhost:3000/api/v1/portfolio/latest/1571967208`

6. To get portfolio value per token in USD on given date
  
   Run `curl http://localhost:3000/api/v1/portfolio/search/<timestamp>`

   ex. `curl http://localhost:3000/api/v1/portfolio/search/1571967208`

6. To get portfolio value per token in USD on given date & token
   
   Run `curl http://localhost:3000/api/v1/portfolio/search/<timestamp>/<token>`

   ex. `curl http://localhost:3000/api/v1/portfolio/search/1571967208/BTC`

#MAINTAINERS
-----------

Current maintainer:
 * Sharon v j - sharonjosephjohn@gmail.com
