var router = require('express')();
const controller = require('./controllers/projects.js');
const { validateAccessToken } = require("./middleware/auth0.middleware.js");

router.route('/projects')
    .get(validateAccessToken, controller.getProjects)
    .post(validateAccessToken, controller.saveProjects);
router.route('/user')
    .post(validateAccessToken, controller.saveUser);
router.route('/api/messages/protected')
    .get(validateAccessToken, controller.getMessage);

module.exports = router;
