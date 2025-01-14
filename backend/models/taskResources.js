const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); 
const Task = require('./tasks');
const Resource = require('./resources');

class TaskResource extends Model {
    // static methods
    static findByTaskId(taskId) {
        return this.findAll({ where: { taskId } });
    }

    static findByResourceId(resourceId) {
        return this.findAll({ where: { resourceId } });
    }
}

TaskResource.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID v4
        primaryKey: true,
    },
    taskId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Task,
            key: 'id',
        },
    },
    resourceId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Resource,
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'TaskResource',
    timestamps: true,
    tableName: 'task_resources',
});

module.exports = TaskResource;