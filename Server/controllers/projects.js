const { projects, users, tasks } = require('../models/schemas.js');
const { verifyProjectPermission } = require('../utils/services.js');
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

exports.updateProject = async (req, res) => {

    const project_id = req.params.pid;
    const sub = req.auth.payload.sub;//unique user Id from auth0

    let err = []
    if (!req.body.title) err.push("Title");
    if (!req.body.deadline) err.push("Date");
    if (!req.body.description) err.push("Venue");
    if (err.length > 0) return res.status(400).send('{"error":"One or more parameters are missing: ' + err.join(', ') + '"}');

    console.log(req.body);

    //By default strict mode is enabled: User has to be the owner not just a collaborator
    const proj = await verifyProjectPermission(project_id, sub, projects);
    if (!proj) {
        status = 'error';
        message = 'User is not authorized to access this project';
        res.status(200).json({ status, message });
        return false;
    }

    //User is verified, we can proceed
    try {
        data = await projects.findOneAndUpdate({ _id: project_id }, req.body, { new: true }).exec();
        if (data) {
            status = 'success';
            res.status(200).json({ status, data });
        } else {
            status = 'error';
            message = 'Project was not updated...is Project id correct?';
            res.status(200).json({ status, message });
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

exports.deleteProject = async (req, res) => {

    const project_id = req.params.pid;
    const sub = req.auth.payload.sub;//unique User Id from auth0

    console.log(req.body);

    //Let's check is project exists and user is authorized
    const proj = await verifyProjectPermission(project_id, sub, projects);
    if (!proj) {
        status = 'error';
        message = 'User is not authorized to access this project';
        res.status(200).json({ status, message });
        return false;
    }
    //We are authorized, let's delete the task
    try {
        data = await projects.deleteOne({ _id: project_id });
        if (data && data.deletedCount > 0) {
            status = 'success';
            res.status(200).json({ status, data });
        } else {
            status = 'success';
            message = 'Task was not deleted...is Project Id correct?'
            res.status(200).json({ status, message });
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

exports.getTasks = async (req, res) => {

    const project_id = req.params.pid;
    const sub = req.auth.payload.sub;

    let where = {
        _id: project_id,
        deadline: {
            $gte: new Date().toISOString(),
        },
        $or: [{ sub }, { collabs: sub }]
    };

    let r;
    try {
        data = await projects.findOne(where).sort({ deadline: 1 });
        if (data) {
            const t = await tasks.find({ project_id }).sort({ deadline: 1 });
            /* data['tasks'] = [];
            data['tasks'] = t; */
            status = 'successo';
            res.status(200).json({ status, data: { ...data._doc, tasks: t } });
        }
        else {
            status = 'error';
            message = 'The project does not exists or the user is not authorized';
            res.status(400).json({ status, message });
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

exports.saveTasks = async (req, res) => {
    let err = []
    //if (!req.body.project_id) err.push("Project_id");
    const project_id = req.params.pid;
    const sub = req.auth.payload.sub;//unique user Id from auth0

    if (!req.body.name) err.push("Name");
    if (!req.body.deadline) err.push("Deadline");
    if (!req.body.todos) err.push("Todos");
    if (!req.body.color) err.push("Color");
    if (!req.body.tags) err.push("Tags");
    if (!req.body.priority) err.push("Priority");
    if (err.length > 0) return res.status(400).send('{"error":"One or more parameters are missing: ' + err.join(', ') + '"}');

    console.log(req.body);

    //Let's check is project exists and user is authorized to create tasks

    const proj = await verifyProjectPermission(project_id, sub, projects, false);

    //We are authorized, let's create a task
    try {
        if (proj) {
            data = await tasks.create({ project_id, ...req.body, sub });
            status = 'success';
            res.status(200).json({ status, data });
        }
        else {
            status = 'error';
            message = 'The project does not exists or the user is not authorized';
            res.status(400).json({ status, message });
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

exports.updateTasks = async (req, res) => {

    const project_id = req.params.pid;
    const task_id = req.params.tid;
    const sub = req.auth.payload.sub;//unique user Id from auth0

    let err = [];
    if (!req.body.name) err.push("Name");
    if (!req.body.deadline) err.push("Deadline");
    if (!req.body.todos) err.push("Todos");
    if (!req.body.color) err.push("Color");
    if (!req.body.tags) err.push("Tags");
    if (!req.body.priority) err.push("Priority");
    if (err.length > 0) return res.status(400).send('{"error":"One or more parameters are missing: ' + err.join(', ') + '"}');

    console.log(req.body);

    //Let's check is project exists and user is authorized to create tasks
    //not really necessary in this case. Most important is the user is author of task
    const proj = await verifyProjectPermission(project_id, sub, projects, false);

    //We are authorized, let's create a task
    try {
        if (proj) {
            /* data = await tasks.create({ project_id, ...req.body, sub }); */
            data = await tasks.findOneAndUpdate({ _id: task_id, project_id, sub }, req.body, { new: true }).exec();
            if (data) {
                status = 'success';
                res.status(200).json({ status, data });
            } else {
                status = 'error';
                message = 'Task was not updated...is Task id correct? Is it your task?';
                res.status(200).json({ status, message });
            }
        }
        else {
            status = 'error';
            message = 'The project does not exists or the user is not authorized';
            res.status(400).json({ status, message });
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

exports.deleteTasks = async (req, res) => {

    const project_id = req.params.pid;
    const task_id = req.params.tid;
    const sub = req.auth.payload.sub;//unique User Id from auth0

    console.log(req.body);

    //Let's check is project exists and user is authorized to create tasks
    //not really necessary in this case. Most important is the user is author of task
    const proj = await verifyProjectPermission(project_id, sub, projects, false);

    //We are authorized, let's delete the task
    try {
        if (proj) {
            data = await tasks.deleteOne({ _id: task_id, project_id, sub });
            if (data && data.deletedCount > 0) {
                status = 'success';
                res.status(200).json({ status, data });
            } else {
                status = 'success';
                message = 'Task was not deleted...is Task id correct? Is it your task?'
                res.status(200).json({ status, message });
            }
        }
        else {
            status = 'error';
            message = 'The project does not exists or the user is not authorized';
            res.status(400).json({ status, message });
        }
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
//{"name":"Create Express Server","deadline":"11/11/2022","todos":[],"color":"sdsd","tags":[],"priority":1}