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
        deleted: {
            type: Boolean,
            default: false
        },
        createdBy: String,
        participants: {
            type: Array,
            default: []
        },
        parent_id: String
    },
    {timestamps: true}
);

const Task = mongoose.model("Task", taskSchema, "task");

module.exports = Task;