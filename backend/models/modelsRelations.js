// the models
const User = require('./users');
const VerificationToken = require('./verificationTokens');
const ResetPassword = require('./resetPassword');
const Project = require('./projects');
const Notification = require('./notifications');
const projectMembers = require('./projectMembers');
const Task = require('./tasks');
const SubTask = require('./subTasks');
const Resource = require('./resources');
const TaskResource = require('./taskResources');
const TaskDependency = require('./taskDependencies');

// define the relation between the models

// users
 User.hasMany(VerificationToken, {
    foreignKey: 'userId',
    as: 'verificationTokens'
});

User.hasMany(ResetPassword, {
    foreignKey: 'userId',
    as: 'resetPasswords'
});

User.hasMany(Notification, {
    foreignKey: 'userId',
    as: 'notifications',
    onDelete: 'CASCADE'
});

User.hasMany(projectMembers, {
    foreignKey: 'userId',
    as: 'projectMembers',
    onDelete: 'CASCADE'
});

User.hasMany(Task, {
    foreignKey: 'userId',
    as: 'tasks',
    onDelete: 'SET NULL'
});

User.hasMany(SubTask, {
    foreignKey: 'userId',
    as: 'subTasks',
    onDelete: 'SET NULL'
});

//verification tokens
VerificationToken.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// reset password
ResetPassword.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});


// projects
Project.hasMany(Notification, {
    foreignKey: 'projectId',
    as: 'notifications',
    onDelete: 'CASCADE'
});

Project.hasMany(projectMembers, {
    foreignKey: 'projectId',
    as: 'projectMembers',
    onDelete: 'CASCADE'
});

Project.hasMany(Resource, {
    foreignKey: 'projectId',
    as: 'resources',
    onDelete: 'CASCADE'
});

Project.hasMany(Task, {
    foreignKey: 'projectId',
    as: 'tasks',
    onDelete: 'CASCADE'
});

// notifications
Notification.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Notification.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
});

// project members
projectMembers.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

projectMembers.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
});

// resources
Resource.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
});

Resource.hasMany(TaskResource, {
    foreignKey: 'resourceId',
    as: 'taskResources',
    onDelete: 'CASCADE'
});

// tasks
Task.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Task.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
});

Task.hasMany(SubTask, {
    foreignKey: 'taskId',
    as: 'subTasks',
    onDelete: 'CASCADE'
});

Task.hasMany(TaskResource, {
    foreignKey: 'taskId',
    as: 'taskResources',
    onDelete: 'CASCADE'
});

Task.hasMany(TaskDependency, {
    foreignKey: 'taskId',
    as: 'taskDependencies',
    onDelete: 'CASCADE'
});

Task.hasMany(TaskDependency, {
    foreignKey: 'dependentTaskId',
    as: 'dependentTasks',
    onDelete: 'CASCADE'
});

// sub tasks
SubTask.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

SubTask.belongsTo(Task, {
    foreignKey: 'taskId',
    as: 'task'
});

// task resources
TaskResource.belongsTo(Task, {
    foreignKey: 'taskId',
    as: 'task'
});

TaskResource.belongsTo(Resource, {
    foreignKey: 'resourceId',
    as: 'resource'
});

// task dependencies
TaskDependency.belongsTo(Task, {
    foreignKey: 'taskId',
    as: 'task'
});

TaskDependency.belongsTo(Task, {
    foreignKey: 'dependentTaskId',
    as: 'dependentTask'
});



