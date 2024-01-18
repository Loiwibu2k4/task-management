const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: String,
        status: String,
        content: String,
        timeStart: Date,
        timeFinish: Date,
        deletedBy: {
            user_id: String,
            deletedAt: Date
        },
        deleted: Boolean
    },
    {timestamps: true}
);

const Task = mongoose.model("Task", taskSchema, "task");

module.exports = Task;