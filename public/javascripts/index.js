const bundeslandField = document.getElementById('bundesland');
const landkreisField = document.getElementById('landkreis');
const bundeslandDrop = document.getElementById('bundeslandlist');
const landkreisDrop = document.getElementById('landkreislist');
const casesElement = document.getElementById('cases');
const deathsElement = document.getElementById('deaths')

bundeslandField.placeholder = 'Select Bundesland';
landkreisField.placeholder = 'Select Landkreis';

let valueArrayBl = [];
let valueArrayLk = [];

let cases
let deaths

$.getJSON('data/_/_', function (data) {
    $.each(data.geo, function (key, val) {
        item = document.createElement('li')                                                         // Create DropDown li's
        item.appendChild(document.createTextNode(key));
        bundeslandDrop.appendChild(item)                                                            // Append li to DropDown-List
        valueArrayBl.push(key) 
    })
}).done(function (n) {
    let dropdownArrayBl = [...document.querySelectorAll('ul#bundeslandlist.value-list li')];
    let dropdownArrayLk = [...document.querySelectorAll('ul#landkreislist.value-list li')];

    // Show li items on focus
    bundeslandField.addEventListener('focus', () => {
        bundeslandField.placeholder = 'Type to filter';
        bundeslandDrop.classList.add('open');
        dropdownArrayBl.forEach(bundeslandDrop => {
            bundeslandDrop.classList.remove('closed');
        });
    });

    landkreisField.addEventListener('focus', () => {
        landkreisField.placeholder = 'Type to filter';
        landkreisDrop.classList.add('open');
        dropdownArrayLk.forEach(landkreisDrop => {
            landkreisDrop.classList.remove('closed');
        });
    });

    // lose focus on click on !dropdown
    document.addEventListener('click', (evt) => {
        const isDropdownBl = bundeslandDrop.contains(evt.target);
        const isDropdownLk = landkreisDrop.contains(evt.target);
        const isInputBl = bundeslandField.contains(evt.target);
        const isInputLk = landkreisField.contains(evt.target);
        if (!isDropdownBl && !isInputBl) {
            bundeslandDrop.classList.remove('open');
        }
        if (!isDropdownLk && !isInputLk) {
            landkreisDrop.classList.remove('open');
        }
    });

    // set placeholder on blur again
    bundeslandField.addEventListener('blur', () => {
        bundeslandField.placeholder = 'Select Bundesland';
        bundeslandDrop.classList.remove('open');
    });

    landkreisField.addEventListener('blur', () => {
        landkreisField.placeholder = 'Select Landkreis';
        landkreisDrop.classList.remove('open');
    });

    // set clicked bl_li as selected and generate li's for lk dropdown
    dropdownArrayBl.forEach(item => {
        item.addEventListener('click', (evt) => {
            bundeslandField.value = item.textContent
            landkreisField.value = ''
            $.getJSON('data/_/_/', function (data) {
                $(landkreisDrop).empty()
                valueArrayLk = []
                flag = true
                console.log()
                $.each(data.geo[item.textContent], function (key, val) {
                    lk_item = document.createElement('li')
                    lk_item.appendChild(document.createTextNode(val));
                    landkreisDrop.appendChild(lk_item)
                    valueArrayLk.push(val) 
                })
                dropdownArrayLk = [...document.querySelectorAll('ul#landkreislist.value-list li')]
                dropdownArrayLk.forEach(item => {
                    item.addEventListener('click', (evt) => {
                        landkreisField.value = item.textContent;
                        dropdownArrayLk.forEach(landkreisDrop => {
                            landkreisDrop.classList.add('closed');
                        });
                    });
                })
            })
            dropdownArrayBl.forEach(bundeslandDrop => {
                bundeslandDrop.classList.add('closed');
            });
        });
    })

    // auto complete
    bundeslandField.addEventListener('input', () => {
        bundeslandDrop.classList.add('open');
        let inputValue = bundeslandField.value.toLowerCase();
        if (inputValue.length > 0) {
            for (let j = 0; j < valueArrayBl.length; j++) {
                if (!(inputValue.substring(0, inputValue.length) === valueArrayBl[j].substring(0, inputValue.length).toLowerCase())) {
                    dropdownArrayBl[j].classList.add('closed');
                } else {
                    dropdownArrayBl[j].classList.remove('closed');
                }
            }
        } else {
            for (let i = 0; i < dropdownArrayBl.length; i++) {
                dropdownArrayBl[i].classList.remove('closed');
            }
        }
    });

    landkreisField.addEventListener('input', () => {
        landkreisDrop.classList.add('open');
        let inputValue = landkreisField.value.toLowerCase();
        if (inputValue.length > 0) {
            for (let j = 0; j < valueArrayLk.length; j++) {
                if (!(inputValue.substring(0, inputValue.length) === valueArrayLk[j].substring(0, inputValue.length).toLowerCase())) {
                    dropdownArrayLk[j].classList.add('closed');
                } else {
                    dropdownArrayLk[j].classList.remove('closed');
                }
            }
        } else {
            for (let i = 0; i < dropdownArrayLk.length; i++) {
                dropdownArrayLk[i].classList.remove('closed');
            }
        }
    });

    // fill data fields
    $.getJSON( 'api/_/', function() {} )
    .done(function( data ) {
        casesElement.innerHTML = data[Object.keys(data)[0]].All.cases
        deathsElement.innerHTML = data[Object.keys(data)[0]].All.deaths
    })
})

let subNav = document.getElementById('subNav')
let dateRange = document.getElementById('DateRange')
let inOrOut = true

function getLocation(id) {
    let bls = document.getElementsByClassName('Bundesland')
    for (let index = 0; index < bls.length; index++) {
        bls[index].style.display = 'block'
        
    }
    document.getElementById(id).style.display = 'none'

    bundeslandField.value = id
    landkreisField.value = ''
    $.getJSON('data/_/_/', function (data) {
        $(landkreisDrop).empty()
        valueArrayLk = []
        $.each(data.geo[id], function (key, val) {
            lk_item = document.createElement('li')
            lk_item.appendChild(document.createTextNode(val));
            landkreisDrop.appendChild(lk_item)
            valueArrayLk.push(val)   
        })
        dropdownArrayLk = [...document.querySelectorAll('ul#landkreislist.value-list li')]
        dropdownArrayLk.forEach(item => {
            item.addEventListener('click', (evt) => {
                landkreisField.value = item.textContent;
                dropdownArrayLk.forEach(landkreisDrop => {
                    landkreisDrop.classList.add('closed');
                });
            });
        })
    })
    dropdownArrayBl.forEach(bundeslandDrop => {
        bundeslandDrop.classList.add('closed');
    });
}

dateRange.addEventListener("click", function() {
    if (inOrOut) {
        subNav.style.transform = "translateY(4rem)"
        dateRange.style.transform = "translateY(4rem) scale(-1,-1)"
        inOrOut = false
    } else {
        subNav.style.transform = "translateY(0)"
        dateRange.style.transform = "translateY(0) scale(1,1)"
        inOrOut = true
    }
})
