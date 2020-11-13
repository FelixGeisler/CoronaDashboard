/* global Chart */
/* eslint-env jquery */

function getData () {
  $.getJSON('/api', function (data) {}).done(function (response) {
    const dateCases = []
    const dateDeaths = []
    const countCases = []
    const countDeaths = []
    for (const i in response.cases) {
      dateCases.push(i)
      countCases.push(response.cases[i])
    }
    for (const i in response.deaths) {
      dateDeaths.push(i)
      countDeaths.push(response.deaths[i])
    }

    Chart(ctxCases, {
      type: 'line',
      data: {
        labels:
        dateCases,
        datasets: [{
          label: '# of Cases',
          data: countCases,
          backgroundColor: ['rgba(63, 156, 221, 0.2)'],
          borderColor: ['rgba(63, 156, 221, 1)'],
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

    Chart(ctxDeaths, {
      type: 'line',
      data: {
        labels: dateDeaths,
        datasets: [{
          label: '# of Deaths',
          data: countDeaths,
          backgroundColor: ['rgba(63, 156, 221, 0.2)'],
          borderColor: ['rgba(63, 156, 221, 1)'],
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

const ctxCases = document.getElementById('cases').getContext('2d')
const ctxDeaths = document.getElementById('deaths').getContext('2d')

getData()
