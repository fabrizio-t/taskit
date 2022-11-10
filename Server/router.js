var router = require('express')();
const controller = require('./controllers/projects.js');

router.route('/projects')
    .get(controller.getProjects)
    .post(controller.saveProjects);

module.exports = router;
