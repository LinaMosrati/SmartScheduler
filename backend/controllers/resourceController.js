const Resource = require('../models/resources');
const TaskResource = require('../models/taskResources');


module.exports = {
    async createResource(req, res) {
        try {
            const resource = await Resource.create(req.body);
            return res.status(201).json(resource);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async getResources(req, res) {
        const { projectId, taskId } = req.query;
        try {
            if ( projectId ) {
                let resources = await Resource.findByProjectId(projectId);
                if ( taskId ){
                    const taskResources = await TaskResource.findByTaskId(taskId);
                    const taskResourceIds = taskResources.map(taskResource => taskResource.resourceId);
                    resources = resources.filter(resource => taskResourceIds.includes(resource.id));
                }
                return res.status(200).json(resources);                
            }
            else if ( taskId ) {
                const taskResources = await TaskResource.findByTaskId(taskId);
                const resourceIds = taskResources.map(taskResource => taskResource.resourceId);
                const resources = await Resource.findAll({ where: { id: resourceIds } });
                return res.status(200).json(resources);
            }
            else {
                return res.status(400).json({ error: 'Project Id or Task Id is required to get resources' });
            }
            
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async getResource(req, res) {
        try {
            const { id } = req.params;
            const resource = await Resource.findByPk(id);
            if (!resource) {
                return res.status(404).json({ error: 'Resource not found' });
            }
            return res.status(200).json(resource);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async updateResource(req, res) {
        try {
            const { id } = req.params;
            const resource = await Resource.findByPk(id);
            if (!resource) {
                return res.status(404).json({ error: 'Resource not found' });
            }
            await resource.update(req.body);
            return res.status(200).json(resource);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async deleteResource(req, res) {
        try {
            const { id } = req.params;
            const resource = await Resource.findByPk(id);
            if (!resource) {
                return res.status(404).json({ error: 'Resource not found' });
            }
            await TaskResource.destroy({ where: { resourceId: id } });
            await resource.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
};