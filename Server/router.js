var router = require('express')();
const controller = require('./controllers/projects.js');
const { validateAccessToken } = require("./middleware/auth0.middleware.js");

router.route('/projects')//Get and Create projects
    .get(validateAccessToken, controller.getProjects)
    .post(validateAccessToken, controller.saveProjects);
router.route('/projects/:pid')//Get / Create tasks in a specific project
    .get(validateAccessToken, controller.getTasks)
    .post(validateAccessToken, controller.saveTasks)
    .put(validateAccessToken, controller.updateProject)
    .delete(validateAccessToken, controller.deleteProject);
router.route('/projects/:pid/task/:tid')//Delete and Update specific tasks belonging to a specific project
    .put(validateAccessToken, controller.updateTasks)
    .delete(validateAccessToken, controller.deleteTasks);
router.route('/user')
    .post(validateAccessToken, controller.saveUser);
router.route('/invites')
    .get(validateAccessToken, controller.saveUser);
router.route('/api/messages/protected')
    .get(validateAccessToken, controller.getMessage);

module.exports = router;
