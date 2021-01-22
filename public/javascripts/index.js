var fields = [document.getElementById('level2'), document.getElementById('level3')]
var dropdown_menus = [document.getElementById('level2_dropdown'), document.getElementById('level3_dropdown')]
var dropdown_values = [{}, {}]

var current_ids = []
var current_level


/* Useful dates
var firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
var lastOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
var yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
var today = new Date()
*/

var start = new Date(new Date().setDate(new Date().getDate() - 1))
var stop = new Date()

// DateRangePicker
function cb(dp_start, dp_stop) {
    start = new Date(dp_start)
    stop = new Date(dp_stop)
    loadPage(current_level, current_ids[current_level - 1], start, stop)
    $('#daterange').data('daterangepicker').remove()
    createDRP()
}

function createDRP() {
    $('#daterange').daterangepicker({
        'startDate': start,
        'endDate': stop,
        'minDate': '01/01/2020',
        'maxDate': new Date(),
        ranges: {
            'Today': [new Date(new Date().setDate(new Date().getDate() - 1)), new Date()],
            'Yesterday': [new Date(new Date().setDate(new Date().getDate() - 2)), new Date(new Date().setDate(new Date().getDate() - 1))],
            'Last 7 Days': [new Date(new Date().setDate(new Date().getDate() - 6)), new Date()],
            'Last 30 Days': [new Date(new Date().setDate(new Date().getDate() - 29)), new Date()],
            'This Month': [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
            'Last Month': [new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), new Date(new Date().getFullYear(), new Date().getMonth(), 0)]
        }
    }, cb)
}
createDRP()

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
    let item_array = [...document.querySelectorAll('ul#level2_dropdown.value-list li')].sort(function (a, b) { if (parseInt(a.id.slice(10)) < parseInt(b.id.slice(10))) { return -1 } else { return 1 } })
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
    let item_array = [...document.querySelectorAll('ul#level3_dropdown.value-list li')].sort(function (a, b) { if (parseInt(a.id.slice(10)) < parseInt(b.id.slice(10))) { return -1 } else { return 1 } })
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

    current_level = level

    dropdown_menus[0].classList.remove('open')
    dropdown_menus[1].classList.remove('open')

    if (level !== 3) {
        $.getJSON(`data/geo/${level}/${id}`, function (data) {

            if (level === 1) {
                if (current_ids[1] !== undefined) {
                    d3.select(`#level1_map_${current_ids[1]}`).selectAll('polygon').style('fill', '#022d4d')
                    d3.select(`#level1_map_${current_ids[1]}`).selectAll('path').style('fill', '#022d4d')
                }
                d3.select(`#level1_map_${id}`).selectAll('polygon').style('fill', 'none')
                d3.select(`#level1_map_${id}`).selectAll('path').style('fill', 'none')
                current_ids[0] = id
                current_ids[1] = undefined
                current_ids[2] = undefined
                dropdown_values[0] = {}
                dropdown_values[1] = {}
                fields[0].value = ''
                fields[1].value = ''
            } else {
                if (current_ids[1] !== undefined) {
                    d3.select(`#level2_map_${current_ids[1]}`).selectAll('polygon').style('fill', '#022d4d')
                    d3.select(`#level2_map_${current_ids[1]}`).selectAll('path').style('fill', '#022d4d')
                }
                if (current_ids[2] !== undefined) {
                    d3.select(`#level3_map_${current_ids[2]}`).selectAll('polygon').style('fill', '#022d4d')
                    d3.select(`#level3_map_${current_ids[2]}`).selectAll('path').style('fill', '#022d4d')
                }
                d3.select(`#level2_map_${id}`).selectAll('polygon').style('fill', 'none')
                d3.select(`#level2_map_${id}`).selectAll('path').style('fill', 'none')
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
                if (val.Prefix && !(val.Prefix === 'LK' || val.Prefix === 'Bezirk')) {
                    item.appendChild(document.createTextNode(`${val.Prefix} ${val.Name}`))
                } else {
                    item.appendChild(document.createTextNode(val.Name))
                }

                dropdown_menus[level - 1].appendChild(item)
                dropdown_values[level - 1][val.ID] = val.Name
            })
        })
    } else {
        if (current_ids[2] !== undefined) {
            d3.select(`#level3_map_${current_ids[2]}`).selectAll('polygon').style('fill', '#022d4d')
            d3.select(`#level3_map_${current_ids[2]}`).selectAll('path').style('fill', '#022d4d')
        }
        d3.select(`#level3_map_${id}`).selectAll('polygon').style('fill', '#18627f')
        d3.select(`#level3_map_${id}`).selectAll('path').style('fill', '#18627f')
        current_ids[2] = id
        fields[1].value = dropdown_values[level - 2][id]
    }
    loadPage(level, id, start, stop)
}

