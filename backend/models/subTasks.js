const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); 
const Task = require('./tasks');
const User = require('./users');

class SubTask extends Model {
    // static methods
    static findByTaskId(taskId) {
        return this.findAll({ where: { taskId } });
    }

    static findByUserId(userId) {
        return this.findAll({ where: { userId } });
    }

    static countByTaskId(taskId) {
        return this.count({ where: { taskId } });
    }
}

SubTask.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID v4
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('todo', 'in-progress', 'done'),
        allowNull: false,
        defaultValue: 'todo',
    },
    estimatedTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },    
    taskId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Task,
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'SubTask',
    timestamps: true,
    tableName: 'sub_tasks',
});

module.exports = SubTask;