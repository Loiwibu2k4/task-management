const taskRoutes = require("./task.route");
const representRoutes = require("./represent.route");
const userRoutes = require("./user.route");
const auth = require("../middlewares/auth.middleware");
module.exports = (app) => {

    const version = "/api/v1"

    app.use(
        version + "/",
        representRoutes
    );
    app.use(
        version + "/task",
        auth.hasTokenAuth,
        taskRoutes
    )

    app.use(
        version + "/user",
        userRoutes
    )
}
