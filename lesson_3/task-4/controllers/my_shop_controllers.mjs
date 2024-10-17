class MyShopControllers {
    static renderMainPage(req, res) {
        res.render("index", {
            title: "Головна",
            welcomeText:
                "Вітаємо на нашому сайті! Ми раді, що ви завітали до нас. Насолоджуйтесь переглядом та знаходьте корисну інформацію.",
            links: MyShopControllers.getRouterLinks(),
        });
    }
    static renderAddProductPage(req, res) {
        res.render("products/product_add");
    }
    static renderProductPage(req, res) {
        res.render("products/product_view", {
            headline: ["Назва товару", "Кількість", "Опис"],
            productList: MyShopControllers.getProductList(),
        });
    }

    static getRouterLinks() {
        return [
            {
                name: "Про нас",
                url: "/about.html",
            },
            {
                name: "Продукт",
                url: "/product",
            },
            {
                name: "Додати продукт",
                url: "/addProduct",
            },
        ];
    }
    static getProductList() {
        return [
            {
                name: "Хліб",
                count: 30,
                description: "Харчовий продукт, що випікається з борошна",
            },
            {
                name: "Молоко",
                count: 15,
                description: "Напій тваринного походження, багатий на білки та кальцій",
            },
            {
                name: "Яблука",
                count: 50,
                description: "Фрукт, відомий своїми корисними властивостями та вмістом вітамінів",
            },
            {
                name: "Сир",
                count: 20,
                description: "Молочний продукт, що виготовляється шляхом сквашування молока",
            },
            {
                name: "Цукор",
                count: 40,
                description: "Солодкий продукт, що використовується для приготування їжі та напоїв",
            },
        ];
    }
}
export default MyShopControllers;
