# CoronaDashboard

## Build Status
[![GitHub Node](https://github.com/FelixGeisler/CoronaDashboard/workflows/Node.js%20CI/badge.svg)](https://github.com/actions/starter-workflows)  
[![GitHub Super-Linter](https://github.com/FelixGeisler/CoronaDashboard/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/marketplace/actions/super-linter)

[![GitHub Commits](https://img.shields.io/github/commit-activity/w/FelixGeisler/CoronaDashboard)](https://github.com/FelixGeisler/CoronaDashboard/commits/main)

## API
We query the API of the [RKI](https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0) every day and store the received data in our database. It is possible to make specific queries to our database via our API. 

The link to the api is: `/api/:date?/:bl?/:lk?`

#### Get all data
To select all data call `/api`

#### Filter by Date
It is possible to filter the data by a specific day (`/api/yyyy-mm-dd`), month (`/api/yyyy-mm`) or year (`/api/yyyy`).
You can also specify a date range e.g.: `/api/yyyy-mm-dd_yyyy-mm-dd`, `/api/yyyy-mm_yyyy`, `/api/yyyy-mm-dd_` (given startDate till today), etc...

#### Filter by Bundesland
To filter the data by a Bundesland specify it in the link: e.g. `/api/yyyy-mm-dd/Baden-Württemberg/`

#### Filter by Landkreis
To filter the data by a Landkreis specify it in the link: e.g. `/api/yyyy-mm-dd/Baden-Württemberg/LKZollernalbkreis`

## Software Architecture

#### Use-Case-Diagram
![PlantUML model](http://www.plantuml.com/plantuml/png/XSx1JeGm40RWUv_YpthPFImFO0XPbOit3HBFip12iwNTJ0TrDRwxAKH3EEY5qFd_Vfr3L18T1sSSloWqG6pNArehtAWDtiIJzMSI6d2cvaGTHxquHeh9TuuDDHe4TMG1HTIcOdcT_ojZVclOt0K9db1Ix8-1fDtWYZv6ONmQ0AYntsDRzU4DJtHql9kcom7oBCFsSMIveBpTNIFF-LtPjqMn5afBdT0GPoHzri4_s29AQhL-uERXVh8Nnx_4gLfDrv_5AaD3wip2Se8iAtwGX2R5-iQDBIyNcyDviozpOD-EW_i6)


#### Sequence-Diagram
![PlantUML model](http://www.plantuml.com/plantuml/png/TP11QuD048Nl-oi6SlOFU2X9pHAaaeOez5X6CxGBkiew6qf_VJV9PgerlMJ9cpTltkTwP7JikrRL_HTahI7BiC9lxqWDOM8QCw3bE55aJn2CwkekoPt9FNA_KNqRpjGjCjOuqZnbSyZ7Hnd7b_mzp7xDEzVx0LQ5-VZavzPJl9y44sHzrtbh6cJJMoNd8NcwvwImqvN2XiqPcK0i8aL4-Iy5uWj929Er54gztweJBUmY2EwqZgWf7FMXs6GQydtrUg5S4iPAIToUGIvwtnwObmpC_vqlTQ6pIjs5ltWNVOedlabUM8dN5vyZwbD5zgwmw_3Zk_O7)
