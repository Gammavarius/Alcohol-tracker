import { loadSoberDays, totalDaysWin } from './storage.js';
import { getDayName, formateDate, isNextDay, isYesterdayOrToday } from './utils.js';

const totalSoberDays = document.querySelector('.total-days span');

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
            <p class="history-series">
                <span class="" session-quantity history-quantity>${pastSeriesQuantity}</span> 
                <span class="session-dates history-days">${pastSeriesDays}</span>
            </p>
        `
    })
    return historyContainer;
}

function updateAllStats() {
    updateTotalCounter();
    updateCurrentSeries();
    updateBestSeries();
    updateHistorySeries();
}

function updateTotalCounter() {
    const daysCount = totalDaysWin();
    totalSoberDays.textContent = `ВСЕГО ${getDayName(daysCount)}`;
}

function updateStreakSectionProgress() {
    const streakSectionDays = document.querySelector('.progress-container p');
    const daysCount = totalDaysWin();
    streakSectionDays.textContent = `${getDayName(daysCount)}`;
}

export { 
    getAllSeries,
    getCurrentSeries,
    updateCurrentSeries,
    getBestSeries,
    updateBestSeries,
    getHistorySeries,
    updateHistorySeries,
    updateAllStats,
    updateStreakSectionProgress,
    totalDaysWin
};