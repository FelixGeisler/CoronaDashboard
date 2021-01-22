# CoronaDashboard

## Build Status

[![GitHub CINode](https://github.com/FelixGeisler/CoronaDashboard/workflows/Node.js%20CI/badge.svg)](https://github.com/actions/starter-workflows/blob/main/ci/node.js.yml)  
[![GitHub CodeQL](https://github.com/FelixGeisler/CoronaDashboard/workflows/CodeQL/badge.svg)](https://github.com/actions/starter-workflows/blob/main/code-scanning/codeql.yml)  
[![GitHub Super-Linter](https://github.com/FelixGeisler/CoronaDashboard/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/marketplace/actions/super-linter)

[![GitHub Commits](https://img.shields.io/github/commit-activity/w/FelixGeisler/CoronaDashboard)](https://github.com/FelixGeisler/CoronaDashboard/commits/main)  
[![GitHub Issues](https://img.shields.io/github/issues/FelixGeisler/CoronaDashboard)](https://github.com/FelixGeisler/CoronaDashboard/issues)

## Software Architecture

### Use-Case-Diagram

<div align='center'>
<img src='http://www.plantuml.com/plantuml/png/ROknJiD038PtFyMlii3GFW53WIniI4V4x2OcEVNkNFaS423U7P56KOLOBFd_lczVdSsdd2Z9gyCL5eVHqKUJpgCMgiTOJcoSSUBko8DK_qY2NynbI491x4qCN168ErT3Myz_IxHgs3oeQM4qNCU3ilKRNF7dP88l0e20xHRNBnPTu8hc_cQUvzFEB8pwZcS-93cZom6tknt2lqKJUJ3ETOqkjwNxszmzFIxw-YxcD-sbz5DEFm00'/>
</div>

- <b>Write to DB:</b>
Server queries RKI-API regularly and stores the data with the current date in the db.
- <b>Show API/Table/Diagrams:</b>
User defines location and time-range. Server queries necessary data from the db and sends them to the user as JSON. Data visualization via chart.js/d3.js/tabulator.js on client side in case of Show Table/Diagrams.
<br>

### Sequence-Diagram

<div align='center'>
<img src='http://www.plantuml.com/plantuml/png/RL5DQm8n4BtdLmnwbhtleLeLHDf3qL8llSokWmRYPic7BVxw3gQE2UIoB6_UUtblPk43kX0lHdNs5rP6qn1WYhVeI8qyqRqUaQ4qKJGSWOdgpjwJkvAhiG_KfM61hZ5WXvvAbzUFhQzvJ7PlM-3Xv4dVE1j7cBxhqpaiJIGuE1q8WeNrKicRC7jvYblOK53O1tr5fWf9eEmT-OCPMmYrXJqdK4UgI0IIRdaCGLlOqMYm9z13iBcLq3EmM5IbzVviV-0JEqFDMkF9uSKtd4RzNw_CplMXER9Xq_ANvarhR8z1ss7UIFp7UUlXkR-XFjrFFT3QZX93G2WPApHzDFUdVQqjv4gMfaoPStrlqbe4Nzf7DFgMhB-7oghae4Nz1SFnOlu0'>
</div>

- <b>Write to DB:</b>
    Server queries RKI API regularly and stores data in db. We use (Current_Date, Admin_Level_2) as Primary Key. If Key already exists, entry gets overwritten (Replace Into).
- <b>Show API/Table/Diagrams:</b>
    Client sends GET-Request and defines location and time-range. Server selects necessary data from the db and extends them with some calculated data. Server sends data to Client. Client visualizes data.
