const bundeslandField = document.getElementById('bundesland');
const landkreisField = document.getElementById('landkreis');
const bundeslandDrop = document.getElementById('bundeslandlist');
const landkreisDrop = document.getElementById('landkreislist');

bundeslandField.placeholder = 'Select Bundesland';
landkreisField.placeholder = 'Select Landkreis';

let valueArrayBl = [];
let valueArrayLk = [];

$.getJSON('api/2020-11-14/', function (data) {
    $.each(data, function (key, val) {
        item = document.createElement('li')
        item.appendChild(document.createTextNode(key));
        bundeslandDrop.appendChild(item)
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
            bundeslandField.value = item.textContent;
            if (bundeslandField.value !== 'All') {
                $.getJSON('api/2020-11-14/' + item.textContent, function (data) {
                    $(landkreisDrop).empty()
                    landkreisField.value = ''
                    valueArrayLk = []
                    $.each(data, function (key, val) {
                        lk_item = document.createElement('li')
                        lk_item.appendChild(document.createTextNode(key));
                        landkreisDrop.appendChild(lk_item)
                        valueArrayLk.push(key)
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
            } else {
                landkreisField.value = 'All'
            }
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
});