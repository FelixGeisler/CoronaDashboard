var fields = [document.getElementById('level2'), document.getElementById('level3')]
var dropdown_menus = [document.getElementById('level2_dropdown'), document.getElementById('level3_dropdown')]
var dropdown_values = [{}, {}]


var current_ids = []
var current_level
var current_interval = 'Month'

/* Useful dates
var firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleDateString('en-CA')
var lastOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toLocaleDateString('en-CA')
var yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('en-CA')
var today = new Date().toLocaleDateString('en-CA')
*/

var start = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
var stop = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)


// Show li items on focus
fields[0].addEventListener('focus', () => {
    fields[0].placeholder = 'Type to filter'
    dropdown_menus[0].classList.add('open')
})

fields[1].addEventListener('focus', () => {
    fields[1].placeholder = 'Type to filter'
    dropdown_menus[1].classList.add('open')
})

// lose focus on click on !dropdown
document.addEventListener('click', (evt) => {
    const isDropdownLevel2 = dropdown_menus[0].contains(evt.target)
    const isDropdownLevel3 = dropdown_menus[1].contains(evt.target)
    const isInputLevel2 = fields[0].contains(evt.target)
    const isInputLevel3 = fields[1].contains(evt.target)
    if (!isDropdownLevel2 && !isInputLevel2) {
        dropdown_menus[0].classList.remove('open')
        if (fields[0].value === '') {
            fields[0].placeholder = 'State'
        }
    }
    if (!isDropdownLevel3 && !isInputLevel3) {
        dropdown_menus[1].classList.remove('open')
        if (fields[1].value === '') {
            fields[1].placeholder = 'District'
        }
    }
    
})

// auto complete level2
fields[0].addEventListener('input', () => {
    dropdown_menus[0].classList.add('open')
    let inputValue = fields[0].value.toLowerCase()
    let item_array = [...document.querySelectorAll('ul#level2_dropdown.value-list li')].sort(function(a, b) { if (parseInt(a.id.slice(10)) < parseInt(b.id.slice(10))) {return -1} else {return 1}})
    if (inputValue.length > 0) {
        for (let j = 0; j < Object.values(dropdown_values[0]).length; j++) {
            if (!(inputValue.substring(0, inputValue.length) === Object.values(dropdown_values[0])[j].substring(0, inputValue.length).toLowerCase())) {
                item_array[j].classList.add('closed')
            } else {
                item_array[j].classList.remove('closed')
            }
        }
    } else {
        for (let i = 0; i < item_array.length; i++) {
            item_array[i].classList.remove('closed')
        }
    }
})

// auto complete level3
fields[1].addEventListener('input', () => {
    dropdown_menus[1].classList.add('open')
    let inputValue = fields[1].value.toLowerCase()
    let item_array = [...document.querySelectorAll('ul#level3_dropdown.value-list li')].sort(function(a, b) { if (parseInt(a.id.slice(10)) < parseInt(b.id.slice(10))) {return -1} else {return 1}})
    if (inputValue.length > 0) {
        for (let j = 0; j < Object.values(dropdown_values[1]).length; j++) {
            if (!(inputValue.substring(0, inputValue.length) === Object.values(dropdown_values[1])[j].substring(0, inputValue.length).toLowerCase())) {
                item_array[j].classList.add('closed')
            } else {
                item_array[j].classList.remove('closed')
            }
        }
    } else {
        for (let i = 0; i < item_array.length; i++) {
            item_array[i].classList.remove('closed')
        }
    }
})

