const Project = require('../models/projects');
const Task = require('../models/tasks');
const SubTask = require('../models/subTasks');
const User = require('../models/users');
const Resource = require('../models/resources');
const ProjectMember = require('../models/projectMembers');
const express = require('express');
const router = express.Router();
const { authenticateToken, hisOwnData } = require('../middleware/auth');


router.get('/', async (req, res) => {
   
    let totalProjects = 0;
    let totalTasks = 0;
    let totalUsers = 0;
    let totalResources = 0;
    let totalProjectCost = 0;
    let totalResourceCost = 0;
    try{
        // Get total number of projects
        totalProjects = await Project.count() ;

        // Get total number of tasks
        totalTasks = await Task.count();

        // Get total number of users
        totalUsers = await User.count();

        // Get total number of resources
        totalResources = await Resource.count();

        // Get total project cost
        const projects = await Project.findAll();
        projects.forEach(project => {
            totalProjectCost += Number(project.budget) || 0;
        });

        // Get total resource cost
        const resources = await Resource.findAll();
        resources.forEach(resource => {
            totalResourceCost += Number(resource.cost) || 0;
        });

        return res.status(200).json({
            totalProjects,
            totalTasks,
            totalUsers,
            totalResources,
            totalProjectCost,
            totalResourceCost,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

});

router.get('/:userId', authenticateToken, hisOwnData, async(req, res) => {

    let stat = {
        totalAssignedProjects: 0,
        rolesPercentage: [],
        completedProjects: 0,
        totalAssignedTasks: 0,
        completedTasksPercentage: 0,
        projects: []
    }
    const userId = req.params.userId;

    try {

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get total number of projects the user is assigned to
        stat.totalAssignedProjects = await ProjectMember.count({ where: { userId } });

        // Get percentage of each role the user has in the projects
        const projectMember = await ProjectMember.findAll({ where: { userId } });
        const roles = projectMember.map(member => member.role);
        const uniqueRoles = [...new Set(roles)];
        uniqueRoles.forEach(role => {
            const rolePercentage = {
                role,
                percentage: (roles.filter(r => r === role).length / roles.length) * 100
            }
            stat.rolesPercentage.push(rolePercentage);
        });
        // sort the roles by percentage
        stat.rolesPercentage.sort((a, b) => b.percentage - a.percentage);

        // Get total number of projects completed that the user is assigned to
        const projectsIds = projectMember.map(member => member.projectId);
        const projects = await Project.findAll({ where: { id: projectsIds } });
        stat.completedProjects = projects.filter(project => project.status === 'completed').length;

        // Get total number of tasks assigned to the user
        const tasks = await Task.findAll({ where: { userId} });
        stat.totalAssignedTasks = tasks.length;
        const subTasks = await SubTask.findAll({ where: { userId } });
        stat.totalAssignedTasks += subTasks.length;

        // Get percentage of completed tasks assigned to the user
        const completedTasks = tasks.filter(task => task.status === 'done').length;
        const completedSubTasks = subTasks.filter(subTask => subTask.status === 'done').length;
        stat.completedTasksPercentage = ((completedTasks + completedSubTasks) / stat.totalAssignedTasks) * 100;

        // Get projects with details about the user's role, budget, and status
        projects.forEach(project => {
            const numberOfTasks = tasks.filter(task => task.projectId === project.id).length;
            const tasksIds = tasks.filter(task => task.projectId === project.id).map(task => task.id);
            const numberOfSubTasks = subTasks.filter(subTask => tasksIds.includes(subTask.taskId) ).length;
            const numberOfTasksDone = tasks.filter(task => task.projectId === project.id && task.status === 'done').length;
            const numberOfSubTasksDone = subTasks.filter(subTask => tasksIds.includes(subTask.taskId) && subTask.status === 'done').length;

            const projectOverview = {
                id: project.id,
                name: project.name,
                role: projectMember.find(member => member.projectId === project.id).role,
                budget: project.budget,
                status: project.status,
                assignedTasks: numberOfTasks + numberOfSubTasks,
                completedTaskPercentage: ((numberOfTasksDone + numberOfSubTasksDone) / (numberOfTasks + numberOfSubTasks)) * 100
            }
            stat.projects.push(projectOverview);
        });

        return res.status(200).json(stat);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
      
} )

module.exports = router;