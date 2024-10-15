import { Router } from "express";
const router = Router();

/* GET home page. */
function getSeason() {
    const currentDate = new Date().getMonth() + 1;
    switch (true) {
        case currentDate === 12 || (currentDate > 1 && currentDate <= 2):
            return "Winter";
        case currentDate <= 5:
            return "Spring";
        case currentDate <= 8:
            return "Summer";
        case currentDate <= 11:
            return "Autumn";
        default:
            break;
    }
}
function getCurrentDay() {
    return new Date().getUTCDate();
}

function getCurrentTime() {
    const hours = new Date().getHours();
    if (hours >= 6 && hours <= 12) return "Morning";
    else if (hours <= 16) return "Afternoon";
    else if (hours <= 24) return "Evening";
    else return "Night";
}
router.get("/", (req, res) => {
    res.render("index", { title: "Task-1" });
});
router.get("/season", (req, res) => {
    const currentSeason = getSeason();
    console.log(currentSeason);
    res.render("home", { message: currentSeason });
});
router.get("/day", (req, res) => {
    const currentDay = getCurrentDay();
    res.render("home", {
        message: currentDay,
    });
});
router.get("/time", (req, res) => {
    const currentTime = getCurrentTime();
    res.render("home", {
        message: currentTime,
    });
});

export default router;
