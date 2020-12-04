var tableData = [
    {id:1, location:"Baden-Württemberg", new_cases:546, cases_total:1234, new_deaths:100, deaths_total:152121},
    {id:1, location:"Bayern", new_cases:546, cases_total:1234, new_deaths:100, deaths_total:152121},
]
var table = new Tabulator("#table", {
    data:tableData, //set initial table data
    height:"311px",
    responsiveLayout:"hide",
    columns:[
    {title:"Ort", field:"location", width:200, responsive:0},                                       //never hide this column
    {title:"neue Fälle", field:"new_cases", align:"right", sorter:"number", width:150},
    {title:"Fälle gesamt", field:"cases_total", width:150, responsive:2},                            //hide this column first
    {title:"neue Todesfälle", field:"new_deaths", align:"center", width:150},
    {title:"Tode gesamt", field:"deaths_total", width:150},
    ],
});