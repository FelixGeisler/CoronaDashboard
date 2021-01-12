d3 = require("d3@6")

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
            level2_item.addEventListener('click', function () { setLevel2(this.id.slice(10)) })
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
            level3_item.addEventListener('click', function () { setLevel3(this.id.slice(10)) })
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

var svg = d3.select('#charts')
  .append('svg')
  .append('g')

  d3.json('data/geo/level2', function(d) {
      
      return {data}
  })