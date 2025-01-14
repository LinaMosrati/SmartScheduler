const SubTask = require('../models/subTasks');
const Task = require('../models/tasks');

module.exports = {
    async createSubTask(req, res) {
        try {
            const { taskId } = req.params;
            const task = await Task.findByPk(taskId);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            const subTask = await SubTask.create({ ...req.body, taskId });
            return res.status(201).json(subTask);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async getSubTasks(req, res) {
        try {
            const { taskId } = req.query;
            if (!taskId) {
                return res.status(400).json({ error: 'Task Id is required to get subtasks' });
            }
            const task = await Task.findByPk(taskId);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            const subTasks = await SubTask.findAll({ where: { taskId } });
            return res.status(200).json(subTasks);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async getSubTask(req, res) {
        try {
            const { id } = req.params;
            const subTask = await SubTask.findByPk(id);
            if (!subTask) {
                return res.status(404).json({ error: 'SubTask not found' });
            }
            return res.status(200).json(subTask);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async updateSubTask(req, res) {
        try {
            const { id } = req.params;
            const subTask = await SubTask.findByPk(id);
            if (!subTask) {
                return res.status(404).json({ error: 'SubTask not found' });
            }
            await subTask.update(req.body);
            return res.status(200).json(subTask);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async deleteSubTask(req, res) {
        try {
            const { id } = req.params;
            const subTask = await SubTask.findByPk(id);
            if (!subTask) {
                return res.status(404).json({ error: 'SubTask not found' });
            }
            await subTask.destroy();
            return res.status(204).end();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
}
