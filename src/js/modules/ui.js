import { getHistorySeries, updateAllStats, updateStreakSectionProgress } from './stats.js';
import { loadSoberDays } from './storage.js';
import { draw, calendarState } from './calendar.js';

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

function themeToggleFunction() {
    const lightThemeButton = document.querySelector('.light-theme-button');
    const darkThemeButton = document.querySelector('.dark-theme-button');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');

    if(savedTheme === 'dark') {
        body.classList.add('dark');
        darkThemeButton.classList.add('active');
        lightThemeButton.classList.remove('active');
    } else {
        body.classList.remove('dark');
        darkThemeButton.classList.remove('active');
        lightThemeButton.classList.add('active');
    }

    lightThemeButton.onclick = function() {
        lightThemeButton.classList.add('active');
        darkThemeButton.classList.remove('active');
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }

    darkThemeButton.onclick = function() {
        darkThemeButton.classList.add('active');
        lightThemeButton.classList.remove('active');
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

export { historyButtonToggle, clearHistoryButton, updateClearHistoryState, themeToggleFunction };