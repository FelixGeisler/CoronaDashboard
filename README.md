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
<img src='http://www.plantuml.com/plantuml/png/TSinJiD048NXVa_n51fI92UW0aivm69HlpY3lOgz4yrEG05nTyGI8RP8ET-yVvPNXoiiZPFZa4m6Jvf3EQPyed71YSEHenI_p8AVD_CuIuXYRs9WGGmSN0rz-Rtx4FvcM3sfQIOwbccljCCAT_muc-0p0434PeFx5qikS4Ntk0xL--exSUn4EphNbHl1mtQB-7yV9tr7bpWQbt8jMhlHnFEoq2urQUbMySpzB7NVm7NzzGq0'/>
</div>

- <b>Write to DB:</b>
Server queries RKI-API regularly and stores the data with the current date in the db.
- <b>Show API/Table/Diagrams:</b>
User defines location and time-range. Server queries necessary data from the db and sends them to the user as JSON. Data visualization via chart.js/d3.js/tabulator.js on client side in case of Show Table/Diagrams.
<br>

### Sequence-Diagram

<div align='center'>
<img src='http://www.plantuml.com/plantuml/png/xPCnR_em4CLtVueJI7_zEw3i6LeAKH5gXufKPRua9x3an95ZG-7Jry7K999fn5m6H7JtkxFVU_AqqQYqAGNBv1VC1QTAmnYFHX6hROVdl4PRSXr6LG4MP2Sw9RKZ5QBNbBbchvgWnWmRwczvVbyseHsZrUkoROuk-499KyFuZM-sUYOCmLfnJQ0b93FcpuJ9usKuXWLfXhdcExIeXtofSux_WebTuT7O2gqALb1Wn9UyjkurV3M65TK2Sm9UQTbTvV5EiMTKGBLLP7-ofTWviVvzMo0gR3lQa8nYGJiIKSoBf-XN9zokQmfI4fIx40EoVpv2rhcPW3xedzKPcwF8ZK3DPTLq8KkvMuOszrHvO_p02nS24YNhHEuhre_q30NCJhTo3md7ZSAo6R9R7shg-1t5fzVL_idwBrl_oHk3WX_T-V0_GmN_GF2Ae73MFjmMI6hA4jLXA8_6OSEHt2CvMtLZ3X-O2Hfy5IrqBOFeOjyzX9DJroAOsh8fnJS0'>
</div>

- <b>Write to DB:</b>
    Server queries RKI API regularly and stores data in db. We use (Current_Date, Admin_Level_2) as Primary Key. If Key already exists, entry gets overwritten (Replace Into).
- <b>Show API/Table/Diagrams:</b>
    Client sends GET-Request and defines location and time-range. Server selects necessary data from the db and extends them with some calculated data. Server sends data to Client. Client visualizes data.
