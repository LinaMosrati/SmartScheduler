const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); 
const Project = require('./projects');

class Resource extends Model {
    // static methods
    static findByProjectId(projectId) {
        return this.findAll({ where: { projectId } });
    }    
}

Resource.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID v4
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    details: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cost: {
        type: DataTypes.DECIMAL(10, 3),
        allowNull: true,
    },
    type: {
        type: DataTypes.ENUM('human', 'material', 'financial'),
        allowNull: false,
    },
    availability: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Project,
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'Resource',
    timestamps: true,
    tableName: 'resources',
});

module.exports = Resource;