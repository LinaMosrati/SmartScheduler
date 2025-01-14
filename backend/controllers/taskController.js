const Task = require('../models/tasks');
const TaskDependency = require('../models/taskDependencies');
const TaskResource = require('../models/taskResources');
const sequelize = require('../config/sequelize');
const SubTask = require('../models/subTasks');
const { Op } = require('sequelize');


async function updateTaskPriority(taskId) {
    // Find the task by its ID
    const task = await Task.findByPk(taskId);
    if (!task) {
        throw new Error('Task not found'); // Throw an error if the task doesn't exist
    }

    // Calculate the priority based on dependencies
    const priority = await TaskDependency.calculateTaskPriority(taskId);

    // Map the calculated priority to a string value
    const priorityConvert = { 1: 'high', 2: 'medium', 3: 'low' };

    if (!priorityConvert[priority]) {
        console.error('Invalid priority:', priority); // Log error if priority is invalid
        return;
    }

    // Update the task's priority
    task.priority = priorityConvert[priority];
    await task.save(); // Save the task back to the database
}

// Add task dependencies and update affected task priorities
// consider adding the test to check if there is a cisrcular dependency or not 
async function addTaskDependency(taskId, dependentTasksId) {
    const transaction = await sequelize.transaction();
    let tasksGotAffected = [];

    try {
        if (dependentTasksId.length > 0) {
            const promises = dependentTasksId.map(async (element) => {
                tasksGotAffected.push(element);
                return TaskDependency.create(
                    {
                        taskId: taskId,
                        dependentTaskId: element,
                    },
                    { transaction }
                );
            });

            await Promise.all(promises);
        }

        await transaction.commit();

        // Update priorities of all affected tasks in parallel
        await Promise.all(tasksGotAffected.map(updateTaskPriority));
    } catch (error) {
        await transaction.rollback();
        console.error("Failed to add task dependencies:", error);
        throw error;
    }
}

// update task dependencies and update affected task priorities
async function updateTaskDependency(taskId, dependentTasksId) {
    const transaction = await sequelize.transaction();
     const tab = await TaskDependency.findByTaskId(taskId);
     let tasksGotAffected = tab.map(e => e.toJSON());
    let taskTogetUpdated = [];
    try {

        if (dependentTasksId.length > 0) {
            
            let promises = dependentTasksId.map(async (element) => {
                const isNewDependency = !tasksGotAffected.some(e => e.dependentTaskId === element);

                if ( isNewDependency ) {
                    taskTogetUpdated.push(element);                
                    return TaskDependency.create(
                        {
                            taskId: taskId,
                            dependentTaskId: element,
                        },
                        { transaction }
                    );
                }
                else tasksGotAffected = tasksGotAffected.filter(e => e.dependentTaskId != element);
            });

            promises = promises.concat(tasksGotAffected.map(async (element) => {
                taskTogetUpdated.push(element.dependentTaskId);
                return TaskDependency.destroy(
                    {
                        where: {
                            taskId: taskId,
                            dependentTaskId: element.dependentTaskId,
                        },
                    },
                    { transaction }
                );
            }));

            await Promise.all(promises);
        }
        else if ( dependentTasksId.length == 0 ) {
            let promises = tasksGotAffected.map(async (element) => {
                taskTogetUpdated.push(element.dependentTaskId);
                return TaskDependency.destroy(
                    {
                        where: {
                            taskId: taskId,
                            dependentTaskId: element.dependentTaskId,
                        },
                    },
                    { transaction }
                );
            });

            await Promise.all(promises);
        }

        await transaction.commit();

        // Update priorities of all affected tasks in parallel
        taskTogetUpdated.push(taskId);
        await Promise.all(taskTogetUpdated.map(updateTaskPriority));
    } catch (error) {
        await transaction.rollback();
        console.error("Failed to update task dependencies:", error);
        throw error;
    }
}

// delete task dependencies and update affected task priorities
async function deleteTaskDependency(taskId) {
    const transaction = await sequelize.transaction();

    try {
        // Fetch all tasks affected by the dependency deletion
        const tasksDependentOnThisTask = await TaskDependency.findByTaskId(taskId); // Tasks this task depends on
        const tasksThatDependOnThisTask = await TaskDependency.findByDependentTaskId(taskId); // Tasks that depend on this task

        // Combine both sets of tasks and extract their IDs
        const tasksGotAffected = [
            ...tasksDependentOnThisTask.map(e => e.toJSON().dependentTaskId),
            ...tasksThatDependOnThisTask.map(e => e.toJSON().taskId),
        ];

        // Delete all dependencies where this task is involved
        await TaskDependency.destroy({
            where: {
                [Op.or]: [
                    { taskId: taskId },
                    { dependentTaskId: taskId },
                ],
            },
            transaction,
        });

        // Commit the transaction
        await transaction.commit();

        // Update the priority of all affected tasks in parallel
        await Promise.all(tasksGotAffected.map(taskId => updateTaskPriority(taskId)));
    } catch (error) {
        await transaction.rollback();
        console.error("Failed to delete task dependencies:", error);
        throw error;
    }
}


