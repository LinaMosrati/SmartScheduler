const Project = require('../models/projects');
const User = require('../models/users');
const ProjectMember = require('../models/projectMembers');

const notificationController = require('./notificationController');
const projectMemberController = require('./projectMemberController');

module.exports = {
    
        // get all projects for the admin
        getAllProjects: async (req, res) => {
            try {
                const projects = await Project.findAll();
                res.status(200).json(projects);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },

        // get all projects by user
        getAllProjectsByUser: async (req, res) => {
            try {
                const userId = req.params && req.params.userId ? req.params.userId : req.user.id;
                if (!userId) {
                    return res.status(400).json({ message: 'User ID is required.' });
                }
                const projects = await Project.findAllByUserId(userId);
                res.status(200).json(projects);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
    
        // get project by id
        getProjectById: async (req, res) => {
            try {
                const { projectId } = req.params;
                const project = await Project.findById(projectId);
                if (!project) {
                    return res.status(404).json({ message: 'Project not found.' });
                }
                res.status(200).json(project);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
    
        // add project
        addProject: async (req, res) => {
            try {
                const { name, description, budget, startDate, endDate} = req.body;
                if (!name || !description || !budget || !startDate || !endDate) {
                    return res.status(400).json({ message: 'Name and description are required.' });
                }
                const userId = req.body && req.body.userId ? req.body.userId : req.user.id;
                const project = await Project.create({ name, description, budget, startDate, endDate });
                await projectMemberController.addProjectMember({ userId, projectId: project.id, role: 'Owner' });
                res.status(200).json(project);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
    
        // update project
        updateProject: async (req, res) => {
            try {
                const { projectId } = req.params;
                const { name, description, budget, startDate, endDate, status } = req.body;
                const project = await Project.findById(projectId);
                if (!project) {
                    return res.status(404).json({ message: 'Project not found.' });
                }
                const userId = req.user.id;
                const projectMember = await ProjectMember.findOne({ where: { userId, projectId } });
                if (!projectMember || projectMember.role !== 'Owner') {
                    return res.status(403).json({ message: 'You are not authorized to update this project.' });
                }
                if(name)
                    project.name = name;
                if(description)
                    project.description = description;
                if(budget)
                    project.budget = budget;
                if(startDate)
                    project.startDate = startDate;
                if(endDate)
                    project.endDate = endDate;
                if(status)
                    project.status = status;
                await project.save();
                res.status(200).json(project);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
    
        // delete project
        deleteProject: async (req, res) => {
            try {
                const { projectId } = req.params;
                const project = await Project.findById(projectId);
                if (!project) {
                    return res.status(404).json({ message: 'Project not found.' });
                }
                const userId = req.user.id;
                const projectMember = await ProjectMember.findOne({ where: { userId, projectId } });
                if (!projectMember || projectMember.role !== 'Owner') {
                    return res.status(403).json({ message: 'You are not authorized to delete this project.' });
                }
                await project.destroy();
                res.status(200).json({ message: 'Project deleted successfully.' });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },


}