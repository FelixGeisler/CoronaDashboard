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
<img src='http://www.plantuml.com/plantuml/png/ROknJiD038PtFyMlii3GFW53WIniI4V4x2OcEVNkNFaS423U7P56KOLOBFd_lczVdSsdd2Z9gyCL5eVHqKUJpgCMgiTOJcoSSUBko8DK_qY2NynbI491x4qCN168ErT3Myz_IxHgs3oeQM4qNCU3ilKRNF7dP88l0e20xHRNBnPTu8hc_cQUvzFEB8pwZcS-93cZom6tknt2lqKJUJ3ETOqkjwNxszmzFIxw-YxcD-sbz5DEFm00'/>
</div>

- <b>Use-Case Write to DB</b>:
Server queries RKI-API regularly and stores the data with the current date in the db.
- <b>Use-Case Show API/Table/Diagrams</b>:
User defines location and time-range. Server queries necessary data from the db and sends them to the user as JSON. Data visualization via chart.js/d3.js/tabulator.js on client side in case of Show Table/Diagrams.
<br>

### Sequence-Diagram

<div align='center'>
<img src='http://www.plantuml.com/plantuml/png/RL5DQm8n4BtdLmnwbhtleLeLHDf3qL8llSokWmRYPic7BVxw3gQE2UIoB6_UUtblPk43kX0lHdNs5rP6qn1WYhVeI8qyqRqUaQ4qKJGSWOdgpjwJkvAhiG_KfM61hZ5WXvvAbzUFhQzvJ7PlM-3Xv4dVE1j7cBxhqpaiJIGuE1q8WeNrKicRC7jvYblOK53O1tr5fWf9eEmT-OCPMmYrXJqdK4UgI0IIRdaCGLlOqMYm9z13iBcLq3EmM5IbzVviV-0JEqFDMkF9uSKtd4RzNw_CplMXER9Xq_ANvarhR8z1ss7UIFp7UUlXkR-XFjrFFT3QZX93G2WPApHzDFUdVQqjv4gMfaoPStrlqbe4Nzf7DFgMhB-7oghae4Nz1SFnOlu0'>
</div>

- <b>Server-API Communication:</b>
    Server queries RKI API regularly and stores data in db. We use (Current_Date, Admin_Level_2) as Primary Key. If Key already exists, entry gets overwritten (Replace Into).
- <b>Client-Server Communication:</b>
    Client sends GET-Request and defines location and time-range. Server selects necessary data from the db and extends them with some calculated data. Server sends data to Client. Client visualizes data.
