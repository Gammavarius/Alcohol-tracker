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