function setLocation(level, id, start, stop) {
    level = parseInt(level)
    id = parseInt(id)
    startDate = start.toLocaleDateString('en-CA')
    stopDate = stop.toLocaleDateString('en-CA')

    current_level = level

    dropdown_menus[0].classList.remove('open')                                                                         // Close DropDown Menu
    dropdown_menus[1].classList.remove('open')

    if (level !== 3) {
        $.getJSON(`data/geo/${level}/${id}`, function (data) {

            if (level === 1) {
                if (current_ids[1] !== undefined) {                                                                 // If Country is hidden -> show Country
                    document.getElementById(`level1_map_${current_ids[1]}`).style.display = 'block'
                }
                document.getElementById(`level1_map_${id}`).style.display = 'none'                                  // Hide selected Country
                current_ids[0] = id
                current_ids[1] = undefined
                current_ids[2] = undefined
                dropdown_values[0] = {}
                dropdown_values[1] = {}
                fields[0].value = ''
                fields[1].value = ''
            } else {
                if (current_ids[1] !== undefined) {                                                                 // If State is hidden: show State
                    document.getElementById(`level2_map_${current_ids[1]}`).style.display = 'block'
                }
                document.getElementById(`level2_map_${id}`).style.display = 'none'                                  // Hide selected State
                current_ids[1] = id
                current_ids[2] = undefined
                dropdown_values[1] = {}
                fields[1].value = ''
                fields[0].value = dropdown_values[level - 2][id]
                $(dropdown_menus[1]).empty()
            }

            $.each(data, function (key, val) {
                item = document.createElement('li')
                item.id = `level${level + 1}_dd_${val.ID}`
                item.addEventListener('click', function () { setLocation(level + 1, val.ID, start, stop) })
                item.appendChild(document.createTextNode(val.Name))
                dropdown_menus[level - 1].appendChild(item)
                dropdown_values[level - 1][val.ID] = val.Name 
            })
        })
    } else {
        fields[1].value = dropdown_values[level - 2][id]
    }
    loadPage(level, id, startDate, stopDate)
}

function setLineChart(level, id, start, stop) {
    level = parseInt(level)
    id = parseInt(id)

    d3.select('#line').remove()

    d3.json(`/data/line/${level}/${id}/${start}/${stop}`).then(function (data) {
        var size = ({ height: 350, width: 500 })
        var margin = ({ top: 20, right: 60, bottom: 40, left: 60 })

        var parseDate = d3.timeParse('%Y-%m-%d')

        var xAxis = g => g
            .attr('transform', `translate(0, ${size.height - margin.bottom})`)
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat('%d.%m')))

        var y1Axis = g => g
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y1))

        var y2Axis = g => g
            .attr('transform', `translate(${size.width - margin.right}, 0)`)
            .call(d3.axisRight(y2))
            
        var x = d3.scaleUtc()
            .domain(d3.extent(data, d => parseDate(d.Date)))
            .range([margin.left, size.width - margin.right])

        var y1 = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Cases)])
            .range([size.height - margin.bottom, margin.top])

        var y2 = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Deaths)])
            .range([size.height - margin.bottom, margin.top])

        var cases = d3.line()
            .defined(d => !isNaN(d.Cases))
            .x(d => x(parseDate(d.Date)))
            .y(d => y1(d.Cases))

        var deaths = d3.line()
            .defined(d => !isNaN(d.Deaths))
            .x(d => x(parseDate(d.Date)))
            .y(d => y2(d.Deaths))

        const svg = d3.select('#linechart')
            .append('svg')
            .attr('viewBox', [0, 0, size.width, size.height])
            .attr('id', 'line')
            .attr('width', size.width + margin.left + margin.right)
            .attr('height', size.height + margin.top + margin.bottom)

        svg.append('g')
            .call(y1Axis)

        svg.append('g')
            .call(y2Axis)

        svg.append('g')
            .call(xAxis)
            .selectAll('text')
            .attr('y', -2)
            .attr('x', -10)
            .attr('transform', 'rotate(-70)')
            .style('text-anchor', 'end')

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#022d4d')
            .attr('stroke-width', 1.5)
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('d', cases)

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#ff9412')
            .attr('stroke-width', 1.5)
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('d', deaths)

    })
}