async function updateTaskResource(taskId, resourcesId) {
    const transaction = await sequelize.transaction();

    let resourcesOfTask = await TaskResource.findByTaskId(taskId);

    try {
        if (resourcesId.length > 0) {
            let promises = resourcesId.map(async (element) => {
                const isNewResource = !resourcesOfTask.some(e => e.resourceId === element);

                if (isNewResource) {
                    return TaskResource.create(
                        {
                            taskId: taskId,
                            resourceId: element,
                        },
                        { transaction }
                    );
                }
                else resourcesOfTask = resourcesOfTask.filter(e => e.resourceId != element);
            });

            promises = promises.concat(resourcesOfTask.map(async (element) => {
                return TaskResource.destroy(
                    {
                        where: {
                            taskId: taskId,
                            resourceId: element.resourceId,
                        },
                    },
                    { transaction }
                );
            }));

            await Promise.all(promises);
        }
        else if (resourcesId.length == 0) {
            let promises = resourcesOfTask.map(async (element) => {
                return TaskResource.destroy(
                    {
                        where: {
                            taskId: taskId,
                            resourceId: element.resourceId,
                        },
                    },
                    { transaction }
                );
            });

            await Promise.all(promises);
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error("Failed to add task resources:", error);
        throw error;
    }
}

module.exports = {

    async createTask(req, res) {
        try {
            const { dependentTasksId, resourcesId } = req.body;
            const task = await Task.create(req.body);
            if(resourcesId && resourcesId.length > 0){
                await updateTaskResource(task.id, resourcesId);
            }
            if (dependentTasksId.length > 0) {
                await addTaskDependency(task.id, dependentTasksId);
            }
            return res.status(201).json(task);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async getTasks(req, res) {
        try {
            const projectId = req.query.projectId;
            const userId = req.query.userId;
    
            let tasks;
    
            if (projectId && userId) {
                tasks = await Task.findAll({ where: { projectId: projectId, userId: userId } });
            } else if (projectId) {
                tasks = await Task.findByProjectId(projectId);
            } else if (userId) {
                tasks = await Task.findByUserId(userId);
            } else {
                return res.status(400).json({ error: 'Project Id is required to get tasks' });
            }
    
            // Process tasks asynchronously
            tasks = await Promise.all(
                tasks.map(async (task) => {
                    // Convert Sequelize instance to plain object
                    const taskObject = task.toJSON();
    
                    // Add new attributes
                    const dependentTasks = await TaskDependency.findByTaskId(task.id);
                    const resources = await TaskResource.findByTaskId(task.id);
                    const nbSubtasks = await SubTask.countByTaskId(task.id);
    
                    taskObject.dependentTasksId = dependentTasks.map(e => e.dependentTaskId);
                    taskObject.resourcesId = resources.map(e => e.resourceId);
                    taskObject.nbSubtasks = nbSubtasks;
    
                    return taskObject;
                })
            );
    
            return res.status(200).json(tasks);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },    

    async getTask(req, res) {
        try {
            const { id } = req.params;
            const task = await Task.findByPk(id);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            task.dependentTasksId = TaskDependency.findByTaskId(task.id).then((dependentTasks) => dependentTasks.map(e => e.dependentTaskId));
            task.resourcesId = TaskResource.findByTaskId(task.id).then((resources) => resources.map(e => e.resourceId));
            task.nbSubtasks = SubTask.countByTaskId(task.id);
            return res.status(200).json(task);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async updateTask(req, res) {
        try {
            const { id } = req.params;
            const { dependentTasksId, resourcesId } = req.body;

            const oldTask = await Task.findByPk(id);
            if (!oldTask) {
                return res.status(404).json({ error: 'Task not found' });
            }

            const [updated] = await Task.update(req.body, {
                where: { id: id }
            });
            if (updated) {
                // Check if status changes to "done" and update sub-tasks
            if(resourcesId){
                await updateTaskResource(id, resourcesId);
            }
            else 
                await updateTaskResource(id, []);
            if (req.body.status && req.body.status === 'done' && oldTask.status !== 'done') {
                const subTasks = await SubTask.findAll({ where: { taskId: id } }); // Fetch sub-tasks
                const subTaskIds = subTasks.map((subTask) => subTask.id); // Extract IDs
                
                if (subTaskIds.length > 0) {
                    await SubTask.update({ status: 'done' }, { where: { id: subTaskIds } });
                }
            }
                const updatedTask = await Task.findByPk(id);
                if(dependentTasksId)
                    await updateTaskDependency(id, dependentTasksId);
                else 
                    await updateTaskDependency(id, []);
                return res.status(200).json(updatedTask);
            }
            throw new Error('Task not found');
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
    },

    async deleteTask(req, res) {
        try {
            const { id } = req.params;
            await deleteTaskDependency(id);
            await SubTask.destroy({ where: { taskId: id } });
            const deleted = await Task.destroy({
                where: { id: id }
            });
            if (deleted) {                
                return res.status(204).send("Task deleted");
            }
            throw new Error("Task not found");
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async createTaskDependency(req, res) {
        try {
            const taskDependency = await TaskDependency.create(req.body);
            return res.status(201).json(taskDependency);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async getTaskDependencies(req, res) {
        try {
            const taskDependencies = await TaskDependency.findAll();
            return res.status(200).json(taskDependencies);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

}