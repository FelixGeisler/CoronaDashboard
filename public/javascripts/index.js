function getData() {
    let response = []
    $.getJSON( '/api', function(data) {
        response = data
    }).done(function (response) {
        date_cases = []
        date_deaths = []
        count_cases = []
        count_deaths = []
        for(let i in response.cases) {
            date_cases.push(i)
            count_cases.push(response.cases[i])
        }
        for(let i in response.deaths) {
            date_deaths.push(i)
            count_deaths.push(response.deaths[i])
        }

        let casesChart = new Chart(ctx_cases, {
            type: 'line',
            data: {
                labels: date_cases,
                datasets: [{
                    label: '# of Cases',
                    data: count_cases,
                    backgroundColor: [
                        'rgba(63, 156, 221, 0.2)'
                    ],
                    borderColor: [
                        'rgba(63, 156, 221, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        })
        let deathsChart = new Chart(ctx_deaths, {
            type: 'line',
            data: {
                labels: date_deaths,
                datasets: [{
                    label: '# of Deaths',
                    data: count_deaths,
                    backgroundColor: [
                        'rgba(63, 156, 221, 0.2)'
                    ],
                    borderColor: [
                        'rgba(63, 156, 221, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        })
    })
}
let ctx_cases = document.getElementById('cases').getContext('2d');
let ctx_deaths = document.getElementById('deaths').getContext('2d');

getData()





