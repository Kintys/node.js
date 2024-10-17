class MyAppControllers {
    static renderGreetingPage(req, res) {
        res.render("index", {
            title: "Вітаю на сайті",
            message:
                "Вітаємо на нашому сайті! Ми раді, що ви завітали до нас. Насолоджуйтесь переглядом та знаходьте корисну інформацію.",
        });
    }
    static renderGoalsPage(req, res) {
        res.render("index", {
            title: "Мої цілі",
            message:
                "Моя головна мета — створити для вас комфортний, зручний та функціональний сайт, який стане надійним помічником у вирішенні ваших завдань. Я прагну, щоб кожен відвідувач легко знаходив потрібну інформацію та з задоволенням користувався всіма можливостями сайту. Створюючи цей проект, я дбаю про простоту, естетику та ефективність, щоб ваш досвід був приємним та безперешкодним. Ваш комфорт та задоволення від використання — мої основні пріоритети!.",
        });
    }
    static renderInfoWithoutParams(req, res) {
        res.render("info", {
            title: "Інформація!",
            list: MyAppControllers.getUrlWithParams(),
        });
    }
    static renderPageWithParams(req, res) {
        const params = req.params["someParams"];
        switch (params) {
            case "sites":
                return res.render("info", {
                    title: "Список улюблених сайтів",
                    list: MyAppControllers.getSitesList(),
                });
            case "films":
                return res.render("info", {
                    title: "Список улюблених онлайн кинотеатрів!",
                    list: MyAppControllers.getCinemaList(),
                });
            case "me":
                return res.render("info", {
                    title: "Інформація про мене!",
                    list: MyAppControllers.getInfoFromMe(),
                });
            default:
                return;
        }
    }
    static getSitesList() {
        return [
            {
                name: "Google",
                url: "https://www.google.com",
            },
            {
                name: "YouTube",
                url: "https://www.youtube.com",
            },
            {
                name: "GitHub",
                url: "https://www.github.com",
            },
        ];
    }
    static getCinemaList() {
        return [
            {
                name: "Netflix",
                url: "https://www.netflix.com",
            },
            {
                name: "Hulu",
                url: "https://www.hulu.com",
            },
            {
                name: "Amazon Prime Video",
                url: "https://www.primevideo.com",
            },
        ];
    }
    static getInfoFromMe() {
        return `
        Привіт! Я молодий розробник, який спеціалізується на розробці веб-додатків з використанням таких сучасних технологій, як Vue.js і Node.js. Моя мета — створювати динамічні, інтуїтивно зрозумілі та високопродуктивні веб-застосунки.
З Vue.js я працюю як з потужним фреймворком для фронтенд-розробки, який дозволяє створювати реактивні інтерфейси користувача.

Мені подобається його гнучкість, простота у навчанні та можливість легко інтегрувати в існуючі проєкти. Vue дає мені свободу в організації структури коду і забезпечує інтуїтивну роботу з компонентами, що особливо важливо при створенні масштабованих і підтримуваних додатків.

У той же час, Node.js дає можливість працювати з серверною частиною, використовуючи JavaScript для створення високонавантажених, реальних веб-додатків. Я використовую Node.js для розробки API, управління базами даних і створення серверів. Завдяки асинхронній природі Node, я можу обробляти велику кількість запитів одночасно, що робить додатки ефективними та швидкими.

Як молодий розробник, я постійно навчаюся новим підходам, вивчаю нові технології й намагаюся бути в курсі сучасних трендів у веб-розробці. Моя основна мета — розробляти продукти, які не тільки вирішують завдання користувачів, а й роблять це стильно, швидко та безпечно.
`;
    }

    static getUrlWithParams() {
        return [
            {
                name: "Інформація про улюблені сайти",
                url: "/info/sites",
            },
            {
                name: "Інформація про улюблені онлайн кінотеатри",
                url: "/info/films",
            },
            {
                name: "Інформація про мене",
                url: "/info/me",
            },
        ];
    }
}

export default MyAppControllers;
