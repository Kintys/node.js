import { parseBearer } from "../utils/jwtHelpers.mjs";

// Функція для налаштування аутентифікації та авторизації
const auth = (app) => {
    // Middleware для налаштування заголовків CORS
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        next(); // Передача обробки наступному middleware
    });

    //     // Middleware для перевірки аутентифікації та авторизації
    app.use((req, res, next) => {
        // Відкриті шляхи, які не потребують авторизації
        const openPaths = [
            "/api/v1/auth/login",
            "/api/v1/auth/signup",
            "/api/v1/products/add",
            "/api/v1/products/pcs",
            "/api/v1/products/laptops",
            "/api/v1/products/headphones",
            "/api/v1/filters/search",
            "/api/v1/filters/brands",
            "/api/v1/auth/login/google",
            "/api/v1/auth/google/callback",
        ];

        const dynamicPaths = [/^\/api\/v1\/images\/.+$/, /^\/api\/v1\/uploads\/.+$/];

        const isOpenPath = (path) => {
            return openPaths.includes(path) || dynamicPaths.some((regex) => regex.test(path));
        };

        // Перевірка, чи шлях потребує авторизації
        if (!isOpenPath(req.path)) {
            try {
                // Парсинг токена та додавання користувача до запиту
                req.user = parseBearer(req.headers.authorization, req.headers);
            } catch (err) {
                // Якщо авторизація не вдалася, повертається статус 401
                return res.status(401).json({ result: "Access Denied" });
            }
        }
        next(); // Передача обробки наступному middleware
    });
};

// Експорт функції auth як модуля за замовчуванням
export default auth;
