const calendar = document.querySelector('.calendar');
const body = document.querySelector('.body');
const prev = calendar.querySelector('.prev');
const next = calendar.querySelector('.next');
const calendarInfo = document.querySelector('.calendar-info__span');
const todayButton = document.querySelector('.today-btn');
const totalSoberDays = document.querySelector('.total-days span');


let calendarState = {
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1
};
    
function draw(body, year, month) {
    const lastDay = getLastDay(year, month);
    const arr = range(year, month, 1, lastDay, true);
    const firstWeekDay = getFirstWeekDay(year, month);
    const lastWeekDay = getLastWeekDay(year, month);

    const nums = chunk(normalize(arr, firstWeekDay, lastWeekDay, year, month), 7);
    createTable(body, nums);
    updateCalendarInfo(year, month);
}

function createTable(parent, arr) {
	parent.innerHTML = '';
    const cells = [];
    const soberDays = loadSoberDays();
    const today = new Date();
    const todayForCompare = new Date();
    todayForCompare.setHours(0, 0, 0, 0);
    

    for(let i = 0; i < arr.length; i++) {
        let tr = document.createElement('tr');
        for(let j = 0; j < arr[i].length; j++) {
            let td = document.createElement('td');
            const cellData = arr[i][j];

            td.textContent = cellData.day;

            if(td.textContent === '' || td.textContent == undefined) {
                tr.appendChild(td);
                continue;
            }
            
            if(!cellData.isCurrentMonth) {
                td.classList.add('other-month');
            }

            const cellDate = new Date(cellData.year, cellData.month - 1, cellData.day);
            const isToday = cellData.year === today.getFullYear() &&
                          cellData.month === today.getMonth() + 1 &&
                          cellData.day === today.getDate();
            const isPast = cellDate < todayForCompare;
            const isFuture = cellDate > todayForCompare;

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
    const prevMonth = month - 1 || 12;
    const prevYear = month === 1 ? year - 1 : year;
    const daysInPrevMonth = getLastDay(prevYear, prevMonth);
    const prevDaysStart = daysInPrevMonth - firstWeekDay + 1    
    const prevDays = range(prevYear, prevMonth, prevDaysStart, daysInPrevMonth, false);

    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month == 12 ? year + 1 : year;
    const nextDays = range(nextYear, nextMonth, 1, 6-lastWeekDay, false)

    return [...prevDays, ...arr, ...nextDays];
}

function getFirstWeekDay(year, month) {
    const date = new Date(year, month - 1, 1);
    const num = date.getDay();
    if(num == 0) {
        return 6
    } else {
        return num - 1;
    }
}

function getLastWeekDay(year, month) {
    const date = new Date(year, month, 0);
    const num = date.getDay();
    
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
    const result = [];
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
    const currentYear = calendarState.currentYear;
    const currentMonth = calendarState.currentMonth;
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
    const currentDate = new Date();
    const newYear = currentDate.getFullYear();
    const newMonth = currentDate.getMonth() + 1;

    calendarState.currentYear = newYear;
    calendarState.currentMonth = newMonth;
    
    draw(body, newYear, newMonth);
})

function updateCurrentDate() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

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
    updateAllStats();
    updateStreakSectionProgress(); 
    updateClearHistoryState();
}   

function totalDaysWin () {
    const totalSober = localStorage.getItem('soberDays');
    const totalSoberObj = JSON.parse(totalSober || '{}')
    const totalSoberArr = Object.keys(totalSoberObj);
    return totalSoberArr.length;
}

function updateTotalCounter() {
    const daysCount = totalDaysWin();
    totalSoberDays.textContent = `ВСЕГО ${getDayName(daysCount)}`;
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
        const currentDate = pastDates[i];
        const prevDate = pastDates[i - 1];

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
    return series;
}

function isYesterdayOrToday(dateStr) {
    const inputDate = new Date(dateStr);
    inputDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return (
    inputDate.getTime() === today.getTime() || 
    inputDate.getTime() == yesterday.getTime()
    );
    
}

function getCurrentSeries() {
    const allSeriesCount = getAllSeries();
    if(allSeriesCount.length === 0) {
        return null
    }
    const latestSeries = allSeriesCount[allSeriesCount.length - 1];
    
    if(isYesterdayOrToday(latestSeries.end)) {
        return latestSeries;
    } else {
        return null;
    }
}

function updateCurrentSeries() {
    const currentSeries = getCurrentSeries();
    const currentQuantity = document.querySelector('.current-quantity');
    const currentDates = document.querySelector('.current-dates');

    if(currentSeries) {
    currentQuantity.textContent = `${getDayName(currentSeries.days)}`;
    currentDates.textContent = `${formateDate(currentSeries.start)} - ${formateDate(currentSeries.end)}`;
    } else {
        const messages = [
            "Каждый день важен!", 
            "Начните сегодня!", 
            "Ваш рекорд ждёт!",
            "Сегодня - ваш день!",
            "Каждый день имеет значение!"
        ];
        currentQuantity.textContent = "";
        currentDates.textContent = messages[Math.floor(Math.random() * messages.length)];
    }
}

