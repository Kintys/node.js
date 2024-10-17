import { Router } from "express";
const router = Router();

import MyShopControllers from "../controllers/my_shop_controllers.mjs";

// Задача 4. З використанням роутерів та шаблонізаторів розробити інтернет магазин з такими сторінками:
// 1) about – як статична сторінка (розмістити у public)
// 2) сторінка додавання продукту (поки лише відображаємо поля для заповнення інформації)
// 3) сторінка відображення продуктів (у формі таблиці і списку)
// 4) головна – знаходяться посилання на сторінки about і products і addproducts

router.get("/", MyShopControllers.renderMainPage);
router.get("/product", MyShopControllers.renderProductPage);
router.get("/addProduct", MyShopControllers.renderAddProductPage);

export default router;