function setLineChart(level, id, start, stop) {
    level = parseInt(level)
    id = parseInt(id)

    d3.json(`/data/line/${level}/${id}/${start}/${stop}`).then(function (data) {
        var size = ({ height: 350, width: 500 })
        var margin = ({ top: 20, right: 60, bottom: 60, left: 60 })

        var parseDate = d3.timeParse('%Y-%m-%d')

        var xAxis = g => g
            .attr('transform', `translate(0, ${size.height - margin.bottom})`)
            .call(d3.axisBottom(x))

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
            .domain([d3.min(data, d => d.Cases) * 0.9, d3.max(data, d => d.Cases) * 1.1]).nice()
            .range([size.height - margin.bottom, margin.top])

        var y2 = d3.scaleLinear()
            .domain([d3.min(data, d => d.Deaths) * 0.9, d3.max(data, d => d.Deaths) * 1.1]).nice()
            .range([size.height - margin.bottom, margin.top])

        var cases = d3.line()
            .defined(d => !isNaN(d.Cases))
            .x(d => x(parseDate(d.Date)))
            .y(d => y1(d.Cases))

        var deaths = d3.line()
            .defined(d => !isNaN(d.Deaths))
            .x(d => x(parseDate(d.Date)))
            .y(d => y2(d.Deaths))

        d3.select('#line').remove()

        const svg = d3.select('#linechart')
            .append('svg')
            .attr('viewBox', [0, 0, size.width, size.height])
            .attr('id', 'line')
            .attr('width', '100%')
            .attr('height', '100%')

        svg.append('g')
            .attr('id', 'axis_y1')
            .call(y1Axis)

        svg.append('g')
            .attr('id', 'axis_y2')
            .call(y2Axis)

        svg.append('g')
            .attr('id', 'axis_x')
            .call(xAxis)
            .selectAll('text')
            .attr('y', -2)
            .attr('x', -10)
            .attr('transform', 'rotate(-70)')
            .style('text-anchor', 'end')

        svg.append('path')
            .datum(data)
            .attr('id', 'path_cases')
            .attr('fill', 'none')
            .attr('stroke', '#022d4d')
            .attr('stroke-width', 1.5)
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('d', cases)

        svg.append('path')
            .datum(data)
            .attr('id', 'path_deaths')
            .attr('fill', 'none')
            .attr('stroke', '#ff9412')
            .attr('stroke-width', 1.5)
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('d', deaths)

        svg.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .style("font-size", "12px")
            .text('Cases (total)')

        svg.append("text")
            .attr("x", 420)
            .attr("y", 0)
            .style("font-size", "12px")
            .text('Deaths (total)')
        })
}

function setBarChart(level, id, start, stop) {
    level = parseInt(level)
    id = parseInt(id)
    keys = ['Cases', 'Deaths']
    groupKey = 'Name'

    d3.select('#bar').remove()

    d3.json(`/data/bar/${level}/${current_ids[level - 2]}/${start}/${stop}`).then(function (data) {
        var size = ({ height: 350, width: 500 })
        var margin = ({ top: 20, right: 60, bottom: 100, left: 60 })

        data.sort((a, b) => (a.Cases <= b.Cases) ? 1 : -1)

        var color = d3.scaleOrdinal()
            .range(['#022d4d', '#ff9412'])

        var xAxis = g => g
            .attr('transform', `translate(0, ${size.height - margin.bottom})`)
            .call(d3.axisBottom(x0).tickSizeOuter(0))

        var yAxis = g => g
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y))

        var x0 = d3.scaleBand()
            .domain(data.map(d => d[groupKey]))
            .rangeRound([margin.left, size.width - margin.right])
            .paddingInner(0.1)

        var x1 = d3.scaleBand()
            .domain(keys)
            .rangeRound([0, x0.bandwidth()])
            .padding(0.05)

        var y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d3.max(keys, key => d[key]))]).nice()
            .rangeRound([size.height - margin.bottom, margin.top])

        d3.select('#bar').remove()

        const svg = d3.select('#barchart')
            .append('svg')
            .attr('viewBox', [0, 0, size.width, size.height])
            .attr('id', 'bar')
            .attr('width', '100%')
            .attr('height', '100%')

        legend = svg_legend => {
            const g = svg_legend
                .attr("transform", `translate(${size.width - margin.right}, ${margin.top})`)
                .attr("text-anchor", "end")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .selectAll("g")
                .data(color.domain().slice())
                .join("g")
                .attr("transform", (d, i) => `translate(0,${i * 20})`);

            g.append("rect")
                .attr("x", -19)
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", color);

            g.append("text")
                .attr("x", -24)
                .attr("y", 9.5)
                .attr("dy", "0.35em")
                .text(d => `${d} (diff)`);
        }

        svg.append('g')
            .call(yAxis)

        svg.append('g')
            .call(xAxis)
            .selectAll('text')
            .attr('text-anchor', 'end')
            .attr('y', 7)
            .attr('x', -7)
            .attr('transform', 'rotate(-45)')

        svg.append('g')
            .selectAll('g')
            .data(data)
            .join('g')
            .attr('transform', d => `translate(${x0(d[groupKey])}, 0)`)
            .selectAll('rect')
            .data(d => keys.map(key => ({ key, Cases: d[key] })))
            .join('rect')
            .attr('x', d => x1(d.key))
            .attr('y', d => y(d.Cases))
            .attr('height', d => y(0) - y(d.Cases))
            .attr('width', x1.bandwidth())
            .attr('fill', d => color(d.key))

        svg.append('g')
            .call(legend)
    })
}

