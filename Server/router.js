var router = require('express')();
const controller = require('./controllers/projects.js');
const { validateAccessToken } = require("./middleware/auth0.middleware.js");

router.route('/projects')//Get and Create projects
    .get(validateAccessToken, controller.getProjects)
    .post(validateAccessToken, controller.saveProjects);
router.route('/projects/:pid')//Get and Create tasks in a specific project
    .get(validateAccessToken, controller.getTasks)
    .post(validateAccessToken, controller.saveTasks);
router.route('/projects/:pid/task')//Delete and Update specific tasks in a specific project
    .get(validateAccessToken, controller.getProjects)
    .post(validateAccessToken, controller.saveProjects);
router.route('/user')
    .post(validateAccessToken, controller.saveUser);
router.route('/api/messages/protected')
    .get(validateAccessToken, controller.getMessage);

module.exports = router;
