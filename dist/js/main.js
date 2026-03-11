(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _calendar = require("./modules/calendar.js");
var _stats = require("./modules/stats.js");
var _ui = require("./modules/ui.js");
var body = document.querySelector('.body');
function initApp() {
  (0, _calendar.draw)(body, _calendar.calendarState.currentYear, _calendar.calendarState.currentMonth);
  (0, _stats.updateStreakSectionProgress)();
  (0, _calendar.updateCalendarInfo)(_calendar.calendarState.currentYear, _calendar.calendarState.currentMonth);
  (0, _calendar.updateCurrentDate)();
  (0, _stats.updateAllStats)();
  (0, _ui.historyButtonToggle)();
  (0, _ui.clearHistoryButton)();
  (0, _ui.updateClearHistoryState)();
  (0, _ui.themeToggleFunction)();
}
document.addEventListener('DOMContentLoaded', initApp);

},{"./modules/calendar.js":2,"./modules/stats.js":3,"./modules/ui.js":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calendarState = void 0;
exports.draw = draw;
exports.updateCalendarInfo = updateCalendarInfo;
exports.updateCurrentDate = updateCurrentDate;
var _storage = require("./storage.js");
var _utils = require("./utils.js");
var _stats = require("./stats.js");
var _ui = require("./ui.js");
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var body = document.querySelector('.body');
var calendar = document.querySelector('.calendar');
var prev = calendar.querySelector('.prev');
var next = calendar.querySelector('.next');
var calendarInfo = document.querySelector('.calendar-info__span');
var todayButton = document.querySelector('.today-btn');
var calendarState = exports.calendarState = {
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1
};
function draw(body, year, month) {
  var lastDay = getLastDay(year, month);
  var arr = range(year, month, 1, lastDay, true);
  var firstWeekDay = getFirstWeekDay(year, month);
  var lastWeekDay = getLastWeekDay(year, month);
  var nums = chunk(normalize(arr, firstWeekDay, lastWeekDay, year, month), 7);
  createTable(body, nums);
  updateCalendarInfo(year, month);
}
function createTable(parent, arr) {
  parent.innerHTML = '';
  var cells = [];
  var soberDays = (0, _storage.loadSoberDays)();
  var today = new Date();
  var todayForCompare = new Date();
  todayForCompare.setHours(0, 0, 0, 0);
  for (var i = 0; i < arr.length; i++) {
    var tr = document.createElement('tr');
    var _loop = function _loop() {
      var td = document.createElement('td');
      var cellData = arr[i][j];
      td.textContent = cellData.day;
      if (td.textContent === '' || td.textContent == undefined) {
        tr.appendChild(td);
        return 1; // continue
      }
      if (!cellData.isCurrentMonth) {
        td.classList.add('other-month');
      }
      var cellDate = new Date(cellData.year, cellData.month - 1, cellData.day);
      var isToday = cellData.year === today.getFullYear() && cellData.month === today.getMonth() + 1 && cellData.day === today.getDate();
      var isPast = cellDate < todayForCompare;
      var isFuture = cellDate > todayForCompare;
      if (isToday) {
        td.classList.add('today');
      }
      if (isPast || isToday) {
        var dateKey = (0, _utils.createDateKey)(cellData.year, cellData.month, cellData.day);
        if (soberDays[dateKey]) {
          td.classList.add('marked');
        }
        td.addEventListener('click', function () {
          return toggleDate(td, dateKey, soberDays);
        });
      } else if (isFuture) {
        td.classList.add('future-day');
      }
      tr.appendChild(td);
      cells.push(td);
    };
    for (var j = 0; j < arr[i].length; j++) {
      if (_loop()) continue;
    }
    parent.appendChild(tr);
  }
  return cells;
}
function normalize(arr, firstWeekDay, lastWeekDay, year, month) {
  var prevMonth = month - 1 || 12;
  var prevYear = month === 1 ? year - 1 : year;
  var daysInPrevMonth = getLastDay(prevYear, prevMonth);
  var prevDaysStart = daysInPrevMonth - firstWeekDay + 1;
  var prevDays = range(prevYear, prevMonth, prevDaysStart, daysInPrevMonth, false);
  var nextMonth = month === 12 ? 1 : month + 1;
  var nextYear = month == 12 ? year + 1 : year;
  var nextDays = range(nextYear, nextMonth, 1, 6 - lastWeekDay, false);
  return [].concat(_toConsumableArray(prevDays), _toConsumableArray(arr), _toConsumableArray(nextDays));
}
function getFirstWeekDay(year, month) {
  var date = new Date(year, month - 1, 1);
  var num = date.getDay();
  if (num == 0) {
    return 6;
  } else {
    return num - 1;
  }
}
function getLastWeekDay(year, month) {
  var date = new Date(year, month, 0);
  var num = date.getDay();
  if (num == 0) {
    return 6;
  } else {
    return num - 1;
  }
}
function getLastDay(year, month) {
  return new Date(year, month, 0).getDate();
}
function range(year, month, start, end) {
  var isCurrentMonth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var result = [];
  for (var day = start; day <= end; day++) {
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
  var result = [];
  for (var i = 0; i < arr.length; i += n) {
    result.push(arr.slice(i, i + n));
  }
  return result;
}
next.addEventListener('click', function () {
  navigateCalendar('next');
});
prev.addEventListener('click', function () {
  navigateCalendar('prev');
});
function getNextYear(year, month) {
  if (month == 12) {
    return year + 1;
  } else {
    return year;
  }
}
function toggleDate(td, dateKey, soberDays) {
  td.classList.toggle('marked');
  if (td.classList.contains('marked')) {
    soberDays[dateKey] = true;
  } else {
    delete soberDays[dateKey];
  }
  (0, _storage.saveSoberDays)(soberDays);
  (0, _stats.updateAllStats)();
  (0, _stats.updateStreakSectionProgress)();
  (0, _ui.updateClearHistoryState)();
}
function getNextMonth(month) {
  if (month == 12) {
    return 1;
  } else {
    return month + 1;
  }
}
function getPrevYear(year, month) {
  if (month == 1) {
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
  var monthName = (0, _utils.getMonthName)(month);
  calendarInfo.textContent = "".concat(monthName, " ").concat(year);
}
function navigateCalendar(direction) {
  var currentYear = calendarState.currentYear;
  var currentMonth = calendarState.currentMonth;
  var newYear, newMonth;
  if (direction === 'next') {
    newYear = getNextYear(currentYear, currentMonth);
    newMonth = getNextMonth(currentMonth);
  } else {
    newYear = getPrevYear(currentYear, currentMonth);
    newMonth = getPrevMonth(currentMonth);
  }
  calendarState.currentYear = newYear;
  calendarState.currentMonth = newMonth;
  draw(body, newYear, newMonth);
}
todayButton.addEventListener('click', function () {
  var currentDate = new Date();
  var newYear = currentDate.getFullYear();
  var newMonth = currentDate.getMonth() + 1;
  calendarState.currentYear = newYear;
  calendarState.currentMonth = newMonth;
  draw(body, newYear, newMonth);
});
function updateCurrentDate() {
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  todayButton.textContent = "".concat(day, ".").concat(month, ".").concat(year);
}

},{"./stats.js":3,"./storage.js":4,"./ui.js":5,"./utils.js":6}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllSeries = getAllSeries;
exports.getBestSeries = getBestSeries;
exports.getCurrentSeries = getCurrentSeries;
exports.getHistorySeries = getHistorySeries;
Object.defineProperty(exports, "totalDaysWin", {
  enumerable: true,
  get: function get() {
    return _storage.totalDaysWin;
  }
});
exports.updateAllStats = updateAllStats;
exports.updateBestSeries = updateBestSeries;
exports.updateCurrentSeries = updateCurrentSeries;
exports.updateHistorySeries = updateHistorySeries;
exports.updateStreakSectionProgress = updateStreakSectionProgress;
var _storage = require("./storage.js");
var _utils = require("./utils.js");
var totalSoberDays = document.querySelector('.total-days span');
function getAllSeries() {
  var allSeries = (0, _storage.loadSoberDays)();
  var dates = Object.keys(allSeries).sort();
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var pastDates = dates.filter(function (dateStr) {
    var date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    return date <= today;
  });
  if (pastDates.length === 0) return [];
  var series = [];
  var currentSeries = {
    start: pastDates[0],
    end: pastDates[0],
    days: 1
  };
  for (var i = 1; i < pastDates.length; i++) {
    var currentDate = pastDates[i];
    var prevDate = pastDates[i - 1];
    if ((0, _utils.isNextDay)(prevDate, currentDate)) {
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
  var allSeriesCount = getAllSeries();
  if (allSeriesCount.length === 0) {
    return null;
  }
  var latestSeries = allSeriesCount[allSeriesCount.length - 1];
  if ((0, _utils.isYesterdayOrToday)(latestSeries.end)) {
    return latestSeries;
  } else {
    return null;
  }
}
function updateCurrentSeries() {
  var currentSeries = getCurrentSeries();
  var currentQuantity = document.querySelector('.current-quantity');
  var currentDates = document.querySelector('.current-dates');
  if (currentSeries) {
    currentQuantity.textContent = "".concat((0, _utils.getDayName)(currentSeries.days));
    currentDates.textContent = "".concat((0, _utils.formateDate)(currentSeries.start), " - ").concat((0, _utils.formateDate)(currentSeries.end));
  } else {
    var messages = ["Каждый день важен!", "Начните сегодня!", "Ваш рекорд ждёт!", "Сегодня - ваш день!", "Каждый день имеет значение!"];
    currentQuantity.textContent = "";
    currentDates.textContent = messages[Math.floor(Math.random() * messages.length)];
  }
}
function getBestSeries() {
  var allSeriesCount = getAllSeries();
  if (allSeriesCount.length === 0) return null;
  var bestSeries = allSeriesCount[0];
  for (var i = 1; i < allSeriesCount.length; i++) {
    if (allSeriesCount[i].days > bestSeries.days) {
      bestSeries = allSeriesCount[i];
    }
  }
  return bestSeries;
}
function updateBestSeries() {
  var bestSeries = getBestSeries();
  var bestQuantity = document.querySelector('.best-quantity');
  var bestDays = document.querySelector('.best-days');
  if (bestSeries) {
    bestQuantity.textContent = "".concat((0, _utils.getDayName)(bestSeries.days));
    bestDays.textContent = "".concat((0, _utils.formateDate)(bestSeries.start), " - ").concat((0, _utils.formateDate)(bestSeries.end));
  } else {
    var messages = ["Каждый день важен!", "Лучшие достижения начинаются сегодня!", "Ваш рекорд ждёт!", "Сегодня - ваш день!", "Каждый день имеет значение!"];
    bestQuantity.textContent = "";
    bestDays.textContent = messages[Math.floor(Math.random() * messages.length)];
  }
}
function getHistorySeries() {
  var allSeriesCount = getAllSeries();
  var currentSeries = getCurrentSeries();
  if (currentSeries) {
    return allSeriesCount.filter(function (series) {
      return series.start !== currentSeries.start || series.end !== currentSeries.end;
    });
  }
  return allSeriesCount;
}
function updateHistorySeries() {
  var historyContainer = document.querySelector('.history-container');
  var historySeries = getHistorySeries();
  historyContainer.innerHTML = '';
  historySeries.forEach(function (series) {
    var pastSeriesQuantity = (0, _utils.getDayName)(series.days);
    var pastSeriesDays = (0, _utils.formateDate)(series.start) + '-' + (0, _utils.formateDate)(series.end);
    historyContainer.innerHTML += "\n            <p class=\"history-series\">\n                <span class=\"\" session-quantity history-quantity>".concat(pastSeriesQuantity, "</span> \n                <span class=\"session-dates history-days\">").concat(pastSeriesDays, "</span>\n            </p>\n        ");
  });
  return historyContainer;
}
function updateAllStats() {
  updateTotalCounter();
  updateCurrentSeries();
  updateBestSeries();
  updateHistorySeries();
}
function updateTotalCounter() {
  var daysCount = (0, _storage.totalDaysWin)();
  totalSoberDays.textContent = "\u0412\u0421\u0415\u0413\u041E ".concat((0, _utils.getDayName)(daysCount));
}
function updateStreakSectionProgress() {
  var streakSectionDays = document.querySelector('.progress-container p');
  var daysCount = (0, _storage.totalDaysWin)();
  streakSectionDays.textContent = "".concat((0, _utils.getDayName)(daysCount));
}

},{"./storage.js":4,"./utils.js":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadSoberDays = loadSoberDays;
exports.saveSoberDays = saveSoberDays;
exports.totalDaysWin = totalDaysWin;
function loadSoberDays() {
  var data = localStorage.getItem('soberDays');
  return data ? JSON.parse(data) : {};
}
function saveSoberDays(data) {
  localStorage.setItem('soberDays', JSON.stringify(data));
}
function totalDaysWin() {
  var totalSober = localStorage.getItem('soberDays');
  var totalSoberObj = JSON.parse(totalSober || '{}');
  var totalSoberArr = Object.keys(totalSoberObj);
  return totalSoberArr.length;
}

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearHistoryButton = clearHistoryButton;
exports.historyButtonToggle = historyButtonToggle;
exports.themeToggleFunction = themeToggleFunction;
exports.updateClearHistoryState = updateClearHistoryState;
var _stats = require("./stats.js");
var _storage = require("./storage.js");
var _calendar = require("./calendar.js");
function historyButtonToggle() {
  var historyButton = document.querySelector('.show-history');
  var historyContainer = document.querySelector('.history-container');
  var historySeries = (0, _stats.getHistorySeries)();
  var emptyMessage = document.createElement('p');
  emptyMessage.className = 'empty-history';
  emptyMessage.textContent = "История пуста. Ваш первый день ждёт!";
  historyContainer.appendChild(emptyMessage);
  historyContainer.classList.add('hidden');
  historyButton.addEventListener('click', function () {
    historyContainer.classList.toggle('hidden');
    if (historyContainer.classList.contains('hidden')) {
      this.textContent = "Показать историю";
      emptyMessage.style.display = 'none';
    } else {
      this.textContent = "Скрыть историю";
      if (historySeries.length === 0) {
        emptyMessage.style.display = 'block';
      } else {
        emptyMessage.style.display = 'none';
      }
    }
  });
}
function clearHistoryButton() {
  var clearButton = document.querySelector('.clear-history');
  var soberDays = (0, _storage.loadSoberDays)();
  if (Object.keys(soberDays).length === 0) {
    clearButton.disabled = true;
  }
  clearButton.addEventListener('click', function () {
    if (confirm("Вы уверены, что хотите удалить ВСЮ историю и обнулить статистику?")) {
      localStorage.removeItem('soberDays');
      (0, _stats.updateAllStats)();
      (0, _stats.updateStreakSectionProgress)();
      (0, _calendar.draw)(body, _calendar.calendarState.currentYear, _calendar.calendarState.currentMonth);
      this.disabled = true;
      alert("История очищена! Вы можете начать заново!");
    }
  });
}
function updateClearHistoryState() {
  var clearButton = document.querySelector('.clear-history');
  var soberDays = (0, _storage.loadSoberDays)();
  var hasData = Object.keys(soberDays).length > 0;
  clearButton.disabled = !hasData;
}
function themeToggleFunction() {
  var lightThemeButton = document.querySelector('.light-theme-button');
  var darkThemeButton = document.querySelector('.dark-theme-button');
  var body = document.body;
  var savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
    darkThemeButton.classList.add('active');
    lightThemeButton.classList.remove('active');
  } else {
    body.classList.remove('dark');
    darkThemeButton.classList.remove('active');
    lightThemeButton.classList.add('active');
  }
  lightThemeButton.onclick = function () {
    lightThemeButton.classList.add('active');
    darkThemeButton.classList.remove('active');
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  };
  darkThemeButton.onclick = function () {
    darkThemeButton.classList.add('active');
    lightThemeButton.classList.remove('active');
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  };
}

},{"./calendar.js":2,"./stats.js":3,"./storage.js":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDateKey = createDateKey;
exports.formateDate = formateDate;
exports.getDayName = getDayName;
exports.getMonthName = getMonthName;
exports.isNextDay = isNextDay;
exports.isYesterdayOrToday = isYesterdayOrToday;
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function getDayName(count) {
  return getDeclension({
    count: count,
    one: 'день',
    few: 'дня',
    many: 'дней'
  });
}
function parseDate(dateStr) {
  var date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  return date;
}
function formateDate(dateStr) {
  var _dateStr$split = dateStr.split('-'),
    _dateStr$split2 = _slicedToArray(_dateStr$split, 3),
    year = _dateStr$split2[0],
    month = _dateStr$split2[1],
    day = _dateStr$split2[2];
  return "".concat(day, ".").concat(month, ".").concat(year);
}
function createDateKey(year, month, day) {
  return "".concat(year, "-").concat(String(month).padStart(2, '0'), "-").concat(String(day).padStart(2, '0'));
}
function getMonthName(month) {
  var months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  return months[month - 1];
}
function isNextDay(prevDateStr, nextDateStr) {
  var expected = new Date(prevDateStr);
  expected.setDate(expected.getDate() + 1);
  return expected.toISOString().slice(0, 10) === nextDateStr;
}
function isYesterdayOrToday(dateStr) {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  var inputDate = new Date(dateStr);
  inputDate.setHours(0, 0, 0, 0);
  return inputDate.getTime() === today.getTime() || inputDate.getTime() == yesterday.getTime();
}

},{}]},{},[1]);
