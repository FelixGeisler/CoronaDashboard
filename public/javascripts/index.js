var level2_field = document.getElementById('level2')
var level2_dropdown = document.getElementById('level2_dropdown')
var level2_dropdown_values = []

var level3_field = document.getElementById('level3')
var level3_dropdown = document.getElementById('level3_dropdown')
var level3_dropdown_values = []

var current_level1 = 49
var current_level2 = undefined
var current_level3 = undefined

setLevel1(current_level1)

// Show li items on focus
level2_field.addEventListener('focus', () => {
    level2_field.placeholder = 'Type to filter'
    level2_dropdown.classList.add('open')
})

level3_field.addEventListener('focus', () => {
    level3_field.placeholder = 'Type to filter'
    level3_dropdown.classList.add('open')
})

// lose focus on click on !dropdown
document.addEventListener('click', (evt) => {
    const isDropdownLevel2 = level2_dropdown.contains(evt.target);
    const isDropdownLevel3 = level3_dropdown.contains(evt.target);
    const isInputLevel2 = level2_field.contains(evt.target);
    const isInputLevel3 = level3_field.contains(evt.target);
    if (!isDropdownLevel2 && !isInputLevel2) {
        level2_dropdown.classList.remove('open');
    }
    if (!isDropdownLevel3 && !isInputLevel3) {
        level3_dropdown.classList.remove('open');
    }
});

// auto complete level2
level2_field.addEventListener('input', () => {
    level2_dropdown.classList.add('open');
    let inputValue = level2_field.value.toLowerCase();
    let level2_item_array = [...document.querySelectorAll('ul#level2_dropdown.value-list li')]
    if (inputValue.length > 0) {
        for (let j = 0; j < level2_dropdown_values.length; j++) {
            if (!(inputValue.substring(0, inputValue.length) === level2_dropdown_values[j].substring(0, inputValue.length).toLowerCase())) {
                level2_item_array[j].classList.add('closed');
            } else {
                level2_item_array[j].classList.remove('closed');
            }
        }
    } else {
        for (let i = 0; i < level2_item_array.length; i++) {
            level2_item_array[i].classList.remove('closed');
        }
    }
});

// auto complete level3
level3_field.addEventListener('input', () => {
    level3_dropdown.classList.add('open');
    let inputValue = level3_field.value.toLowerCase();
    let level3_item_array = [...document.querySelectorAll('ul#level3_dropdown.value-list li')]
    if (inputValue.length > 0) {
        for (let j = 0; j < level3_dropdown_values.length; j++) {
            if (!(inputValue.substring(0, inputValue.length) === level3_dropdown_values[j].substring(0, inputValue.length).toLowerCase())) {
                level3_item_array[j].classList.add('closed');
            } else {
                level3_item_array[j].classList.remove('closed');
            }
        }
    } else {
        for (let i = 0; i < level3_item_array.length; i++) {
            level3_item_array[i].classList.remove('closed');
        }
    }
});

function setLevel1(Level1_ID) {
    current_level1 = Level1_ID
    current_level2 = undefined
    current_level3 = undefined
    level2_dropdown_values = []
    $.getJSON('data/geo/level2/' + Level1_ID, function (data) {
        $.each(data, function (key, val) {
            level2_item = document.createElement('li')
            level2_item.id = 'level2_dd_' + key
            level2_item.addEventListener('click', function () {
                setLevel2(this.id.slice(10))
                setLineChart('level2', this.id.slice(10))
            })
            level2_item.appendChild(document.createTextNode(val))
            level2_dropdown.appendChild(level2_item)
            level2_dropdown_values.push(val)
        })
    })
}

