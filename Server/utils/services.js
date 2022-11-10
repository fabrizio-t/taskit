async function verifyProjectPermission(project_id, sub, projects, strict = true) {
    let where = {
        _id: project_id,
        $or: [{ sub }, { collabs: sub }]
    };
    if (!strict) where['$or'] = [{ sub }, { collabs: sub }];
    else where['sub'] = sub;
    try {
        return await projects.findOne(where).sort({ deadline: 1 });
    } catch (e) {
        res.status(500).send(e);
    }
}

module.exports = { verifyProjectPermission };