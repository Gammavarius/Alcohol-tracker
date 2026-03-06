function loadSoberDays() {
    const data = localStorage.getItem('soberDays')
    return data ? JSON.parse(data) : {};
}

function saveSoberDays(data) {
    localStorage.setItem('soberDays', JSON.stringify(data));
}

function totalDaysWin () {
    const totalSober = localStorage.getItem('soberDays');
    const totalSoberObj = JSON.parse(totalSober || '{}')
    const totalSoberArr = Object.keys(totalSoberObj);
    return totalSoberArr.length;
}

export { loadSoberDays, saveSoberDays, totalDaysWin };