const stateSelect = document.querySelector('#state');
const stateContainer = document.querySelector('.state-select-container');

const customStateSelect = document.createElement('div');
customStateSelect.className = 'custom-select';
customStateSelect.innerHTML = `
    <div class="select-box">Select a State</div>
    <div class="options-container">
        ${Array.from(stateSelect.options).map(option => `
            <div class="option" data-value="${option.value}">${option.text}</div>
        `).join('')}
    </div>
`;

stateSelect.style.display = 'none';
stateContainer.appendChild(customStateSelect);

const stateSelectBox = customStateSelect.querySelector('.select-box');
const stateOptionsContainer = customStateSelect.querySelector('.options-container');
const stateOptions = customStateSelect.querySelectorAll('.option');

let selectedState = '';

stateSelectBox.addEventListener('click', () => {
    stateOptionsContainer.classList.toggle('active');
});

stateOptions.forEach(option => {
    option.addEventListener('click', () => {
        const value = option.dataset.value;
        const text = option.textContent;
        
        stateSelectBox.textContent = text;
        
        stateSelect.value = value;
        
        stateOptionsContainer.classList.remove('active');

        stateOptions.forEach(opt => opt.classList.remove('selected'));

        if (value !== '') {
            option.classList.add('selected');
        }
    });
});

document.addEventListener('click', (e) => {
    if (!customStateSelect.contains(e.target)) {
        stateOptionsContainer.classList.remove('active');
    }
});

const skillsSelect = document.querySelector('#skills');
const skillsContainer = document.querySelector('.multi-select-container');

const customSelect = document.createElement('div');
customSelect.className = 'custom-select';
customSelect.innerHTML = `
    <div class="select-box">Select Skills</div>
    <div class="options-container">
        <div class="option" data-value="Leadership">Leadership</div>
        <div class="option" data-value="Fundraising">Fundraising</div>
        <div class="option" data-value="Mentoring">Mentoring</div>
        <div class="option" data-value="Data-Entry">Data Entry</div>
        <div class="option" data-value="Time-Management">Time Management</div>
        <div class="option" data-value="Language-Skills">Language Skills</div>
    </div>
`;

skillsSelect.style.display = 'none';
skillsContainer.appendChild(customSelect);

const selectBox = customSelect.querySelector('.select-box');
const optionsContainer = customSelect.querySelector('.options-container');
const options = customSelect.querySelectorAll('.option');

let selectedSkills = new Set();

selectBox.addEventListener('click', () => {
    optionsContainer.classList.toggle('active');
});

options.forEach(option => {
    option.addEventListener('click', () => {
        const value = option.dataset.value;
        if (selectedSkills.has(value)) {
            selectedSkills.delete(value);
            option.classList.remove('selected');
        } else {
            selectedSkills.add(value);
            option.classList.add('selected');
        }
        updateSelectBox();
    });
});

function updateSelectBox() {
    if (selectedSkills.size === 0) {
        selectBox.textContent = 'Select Skills';
    } else {
        selectBox.textContent = Array.from(selectedSkills).join(', ');
    }
}

document.addEventListener('click', (e) => {
    if (!customSelect.contains(e.target)) {
        optionsContainer.classList.remove('active');
    }
});

const availabilityContainer = document.querySelector('.availability-container');
const dateSelections = document.querySelector('.date-selections');

const calendar = document.createElement('div');
calendar.className = 'calendar';

let selectedDates = new Set();
let currentDate = new Date();

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function updateSelectedDatesDisplay() {
    const selectedDatesContainer = document.querySelector('.selected-dates');
    if (selectedDates.size === 0) {
        selectedDatesContainer.innerHTML = '<p>No dates selected</p>';
        return;
    }

    const sortedDates = Array.from(selectedDates)
        .map(dateStr => new Date(dateStr))
        .sort((a, b) => a - b)
        .map(date => formatDate(date));

    const datesList = sortedDates.map(date => `<div class="selected-date-item">
        <span>${date}</span>
        <button class="remove-date" data-date="${date}">×</button>
    </div>`).join('');

    selectedDatesContainer.innerHTML = datesList;

    document.querySelectorAll('.remove-date').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const dateToRemove = button.dataset.date;
            selectedDates.delete(dateToRemove);
            updateSelectedDatesDisplay();
            // Update calendar display
            const dateCell = document.querySelector(`.date-cell[data-date="${dateToRemove}"]`);
            if (dateCell) {
                dateCell.classList.remove('selected');
            }
        });
    });
}

function createCalendar() {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    calendar.innerHTML = `
        <div class="calendar-header">
            <button class="prev-month">←</button>
            <span>${monthNames[currentMonth]} ${currentYear}</span>
            <button class="next-month">→</button>
        </div>
        <div class="calendar-days">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div>
            <div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div class="calendar-dates"></div>
        <div class="selected-dates"></div>
    `;
    
    const datesContainer = calendar.querySelector('.calendar-dates');
    
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        datesContainer.appendChild(emptyDay);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateCell = document.createElement('div');
        dateCell.className = 'date-cell';
        dateCell.textContent = day;
        
        const cellDate = new Date(currentYear, currentMonth, day);
        const formattedDate = formatDate(cellDate);
        dateCell.dataset.date = formattedDate;
        
        if (selectedDates.has(formattedDate)) {
            dateCell.classList.add('selected');
        }
        
        dateCell.addEventListener('click', () => {
            dateCell.classList.toggle('selected');
            if (selectedDates.has(formattedDate)) {
                selectedDates.delete(formattedDate);
            } else {
                selectedDates.add(formattedDate);
            }
            updateSelectedDatesDisplay();
        });
        
        datesContainer.appendChild(dateCell);
    }
    
    updateSelectedDatesDisplay();
}

dateSelections.innerHTML = '';
dateSelections.appendChild(calendar);
createCalendar();

calendar.addEventListener('click', (e) => {
    if (e.target.classList.contains('prev-month')) {
        currentDate.setMonth(currentDate.getMonth() - 1);
        createCalendar();
    } else if (e.target.classList.contains('next-month')) {
        currentDate.setMonth(currentDate.getMonth() + 1);
        createCalendar();
    }
});