function setLevel2(Level2_ID) {
    level2_dropdown.classList.remove('open');                                                           // Close DropDown Menu
    if (current_level2 !== undefined) {                                                                 // Show hidden Level2_item
        document.getElementById('level2_map_' + current_level2).style.display = 'block'
    }
    current_level2 = Level2_ID
    current_level3 = undefined
    document.getElementById('level2_map_' + Level2_ID).style.display = 'none'                           // Hide selected Level2_item
    level3_field.value = ''
    $.getJSON('data/geo/level3/' + Level2_ID, function (data) {
        level2_field.value = Object.keys(data)[0]
        $(level3_dropdown).empty()
        $.each(data[Object.keys(data)[0]], function (key, val) {
            level3_item = document.createElement('li')
            level3_item.id = 'level3_dd_' + key
            level3_item.addEventListener('click', function () {
                setLevel3(this.id.slice(10))
                setLineChart('level3', this.id.slice(10))
            })
            level3_item.appendChild(document.createTextNode(val))
            level3_dropdown.appendChild(level3_item)
            level3_dropdown_values.push(val)
        })
    })
}

function setLevel3(Level3_ID) {
    level3_dropdown.classList.remove('open');
    current_level3 = Level3_ID
    $.getJSON('data/geo/level3/', function (data) {
        level3_field.value = data[Level3_ID]
    })
}

function setLineChart(level, id) {

    d3.select('#line').remove()

    d3.json('/data/line/' + level + '/' + id).then(function(data) {
        
        var size = ({height: 350, width: 500})
        var margin = ({top: 20, right: 60, bottom: 40, left: 60})

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

function setBarChart(level, id) {

    d3.select('#bar').remove()

    d3.json('/data/bar/' + level + '/' + id).then(function(data) {

        var size = ({height: 350, width: 500})
        var margin = ({top: 20, right: 60, bottom: 40, left: 60})

        var xAxis = g => g
            .attr('transform', `translate(0, ${size.height - margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat(i => data[i].Name).tickSizeOuter(0))

        var yAxis = g => g
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y))

        var x = d3.scaleBand()
            .domain(d3.range(data.length))
            .range([margin.left, size.width - margin.right])
            .padding(0.1)

        var y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Cases)])
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
        console.log(data)
        console.log(data.length)
        svg.append('g')
            .selectAll('rect')
            .data(data)
            .join('rect')
                .attr('x', (d, i) => (data.length === 1 ? '225' : x(i)))
                .attr('y', d => y(d.Cases))
                .attr('fill', d => d.ID == id ? '#18627f' : '#022d4d')
                .attr('height', d => y(0) - y(d.Cases - d.Deaths))
                .attr('width', (data.length === 1 ? size.width/10 : x.bandwidth()))

        svg.append('g')
            .selectAll('rect')
            .data(data)
            .join('rect')
                .attr('x', (d, i) => (data.length === 1 ? '225' : x(i)))
                .attr('y', d => y(d.Deaths))
                .attr('fill', '#ff9412')
                .attr('height', d => y(0) - y(d.Deaths))
                .attr('width', (data.length === 1 ? size.width/10 : x.bandwidth()))
    })
}

function setSummary(level, id) {
    d3.json('/data/summary/' + level + '/' + id).then(function(data) {

        var format1 = d3.format(',')
        var format2 = d3.format('.4f')

        var deathrate_change = (format2(data[1].Deaths / data[1].Cases - data[0].Deaths / data[0].Cases))
        d3.select('#location').node().innerHTML = data[1].Name
        d3.select('#cases').node().innerHTML = format1(data[1].Cases).replaceAll(',', '.') + ' (+' + (format1(data[1].Cases - data[0].Cases)).replaceAll(',', '.') + ')'
        d3.select('#deaths').node().innerHTML = format1(data[1].Deaths).replaceAll(',', '.') + ' (+' + (format1(data[1].Deaths - data[0].Deaths)).replaceAll(',', '.') + ')'
        d3.select('#deathrate').node().innerHTML =  format2((data[1].Deaths / data[1].Cases)).replace('.', ',') + '% (' + (deathrate_change > 0 ? '+' + deathrate_change.replaceAll('.', ',') : '' + deathrate_change.replaceAll('.', ',')) + ')'
        d3.select('#population').node().innerHTML = format1(data[1].Population).replaceAll(',', '.')
    })
}

function loadPage(level, id) {
    setLineChart(level, id)
    setBarChart(level, id)
    setSummary(level, id)
}

//OnStart show Germany
loadPage('level1', 49)
