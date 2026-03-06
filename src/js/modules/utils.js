function getDayName(count) {
	return getDeclension({
        count: count,
        one: 'день',
        few: 'дня', 
        many: 'дней'});
}

function parseDate(dateStr) {
	const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
	return date;
}

function formateDate(dateStr) {
	const [year, month, day] = dateStr.split('-'); 
	return `${day}.${month}.${year}`
}

function createDateKey(year, month, day) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getMonthName(month) {
    const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    return months[month - 1];
}

function isNextDay(prevDateStr, nextDateStr) {
    const expected = new Date(prevDateStr);
    expected.setDate(expected.getDate() + 1);
    return expected.toISOString().slice(0, 10) === nextDateStr;
}

function isYesterdayOrToday(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const inputDate = new Date(dateStr);
    inputDate.setHours(0, 0, 0, 0);
    
    
    return (
    inputDate.getTime() === today.getTime() || inputDate.getTime() == yesterday.getTime()
    )
}

export { getDayName, formateDate, createDateKey, getMonthName, isNextDay, isYesterdayOrToday};