function getBestSeries() {
    let allSeriesCount = getAllSeries();
    if(allSeriesCount.length === 0) return null

    let bestSeries = allSeriesCount[0];
    for (let i = 1; i < allSeriesCount.length; i++) {
        if (allSeriesCount[i].days > bestSeries.days) {
            bestSeries = allSeriesCount[i];
        }
    }
    return bestSeries;
}

function updateBestSeries() {
    const bestSeries = getBestSeries();
    const bestQuantity = document.querySelector('.best-quantity');
    const bestDays = document.querySelector('.best-days');
    if(bestSeries) {
        bestQuantity.textContent = `${getDayName(bestSeries.days)}`;
        bestDays.textContent = `${formateDate(bestSeries.start)} - ${formateDate(bestSeries.end)}`
    } else {
        const messages = [
            "Каждый день важен!", 
            "Лучшие достижения начинаются сегодня!", 
            "Ваш рекорд ждёт!",
            "Сегодня - ваш день!",
            "Каждый день имеет значение!"
        ]
        bestQuantity.textContent = "";
        bestDays.textContent = messages[Math.floor(Math.random() * messages.length)];
    }
}

function getHistorySeries() {
    const allSeriesCount = getAllSeries();
    const currentSeries = getCurrentSeries();

    if(currentSeries) {
        return allSeriesCount.filter(series => series.start !== currentSeries.start || series.end !== currentSeries.end);
    }
    return allSeriesCount;
}

function updateHistorySeries() {
    const historyContainer = document.querySelector('.history-container');
    const historySeries = getHistorySeries();

    historyContainer.innerHTML = '';

    historySeries.forEach(function(series) {
        const pastSeriesQuantity = getDayName(series.days);
        const pastSeriesDays = formateDate(series.start) + '-' + formateDate(series.end);
        historyContainer.innerHTML += `
            <p class="history-series"><span class="" session-quantity history-quantity>${pastSeriesQuantity}</span> 
            <span class="session-dates history-days">${pastSeriesDays}</span></p>
        `
    })
    return historyContainer;
}

function historyButtonToggle() {
    const historyButton = document.querySelector('.show-history');
    const historyContainer = document.querySelector('.history-container');
    const historySeries = getHistorySeries();

    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'empty-history';
    emptyMessage.textContent = "История пуста. Ваш первый день ждёт!";
    
    historyContainer.appendChild(emptyMessage);
    historyContainer.classList.add('hidden');

    historyButton.addEventListener('click', function() {
        historyContainer.classList.toggle('hidden');

        if(historyContainer.classList.contains('hidden')) {
            this.textContent = "Показать историю";
            emptyMessage.style.display = 'none';
        } else {
            this.textContent = "Скрыть историю";

            if(historySeries.length === 0) {
                emptyMessage.style.display = 'block';
            } else {
                emptyMessage.style.display = 'none';
            }
            
        }
    })
}

function updateStreakSectionProgress() {
    const streakSectionDays = document.querySelector('.progress-container p');
    const daysCount = totalDaysWin();
    streakSectionDays.textContent = `${getDayName(daysCount)}`;
}

function clearHistoryButton() {
    const clearButton = document.querySelector('.clear-history');
    const soberDays = loadSoberDays();
    if(Object.keys(soberDays).length === 0) {
        clearButton.disabled = true;
    }

    clearButton.addEventListener('click', function() {
        if(confirm("Вы уверены, что хотите удалить ВСЮ историю и обнулить статистику?")) {
        localStorage.removeItem('soberDays');

        updateAllStats();
        updateStreakSectionProgress();
        draw(body, calendarState.currentYear, calendarState.currentMonth);
        this.disabled = true;
        alert("История очищена! Вы можете начать заново!");
        }
    })
}

function updateClearHistoryState() {
    const clearButton = document.querySelector('.clear-history');
    const soberDays = loadSoberDays();
    const hasData = Object.keys(soberDays).length > 0;

    clearButton.disabled = !hasData;
}

function updateAllStats() {
    updateTotalCounter();
    updateCurrentSeries();
    updateBestSeries();
    updateHistorySeries();
}

function initApp() {
    draw(body, calendarState.currentYear, calendarState.currentMonth);
    updateStreakSectionProgress()
    updateCalendarInfo(calendarState.currentYear, calendarState.currentMonth);
    updateCurrentDate();
    updateAllStats();
    historyButtonToggle();
    clearHistoryButton();
    updateClearHistoryState();
}

document.addEventListener('DOMContentLoaded', initApp);