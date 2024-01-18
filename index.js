const express = require('express');
require("dotenv").config();
const app = express();
const port = process.env.PORT;
const database = require('./config/database');
const Task = require("./models/task.model")

app.get('/', (req, res) => {
    res.send("OK");
})

app.get('/task', async (req, res) => {
    try {
        const tasks = await Task.find({
            deleted: false
        })
        console.log(tasks);
        res.json(tasks);
    } catch (error) {
        res.redirect("back");
    }
})

app.get("/task/detail/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({
            _id: id,
            deleted: false
        });
        console.log(task);
        res.json(task);
    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
}); 

database.connect();

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});