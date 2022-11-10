const projects = require('../models/projects.js');

exports.getProjects = async (req, res) => {

    let where = {
        deadline: {
            $gte: new Date().toISOString(),
        }
    };

    let r;
    try {
        r = await projects.find(where).sort({ deadline: 1 });
        res.status(200).json(r);
    } catch (e) {
        r = e
        res.status(500).send(e);

    }
}

exports.saveProjects = async (req, res) => {
    let err = []
    if (!req.body.title) err.push("Title");
    if (!req.body.deadline) err.push("Date");
    if (!req.body.description) err.push("Venue");
    if (err.length > 0) return res.status(400).send('{"error":"One or more parameters are missing: ' + err.join(', ') + '"}');
    console.log(req.body);
    let r;
    try {
        r = await projects.create(req.body);
        res.status(201).json(r);
    } catch (e) {
        r = e
        res.status(500).send(e);

    }
}
