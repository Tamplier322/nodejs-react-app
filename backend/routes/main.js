module.exports = function (app) {
    app.get('/', (req, res) => {
        const data = {
            variable: 'SERVER WORKING'
        };
        res.json(data);
    });
}