let calendar = document.querySelector('#calendar');
let body = document.querySelector('.body');
let prev = calendar.querySelector('.prev');
let next = calendar.querySelector('.next');
let calendarInfo = document.querySelector('.calendar-info__span');
let todayButton = document.querySelector('.today-btn');
let totalSoberDays = document.querySelector('.total-days p');

let calendarState = {
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1
};
    
function draw(body, year, month) {
    let lastDay = getLastDay(year, month);
    let arr = range(year, month, 1, lastDay, true);
    let firstWeekDay = getFirstWeekDay(year, month);
    let lastWeekDay = getLastWeekDay(year, month);

    let nums = chunk(normalize(arr, firstWeekDay, lastWeekDay, year, month), 7);
    createTable(body, nums);
    updateCalendarInfo(year, month);
}

function createTable(parent, arr) {
	parent.innerHTML = '';
    let cells = [];
    let soberDays = loadSoberDays();
    let today = new Date();
    let todayForCompare = new Date();
    todayForCompare.setHours(0, 0, 0, 0);
    

    for(let i = 0; i < arr.length; i++) {
        let tr = document.createElement('tr');
        for(let j = 0; j < arr[i].length; j++) {
            let td = document.createElement('td');
            let cellData = arr[i][j];

            td.textContent = cellData.day;

            if(td.textContent === '' || td.textContent == undefined) {
                tr.appendChild(td);
                continue;
            }
            
            if(!cellData.isCurrentMonth) {
                td.classList.add('other-month');
            }

            let cellDate = new Date(cellData.year, cellData.month - 1, cellData.day);
            let isToday = cellData.year === today.getFullYear() &&
                          cellData.month === today.getMonth() + 1 &&
                          cellData.day === today.getDate();
            let isPast = cellDate < todayForCompare;
            let isFuture = cellDate > todayForCompare;

            if (isToday) {
                td.classList.add('today');
            }

            if (isPast || isToday) {
                let dateKey = createDateKey(cellData.year, cellData.month, cellData.day);

                if(soberDays[dateKey]) {
                    td.classList.add('marked')
                }

                td.addEventListener('click', () => toggleDate(td, dateKey, soberDays));
            } else if (isFuture) {
                td.classList.add('future-day');
            }
            
            tr.appendChild(td);
            cells.push(td);
        }
        parent.appendChild(tr);
    }
    return cells;
}

function normalize(arr, firstWeekDay, lastWeekDay, year, month) {
    let prevMonth = month - 1 || 12;
    let prevYear = month === 1 ? year - 1 : year;
    let daysInPrevMonth = getLastDay(prevYear, prevMonth);
    let prevDaysStart = daysInPrevMonth - firstWeekDay + 1    
    let prevDays = range(prevYear, prevMonth, prevDaysStart, daysInPrevMonth, false);

    let nextMonth = month === 12 ? 1 : month + 1;
    let nextYear = month == 12 ? year + 1 : year;
    let nextDays = range(nextYear, nextMonth, 1, 6-lastWeekDay, false)

    return [...prevDays, ...arr, ...nextDays];
}

function getFirstWeekDay(year, month) {
    let date = new Date(year, month - 1, 1);
    let num = date.getDay();
    if(num == 0) {
        return 6
    } else {
        return num - 1;
    }
}

function getLastWeekDay(year, month) {
    let date = new Date(year, month, 0);
    let num = date.getDay();
    
    if(num == 0) {
        return 6;
    } else {
        return num - 1;
    }
}

function getLastDay(year, month) {
    return new Date(year, month, 0).getDate();
}

function range(year, month, start, end, isCurrentMonth = true) {
    const result = [];
    for(let day = start; day <= end; day++) {
        result.push({
            day: day,
            month: month,
            year: year,
            isCurrentMonth: isCurrentMonth
        });
    }
    return result;
}

function chunk(arr, n) {
    let result = [];
    for(let i = 0; i < arr.length; i += n) {
        result.push(arr.slice(i, i + n));
    }
    return result;
}

next.addEventListener('click', function() {
    navigateCalendar('next');
});

prev.addEventListener('click', function() {
    navigateCalendar('prev');
});

function getNextYear(year, month) {
    if(month == 12) {
        return year + 1;
    } else {
        return year;
    }
}

function getNextMonth(month) {
    if(month == 12) {
        return 1;
    } else {
        return month + 1;
    }
}

