export function parserFormData(req, res, next) {
    const newValues = JSON.parse(req.body.data);
    const category = JSON.parse(req.body.category);
    req.body = {
        category,
        data: newValues,
    };
    next();
}
