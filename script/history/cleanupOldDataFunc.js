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
cleanupOldData();