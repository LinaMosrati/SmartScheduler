const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); 
const User = require('./users');
const project = require('./projects');

class Task extends Model {
    // static methods
    static findByProjectId(projectId) {
        return this.findAll({ where: { projectId } });
    }

    static findByUserId(userId) {
        return this.findAll({ where: { userId } });
    }
}

Task.init({
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
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: false,
        defaultValue: 'low',
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
    cost: {
        type: DataTypes.DECIMAL(10, 3),
        allowNull: true,
        defaultValue: 0,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        },
    },
    projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: project,
            key: 'id',
        },
    }
}, {
    sequelize,
    modelName: 'Task',
    timestamps: true,
    tableName: 'tasks',
});

module.exports = Task;