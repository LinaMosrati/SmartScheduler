import { IProject } from "./iproject";
import { IUser } from "./iuser";

export enum ProjectMemberRole {
    Owner = 'Owner',
    ProjectManager = 'Project Manager',
    Developer = 'Developer',
    TesterQA = 'Tester/QA',
    Contributor = 'Contributor',
    Observer = 'Observer'
}

export interface IProjectMember {
    id ?: string;
    projectId : string;
    userId : string;
    role : ProjectMemberRole;
    
    user ?: IUser;
    project ?: IProject;
}
