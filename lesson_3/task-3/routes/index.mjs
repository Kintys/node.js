import { Router } from "express";
const router = Router();

import MyAppControllers from "../controllers/my_app_controllers.mjs";
// Задача 3. Розробити програму з такими функціональними можливостями:
// обробка статичних маршрутів:
// “/” Вітання користувача
// “/goals” Ваші цілі

// обробка статичних файлів: about
// містить тему та умову задачі news
// містить перелік важливі новини (для Вас)

// обробка параметрів запитів:
// /info/:myLinks
// у залежності від значення параметра повертає сторінку з :
// «sites» -  адресами улюблених сайтів
// «films» -  адреси улюблених онлайн кінотеатрі
// «me» - або інформацію про себе

router.get("/", MyAppControllers.renderGreetingPage);

router.get("/goals", MyAppControllers.renderGoalsPage);

router.get("/info", MyAppControllers.renderInfoWithoutParams);

router.get("/info/:someParams", MyAppControllers.renderPageWithParams);
export default router;