function setBarChart(level, id, start, stop) {
    level = parseInt(level)
    id = parseInt(id)

    d3.select('#bar').remove()

    d3.json(`/data/bar/${level}/${current_ids[level-2]}/${start}/${stop}`).then(function (data) {

        var size = ({ height: 350, width: 500 })
        var margin = ({ top: 20, right: 60, bottom: 40, left: 60 })
        var counter = 0
        var diff = []
        
        Object.keys(data).forEach(element => {
            diff[counter] = { Cases: data[element][1]['Cases'] - data[element][0]['Cases'], Deaths: data[element][1]['Deaths'] - data[element][0]['Deaths'], Name: data[element][0]['Name'] }
            counter++
        })

        diff.sort(function(a, b) { if (a.Deaths > b.Deaths) {return 1} else {return -1} {
            
        } })

        var xAxis = g => g
            .attr('transform', `translate(0, ${size.height - margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat(i => diff[i].Name).tickSizeOuter(0))

        var yAxis = g => g
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y))

        var x = d3.scaleBand()
            .domain(d3.range(diff.length))
            .range([margin.left, size.width - margin.right])
            .padding(0.1)

        var y = d3.scaleLinear()
            .domain([0, d3.max(diff, d => d.Cases)])
            .range([size.height - margin.bottom, margin.top])

        const svg = d3.select('#barchart')
            .append('svg')
            .attr('viewBox', [0, 0, size.width, size.height])
            .attr('id', 'bar')
            .attr('width', size.width + margin.left + margin.right)
            .attr('height', size.height + margin.top + margin.bottom)

        svg.append('g')
            .call(yAxis)

        svg.append('g')
            .call(xAxis)
        
        svg.append('g')
            .selectAll('rect')
            .data(diff)
            .join('rect')
            .attr('x', (d, i) => (diff.length === 1 ? '225' : x(i)))
            .attr('y', d => Math.abs(y(d.Cases)))
            .attr('fill', d => d.ID == id ? '#18627f' : '#022d4d')
            .attr('height', d => y(0) - y(d.Cases - d.Deaths))
            .attr('width', (diff.length === 1 ? size.width / 10 : x.bandwidth()))

        svg.append('g')
            .selectAll('rect')
            .data(diff)
            .join('rect')
            .attr('x', (d, i) => (diff.length === 1 ? '225' : x(i)))
            .attr('y', d => y(d.Deaths))
            .attr('fill', '#ff9412')
            .attr('height', d => y(0) - y(d.Deaths))
            .attr('width', (diff.length === 1 ? size.width / 10 : x.bandwidth()))
    })
}

function setSummary(level, id, start, stop) {
    d3.json(`/data/summary/${level}/${id}/${start}/${stop}`).then(function (data) {
        var format1 = d3.format(',')
        var format2 = d3.format('.4f')
        
        var deathratediff = format2(data[1].Deaths / data[1].Cases - data[0].Deaths / data[0].Cases)

        d3.select('#location').node().innerHTML = data[1].Name
        d3.select('#cases').node().innerHTML = format1(data[1].Cases).replaceAll(',', '.')
        d3.select('#casesdiff').node().innerHTML = '+' + format1(data[1].Cases - data[0].Cases).replaceAll(',', '.')
        d3.select('#deaths').node().innerHTML = format1(data[1].Deaths).replaceAll(',', '.')
        d3.select('#deathsdiff').node().innerHTML = '+' + format1(data[1].Deaths - data[0].Deaths).replaceAll(',', '.')
        d3.select('#deathrate').node().innerHTML = format2((data[1].Deaths / data[1].Cases)).replace('.', ',')
        d3.select('#deathratediff').node().innerHTML = (parseInt(deathratediff) >= 0 ? '+' + deathratediff.replaceAll('.', ',') : '' + deathratediff.replaceAll('.', ','))
        d3.select('#population').node().innerHTML = format1(data[1].Population).replaceAll(',', '.')
        
    })
}

function loadPage(level, id, start, stop) {
    setLineChart(level, id, start, stop)
    setBarChart(level, id, start, stop)
    setSummary(level, id, start, stop)
}

function setTime(direction) {
    switch (current_interval) {
        case 'Month':
            direction === 'left' ? start.setMonth(start.getMonth() - 1) : start.setMonth(start.getMonth() + 1)
            stop = new Date(start.getFullYear(), start.getMonth() + 1, 0)
            loadPage(current_level, current_ids[current_level - 1], start.toLocaleDateString('en-CA'), stop.toLocaleDateString('en-CA'))
            break
        case 'Year':
            break
        default:
            break
    }
}

//OnStart show Germany
setLocation(1, 49, start, stop)


// TODO: Check Kaiserslautern. Negative Deaths due to SK and LK.