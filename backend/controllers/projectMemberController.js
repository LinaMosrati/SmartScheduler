const ProjectMember = require('../models/projectMembers');
const User = require('../models/users');
const Project = require('../models/projects');
const sendMail = require('../services/emailSender');





module.exports = {
    addProjectOwner : async (projectId, userId) => {
        const projectMember = await ProjectMember.create({ projectId, userId, role: 'Owner' });
        return projectMember;
    },

    // get all project members
    getAllProjectMembers: async (req, res) => {
        try {
            const projectMembers = await ProjectMember.findAll();
            res.status(200).json(projectMembers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getProjectMembersForProject: async (req, res) => {
        try {
            const { projectId } = req.params;
            const projectMembers = await ProjectMember.findAll({
            where: { projectId },
            include: [{ model: User, as: 'user' }],
            });
            for (let p of projectMembers) {
                if(p.user.image){
                    p.user.image = `${req.protocol}://${req.get('host')}/uploads/${p.user.image}`;
                }
            }
            res.status(200).json(projectMembers);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    },

    getProjectMembersForUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const projectMembers = await ProjectMember.findAll({
            where: { userId },
            include: [{ model: Project, as: 'project' }],
            });
            res.status(200).json(projectMembers);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    },

    // add project member
    addProjectMember: async (req, res) => {
        try {
            const { userId, projectId, role } = req.body;
            if (!userId || !projectId || !role) {
                return res.status(400).json({ message: 'User ID, Project ID and role are required.' });
            }
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ message: 'Project not found.' });
            }
            const projectMember = await ProjectMember.create({ userId, projectId, role });
            res.status(200).json(projectMember);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // user accept project invitation
    acceptProjectInvitation: async (req, res) => {
        try {
            const { projectId, ownerId, userId, role } = req.body;
            if (!projectId || !ownerId || !userId || !role) {
                return res.status(400).json({ message: 'Project ID, Owner ID, User ID and role are required.' });
            }

            if (userId != req.user.id) {
                return res.status(401).json({ message: 'Unauthorized.' });
            }

            const vProjectMember = await ProjectMember.findOne({ where: { userId, projectId } });
            if (vProjectMember) {
                console.log("User already a member")
                return res.status(400).json({ message: 'User already a member of the project.' });
            }


            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ message: 'Project not found.' });
            }
            const ownerMember = await ProjectMember.findOne({ where: { userId: ownerId, projectId } , include: [{ model: User, as: 'user' }]});
            if (!ownerMember) {
                return res.status(404).json({ message: 'Owner of the invitation not found.' });
            }

            if(ownerMember.role !== 'Owner' && ownerMember.role !== 'Project Manager'){
                return res.status(404).json({ message: 'Only the owner can invite members.' });
            }

            const projectMember = await ProjectMember.create({ userId, projectId, role });
            res.status(200).json(projectMember);            

            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    },

    // update project member
    updateProjectMember: async (req, res) => {
        try {
            const { projectMemberId } = req.params;
            const { role } = req.body;
            let projectMember = await ProjectMember.findById(projectMemberId);
            if (!projectMember) {
                return res.status(404).json({ message: 'Project Member not found.' });
            }
            if(projectMember.role === 'Owner'){
                return res.status(400).json({ message: 'Owner role cannot be changed.' });
            }
            if (role !== 'Owner' && role !== 'Project Manager' && role !== 'Developer' && role !== 'Tester/QA' && role !== 'Contributor' && role !== 'Observer') {
                return res.status(400).json({ message: 'Invalid role.' });
            }
            if (role === 'Owner') {
                return res.status(400).json({ message: 'Role cannot be changed to Owner.' });
            }
            projectMember.role = role;
            await projectMember.save();
            res.status(200).json(projectMember);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // delete project member
    deleteProjectMember: async (req, res) => {
        try {
            const { projectMemberId } = req.params;
            const projectMember = await ProjectMember.findById(projectMemberId);
            if (!projectMember) {
                return res.status(404).json({ message: 'Project Member not found.' });
            }
            if(projectMember.role === 'Owner'){
                return res.status(400).json({ message: 'Owner cannot be deleted.' });
            }
            await projectMember.destroy();
            res.status(200).json({ message: 'Project Member deleted successfully.' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // get project members by project
    getProjectMembersByProject: async (req, res) => {
        try {
            const { projectId } = req.params;
            const projectMembers = await ProjectMember.findAllByProjectId(projectId);
            res.status(200).json(projectMembers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // get project members by user
    getProjectMembersByUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const projectMembers = await ProjectMember.findAllByUserId(userId);
            res.status(200).json(projectMembers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

}