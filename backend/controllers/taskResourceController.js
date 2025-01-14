const Task = require('../models/tasks');
const Resource = require('../models/resources');
const TaskResource = require('../models/taskResources');


module.exports = {
    async createTaskResource(req, res) {
        try {
            const { taskId, resourceId } = req.body;
            const task = await Task.findByPk(taskId);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            const resource = await Resource.findByPk(resourceId);
            if (!resource) {
                return res.status(404).json({ error: 'Resource not found' });
            }
            const taskResource = await TaskResource.create({ taskId, resourceId });
            return res.status(201).json(taskResource);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async getTaskResources(req, res) {
        try {
            const { taskId } = req.query;
            if (!taskId) {
                return res.status(400).json({ error: 'Task Id is required to get resources' });
            }
            const task = await Task.findByPk(taskId);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            const taskResources = await TaskResource.findByTaskId(taskId);
            return res.status(200).json(taskResources);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async getTaskResource(req, res) {
        try {
            const { id } = req.params;
            const taskResource = await TaskResource.findByPk(id);
            if (!taskResource) {
                return res.status(404).json({ error: 'TaskResource not found' });
            }
            return res.status(200).json(taskResource);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async deleteTaskResource(req, res) {
        try {
            const { id } = req.params;
            const taskResource = await TaskResource.findByPk(id);
            if (!taskResource) {
                return res.status(404).json({ error: 'TaskResource not found' });
            }
            await taskResource.destroy();
            return res.status(204).json();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
};