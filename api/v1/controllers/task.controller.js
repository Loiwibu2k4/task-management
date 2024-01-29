const Task = require("../models/task.model");
const User = require("../models/user.model");
const taskKey = ['title','status','content','timeStart','timeFinish', 'participants', "parent_id"];
const responseHelper = require("../../../helpers/response.helper");
// [GET] /api/v1/task/ (maybe have user=......)
module.exports.index = async (req, res) => {
    try {
        let find = { };
        if ( req.query.user ) {
            const existUser = await User.findOne({
                _id: req.query.user,
                deleted: false
            });
            if (existUser) {
                find = {
                    participants: req.query.user,
                    deleted: false
                }
            } else {
                find = {
                    deleted: false
                }
            };
        }
        let sort = {};
        let page = 1;
        let limit = 0;

        // Sort & Pagination
        for(const key in req.query) {
            if(taskKey.indexOf(key) !== -1) {
                if(req.query[key] == "asc" || req.query[key] === "desc") {
                    sort[key] = req.query[key];
                } else {
                    find[key] = req.query[key];
                }
            } else {
                if(key === "page") page = req.query[key];
                else if(key === "limit") limit = req.query[key];
            }
        }
        // Search
        if(req.query.keyword) {
            const regexp = new RegExp(req.query.keyword, "i");
            find.title = regexp;
        }

        const tasks = await Task.find(find)
            .sort(sort)
            .limit(limit)
            .skip((page - 1)*limit);

        res.json(tasks);

    } catch (error) {
        responseHelper.error(res);
    }

}

// [GET] /api/v1/task/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.find({
            _id: id,
            deleted: false
    })
        console.log(task);
        res.json(task);
    } catch (error) {
        responseHelper.error(res)
    }
}

// [PATCH] /api/v1/task/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id; 
        const newStatus = req.body.status;
        console.log(req.body);
        await Task.updateOne({ _id: id},newStatus);
        responseHelper.success(res)
    } catch (error) {
        console.log("Error");
        responseHelper.error(res)
    }
};

// [PATCH] /api/v1/task/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const ids = req.body.ids;
        delete req.body.ids;
        const changeMultiKey = taskKey;
        changeMultiKey.push("deleted");
        
        for(const key in req.body) {
            changeMultiKey.indexOf(key) == -1 && delete req.body[key];
        }
        await Task.updateMany(
            { _id: {$in: ids} },
            req.body
        );
        console.log(req.body);
        responseHelper.success(res);
    } catch (error) {
        responseHelper.error(res);
    }
}

// [POST] /api/v1/task/create
module.exports.create = async (req, res) => {
    try {
        const createKey = taskKey;
        for(const key in req.body) {
            createKey.indexOf(key) == -1 && delete req.body[key];
        }
        req.body.createdBy = req.locals.user.id;
        console.log(req.body);
        const newTask = new Task(req.body);
        console.log(newTask);
        await newTask.save();
        responseHelper.success(res);

    } catch (error) {
        responseHelper.error(res);
    }
}

// [PATCH] /api/v1/task/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const updateKey = taskKey;
        updateKey.push("deleted");
        for(const key in req.body) {
            updateKey.indexOf(key) == -1 && delete req.body[key];
        }
        await Task.updateOne(
            { _id: id},
            req.body
        );
        responseHelper.success(res);
    } catch (error) {
        responseHelper.error(res);
    }
}

// [PATCH] /api/v1/task/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne(
            { _id: id },
            req.body
        )
        responseHelper.success(res);
    } catch (error) {
        responseHelper.error(res);
    }
}

// [GET] /api/v1/task/participants/:id
module.exports.participants = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({
            _id: id,
            deleted: false
        });
        const participants = task.participants;
        responseHelper.success(res, "List participants", "participants", participants);
    } catch (error) {
        responseHelper.error(res, "Cannot get participants in this task");
    }
}