function setSummary(level, id, start, stop) {
    d3.json(`/data/summary/${level}/${id}/${start}/${stop}`).then(function (data) {
        var format1 = d3.format(',')
        var format2 = d3.format('.4f')

        if (data.length === 2) {
            var deathratediff = format2(data[1].Deaths / data[1].Cases - data[0].Deaths / data[0].Cases)

            d3.select('#location').node().innerHTML = data[1].Name
            d3.select('#population').node().innerHTML = format1(data[1].Population).replaceAll(',', '.')

            d3.select('#cases').node().innerHTML = format1(data[1].Cases).replaceAll(',', '.')
            d3.select('#casesdiff').node().innerHTML = `+ ${format1(data[1].Cases - data[0].Cases).replaceAll(',', '.')}`
            d3.select('#deaths').node().innerHTML = format1(data[1].Deaths).replaceAll(',', '.')
            d3.select('#deathsdiff').node().innerHTML = `+ ${format1(data[1].Deaths - data[0].Deaths).replaceAll(',', '.')}`

            d3.select('#deathrate').node().innerHTML = format2((data[1].Deaths / data[1].Cases)).replace('.', ',')
            d3.select('#deathratediff').node().innerHTML = (parseInt(deathratediff) >= 0 ? '+' + deathratediff.replaceAll('.', ',') : '' + deathratediff.replaceAll('.', ','))
        }
    })
}

function loadPage(level, id, start, stop) {
    $('#daterange span').html(`${start.toLocaleDateString()}&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;${stop.toLocaleDateString()}`)
    setLineChart(level, id, start.toLocaleDateString('en-CA'), stop.toLocaleDateString('en-CA'))
    setBarChart(level, id, start.toLocaleDateString('en-CA'), stop.toLocaleDateString('en-CA'))
    setSummary(level, id, start.toLocaleDateString('en-CA'), stop.toLocaleDateString('en-CA'))
    setTable(level, id, start.toLocaleDateString('en-CA'), stop.toLocaleDateString('en-CA'))
}

function setTime(direction) {
    // If Month is selected -> Interval = Months
    if (start.getDate() === 1 && stop.toLocaleDateString() === new Date(new Date(new Date(start).setMonth(start.getMonth() + 1)).setDate(0)).toLocaleDateString()) {
        direction === 'left' ? start.setMonth(start.getMonth() - 1) : start.setMonth(start.getMonth() + 1)
        if (start < new Date('2020-01-01')) {
            start = new Date('2020-01-01')
        }
        stop = new Date(start.getFullYear(), start.getMonth() + 1, 0)
        if (stop > new Date()) {
            stop = new Date()
            start = new Date(stop.getFullYear(), stop.getMonth(), 1)
        }
        // else Interval = DateDiff
    } else {
        dateDiff = Math.floor((stop - start) / (1000 * 60 * 60 * 24))
        direction === 'left' ? start.setDate(start.getDate() - dateDiff) : start.setDate(start.getDate() + dateDiff)
        if (start < new Date('2020-01-01')) {
            start = new Date('2020-01-01')
        }
        stop = new Date(new Date(start).setDate(start.getDate() + dateDiff))
        if (stop > new Date()) {
            stop = new Date()
            start.setDate(stop.getDate() - dateDiff)
        }
    }
    cb(start, stop)
}


function setTable(level, id, start, stop) {
    $.getJSON(`data/table/${level}/${id}/${start}/${stop}/`, data => {
        var table = new Tabulator("#tableContent", {
            data: data,
            autoColumns: true,
            layout: 'fitColumns',
            movableColumns: true,
            resizableRows: true
        })
    })
}


// TODO: Animate this (slide).
//Table
function setContentTable() {
    $("#tableContent").css({ top: '7vh' })
    $("#chartContent").css({ top: '100vh' })
}

//Chart
function setContentChart() {
    $("#chartContent").css({ top: '7vh' })
    $("#tableContent").css({ top: '100vh' })
}

//OnStart Select Germany
setLocation(1, 49, start, stop)