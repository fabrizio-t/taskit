const { projects, users } = require('../models/schemas.js');
let status, message, data;

exports.getProjects = async (req, res) => {

    console.log("USER ID:", req.auth.payload.sub);
    const sub = req.auth.payload.sub;

    let where = {
        deadline: {
            $gte: new Date().toISOString(),
        },
        $or: [{ sub }, { collabs: sub }]
    };

    let r;
    try {
        r = await projects.find(where).sort({ deadline: 1 });
        res.status(200).json(r);
    } catch (e) {
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
    console.log("USER ID:", req.auth.payload.sub);
    const sub = req.auth.payload.sub;//unique user Id from auth0
    let r;
    try {
        r = await projects.create({ ...req.body, sub });
        res.status(201).json(r);
    } catch (e) {
        res.status(500).send(e);
    }
}

exports.getMessage = async (req, res) => {
    res.status(200).json(JSON.stringify(req.auth));
}

exports.saveUser = async (req, res) => {
    let err = []
    if (!req.body.nickname) err.push("Nickname");
    if (!req.body.picture) err.push("Picture");
    if (!req.body.email) err.push("Email");
    if (!req.body.sub) err.push("User id");
    if (err.length > 0) return res.status(400).send('{"error":"One or more parameters are missing: ' + err.join(', ') + '"}');
    console.log(req.body);
    console.log("USER ID:", req.auth.payload.sub);
    const sub = req.auth.payload.sub;

    if (sub !== req.body.sub) {
        res.status(400).json({ status: 'error', message: 'Specified User Id do not correspond to authenticated user' });
        return false;
    }

    let r;
    try {
        let options = { upsert: true, new: true, setDefaultsOnInsert: true };

        /* data = await users.create({ ...req.body, sub }); */
        data = await users.findOneAndUpdate({ ...req.body, sub }, { ...req.body, sub }, options);
        status = 'success';
        res.status(201).json({ status, data });
    } catch (e) {
        res.status(500).send(e);
    }
}
//{"title": "My fifth project","description": "Building a fullstack app with auth0 authentication service","deadline": "12/11/2022"}