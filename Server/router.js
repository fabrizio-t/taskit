var router = require('express')();
const controller = require('./controllers/projects.js');
const { validateAccessToken } = require("./middleware/auth0.middleware.js");

router.route('/projects')
    .get(controller.getProjects)
    .post(controller.saveProjects);
router.route('/api/messages/protected')
    .get(validateAccessToken, controller.getMessage);

module.exports = router;
