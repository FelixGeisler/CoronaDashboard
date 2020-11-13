/* global Chart */
/* eslint-env jquery */

function getData () {
  $.getJSON('/api', function (data) {}).done(function (response) {
    const dropBundesland = document.getElementById('bundesland')
    dropBundesland.options[dropBundesland.options.length] = new Option('Germany', 'Germany')
    for (bundesland in response.data) {
        dropBundesland.options[dropBundesland.options.length] = new Option(bundesland, bundesland)
    }
    const dropLandkreis = document.getElementById('landkreis')
    dropLandkreis.disabled = true
    dropLandkreis.options[dropLandkreis.options.length] = new Option('All', 'All')
    dropBundesland.addEventListener ('change', function () {
        dropLandkreis.options.length = 0
        dropLandkreis.options[dropLandkreis.options.length] = new Option('All', 'All')
        if (!(this.value === 'Germany')) {
            dropLandkreis.disabled = false
            for (landkreis in response.data[this.value]) {
                dropLandkreis.options[dropLandkreis.options.length] = new Option(landkreis, landkreis)
            }
        } else {
            dropLandkreis.disabled = true
        }
     })
  })
}

getData()