function getPrevYear(year, month) {
    if(month == 1) {
        return year - 1;
    } else {
        return year;
    }
}

function getPrevMonth(month) {
    if (month == 1) {
        return 12;
    } else {
        return month - 1;
    }
}

function getMonthName(month) {
    const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    return months[month - 1];
}

function updateCalendarInfo(year, month) {
    const monthName = getMonthName(month);
    calendarInfo.textContent = `${monthName} ${year}`;
}

function navigateCalendar(direction) {
    let currentYear = calendarState.currentYear;
    let currentMonth = calendarState.currentMonth;
    let newYear, newMonth;

    if(direction === 'next') {
        newYear = getNextYear(currentYear, currentMonth);
        newMonth = getNextMonth(currentMonth);
    } else {
        newYear = getPrevYear(currentYear, currentMonth);
        newMonth = getPrevMonth(currentMonth);
    }

    calendarState.currentYear = newYear;
    calendarState.currentMonth = newMonth;
    draw(body, newYear, newMonth)
}

todayButton.addEventListener('click', function() {
    let currentDate = new Date();
    let newYear = currentDate.getFullYear();
    let newMonth = currentDate.getMonth() + 1;

    calendarState.currentYear = newYear;
    calendarState.currentMonth = newMonth;
    
    draw(body, newYear, newMonth);
    updateCurrentDate();
})

function updateCurrentDate() {
    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();

    todayButton.textContent = `${day}.${month}.${year}`;
}

function loadSoberDays() {
    const data = localStorage.getItem('soberDays')
    return data ? JSON.parse(data) : {};
}

function saveSoberDays(data) {
    localStorage.setItem('soberDays', JSON.stringify(data));
}

function createDateKey(year, month, day) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function toggleDate(td, dateKey, soberDays) {
    td.classList.toggle('marked');

    if(td.classList.contains('marked')) {
        soberDays[dateKey] = true;
    } else {
        delete soberDays[dateKey];
    }
    saveSoberDays(soberDays);
    updateTotalCounter();
}   

function totalDaysWin () {
    const totalSober = localStorage.getItem('soberDays');
    const totalSoberObj = JSON.parse(totalSober || '{}')
    const totalSoberArr = Object.keys(totalSoberObj);
    return totalSoberArr.length;
}

function updateTotalCounter() {
    let daysCount = totalDaysWin();
    totalSoberDays.textContent = `ВСЕГО ${
        getDeclension({
        count: daysCount,
        one: 'день',
        few: 'дня', 
        many: 'дней'}) 
        }`;
}
function isNextDay(prevDateStr, nextDateStr) {
    const expected = new Date(prevDateStr);
    expected.setDate(expected.getDate() + 1);

    return expected.toISOString().slice(0, 10) === nextDateStr;
}

function getAllSeries() {
    const allSeries = loadSoberDays();
    const dates = Object.keys(allSeries).sort();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastDates = dates.filter(dateStr => {
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);
        return date <= today
    })

    if(pastDates.length === 0) return [];

    const series = []
    let currentSeries = {
        start: pastDates[0],
        end: pastDates[0],
        days: 1
    };

    for(let i = 1; i < pastDates.length; i++) {
        const currentDate = dates[i];
        const prevDate = dates[i - 1];

        if(isNextDay(prevDate, currentDate)) {
            currentSeries.end = currentDate;
            currentSeries.days++;
        } else {
            series.push(currentSeries);
            currentSeries = {
                start: currentDate,
                end: currentDate,
                days: 1
            };
        }
    }
    series.push(currentSeries);
    return series
}
function cleanupOldData() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const soberDays = loadSoberDays();
    let changed = false;

    Object.keys(soberDays).forEach(dateStr => {
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);

        if(date > today) {
            delete soberDays[dateStr];
            changed = true;
            console.log('Удалена будущая дата:', dateStr);
        }
    });

    if(changed) {
        saveSoberDays(soberDays);
        console.log("Данные очищены");
    }
}

draw(body, calendarState.currentYear, calendarState.currentMonth);
updateCalendarInfo(calendarState.currentYear, calendarState.currentMonth);
updateCurrentDate();
updateTotalCounter();
console.log('soberDays в localStorage:', localStorage.getItem('soberDays'));
console.log(getAllSeries());
console.log(JSON.parse(localStorage.getItem('soberDays')));
cleanupOldData();