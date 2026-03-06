import { loadSoberDays, saveSoberDays } from "./storage.js";
import { createDateKey, getMonthName } from "./utils.js";
import { updateAllStats, updateStreakSectionProgress } from "./stats.js";
import { updateClearHistoryState } from "./ui.js";

const calendar = document.querySelector('.calendar');
const prev = calendar.querySelector('.prev');
const next = calendar.querySelector('.next');

const calendarInfo = document.querySelector('.calendar-info__span');
const todayButton = document.querySelector('.today-btn');
let calendarState = {
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1
};
const body = document.querySelector('.body');

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
    navigateCalendar('next', body);
});

prev.addEventListener('click', function() {
    navigateCalendar('prev', body);
});

function navigateCalendar(direction, body) {
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

function updateCalendarInfo(year, month) {
    const monthName = getMonthName(month);
    calendarInfo.textContent = `${monthName} ${year}`;
}

function updateCurrentDate() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    todayButton.textContent = `${day}.${month}.${year}`;
}

function toggleDate(td, dateKey, soberDays) {
    td.classList.toggle('marked');

    if(td.classList.contains('marked')) {
        soberDays[dateKey] = true;
    } else {
        delete soberDays[dateKey];
    }
    saveSoberDays(soberDays);
    updateAllStats();
    updateStreakSectionProgress(); 
    updateClearHistoryState();
}   

export { draw, updateCalendarInfo, updateCurrentDate, calendarState }