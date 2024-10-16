class TimeControllers {
    static getSeason() {
        const currentDate = new Date().getMonth() + 1;
        switch (true) {
            case currentDate === 12 || (currentDate > 1 && currentDate <= 2):
                return "Зима";
            case currentDate <= 5:
                return "Весна";
            case currentDate <= 8:
                return "Літо";
            case currentDate <= 11:
                return "Осінь";
            default:
                break;
        }
    }
    static getCurrentDay() {
        return new Date().getDate();
    }
    static getCurrentTime() {
        const hours = new Date().getHours();
        if (hours >= 6 && hours <= 12) return "Ранок";
        else if (hours <= 16) return "Обід";
        else if (hours <= 24) return "Вечеря";
        else return "Ніч";
    }
    static renderMainPage(req, res) {
        res.render("index", { title: "Task-1 Time" });
    }
    static renderSeasonPage(req, res) {
        const currentSeason = TimeControllers.getSeason();
        res.render("time", {
            title: "Сезон",
            text: "Поточна пора року:",
            message: currentSeason,
        });
    }
    static renderDayPage(req, res) {
        const currentDay = TimeControllers.getCurrentDay();
        res.render("time", {
            title: "День",
            text: "Поточна дата:",
            message: currentDay,
        });
    }
    static renderTimePage(req, res) {
        const currentTime = TimeControllers.getCurrentTime();
        res.render("time", {
            title: "Час дня",
            text: "Поточний час дня:",
            message: currentTime,
        });
    }
}
export default TimeControllers;
