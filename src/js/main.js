import{ draw, updateCalendarInfo, updateCurrentDate, calendarState } from './modules/calendar.js';
import { updateAllStats, updateStreakSectionProgress, getCurrentSeries } from './modules/stats.js';
import { historyButtonToggle, clearHistoryButton, updateClearHistoryState, themeToggleFunction } from './modules/ui.js';
const body = document.querySelector('.body');

function initApp() {
    draw(body, calendarState.currentYear, calendarState.currentMonth);
    updateStreakSectionProgress()
    updateCalendarInfo(calendarState.currentYear, calendarState.currentMonth);
    updateCurrentDate();
    updateAllStats();
    historyButtonToggle();
    clearHistoryButton();
    updateClearHistoryState();
    themeToggleFunction();
}

document.addEventListener('DOMContentLoaded', initApp);