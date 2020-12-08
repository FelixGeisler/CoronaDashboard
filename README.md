# CoronaDashboard

## Build Status

[![GitHub Node](https://github.com/FelixGeisler/CoronaDashboard/workflows/Node.js%20CI/badge.svg)](https://github.com/actions/starter-workflows)  
[![GitHub Super-Linter](https://github.com/FelixGeisler/CoronaDashboard/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/marketplace/actions/super-linter)

[![GitHub Commits](https://img.shields.io/github/commit-activity/w/FelixGeisler/CoronaDashboard)](https://github.com/FelixGeisler/CoronaDashboard/commits/main)

## API

We query the API of the [RKI](https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0) every hour and store the received data in our database. It is possible to make specific queries to our database via our API.

The route to the api is: `/api/:date?/:level1?/:level2?`

### Get all data

To select all data call `/api`
<br>

### Filter by Date

It is possible to filter the data by a specific day (`/api/yyyy-mm-dd`), month (`/api/yyyy-mm`) or year (`/api/yyyy`).
You can also specify a date range e.g.: `/api/yyyy-mm-dd_yyyy-mm-dd`, `/api/yyyy-mm_yyyy`, `/api/yyyy-mm-dd_` (given startDate till today), etc...
<br>

### Filter by Admin_Level_1

To filter the data by Admin_Level_1 (e.g. Bundesland) specify it in the link: e.g. `/api/yyyy-mm-dd/Baden-Württemberg/`
<br>

### Filter by Admin_Level_2

To filter the data by a Admin_Level_2 (e.g. Landkreis) specify it in the link: e.g. `/api/yyyy-mm-dd/Baden-Württemberg/LKZollernalbkreis`
<br>

## Software Architecture

### Use-Case-Diagram

<div align='center'>
<img src='http://www.plantuml.com/plantuml/png/XO_1JeD048Rl-nH_wWKExGCOqbJbuas3nFCKHjXqsMrc5xKQtrsd6e6BNWZ_zq--cTt5H9B6mHd7JmafG6pN9xHMk4asU1CFrXz9QC2HcWDr7DF9CRGctpas5Sip2oYYCjIa8AZZTwwD-Ht3wYP8y8IIOhyF9EqA5_Gs2kFT0425zHhPezZ4UaPvdIjU4XIR3RBxaUM4gxlR_195ONtZnfQtMnsVb-ghpl3ygJLdLHzUy41xnp_w2Spjkapb_9hOj-fU6afBdT0Gyyc_BFwLJTLqvso1Fa3P5FyqVfZTryyuk4y0'/>
</div>

- <b>Use-Case Query API (RKI)</b>:
Server queries RKI-API regularly and stores the data with the current date in the db.
- <b>Use-Case Query API (Own)</b>:
    User defines location and time-range. Server queries necessary data from the db and sends them to the user as JSON.
- <b>Use-Case Show Table/Diagrams</b>:
    User defines location and time-range. Server queries necessary data from the db and sends them to the user as JSON. Data visualization via chart.js/d3.js/tabulator.js on client side.
<br>

### Sequence-Diagram

<div align='center'>
<img src='http://www.plantuml.com/plantuml/png/RLBBReCm4BpxArR9cH_WK2KbA495QPIWzhoGLMl9F0HsLENhQt2x1k8RciTuPiLkqDXhKojHjZ-GA4cDXYq-J4-YiuoiP8SMSeoWvWPMA2RrbVexzI7r9vMENA07r5ZYGCkK_JaRGXcRorisaXilF_QjwM2Rowzl_QeC_JM8h0gIjgvD8olKicq45u3enIV5S4mBWPMMTzJaMth8FyfV4Da8biPmJKy7SQE0XI4UEg_1Q0oNz9planIoK_4-hWiiS_UEd7irpd4mhxLQvXJXvyS5UPeKuXzO3npnfNL69gWgewOUm_mA73PtMgjhydmrLlarhFsGWq4b7zEFuaqyQsTXKwjV'>
</div>

- <b>Server-API Communication:</b>
    Server queries RKI API regularly and stores data in db. We use (Current_Date, Admin_Level_2) as Primary Key. If Key already exists, entry gets overwritten (Replace Into).
- <b>Client-Server Communication:</b>
    Client sends GET-Request and defines location and time-range. Server selects necessary data from the db and extends them with some calculated data. Server sends data to Client. Client visualizes data.
