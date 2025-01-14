import { IProject } from "./iproject";
import { IProjectMember } from "./iproject-member";
import { IResource } from "./iresource";
import { ISubTask } from "./isub-task";
import { ITask } from "./itask";

export interface IProjectDetails {
    project: IProject;
    members: IProjectMember[];
    tasks: {task : ITask, subTasks : ISubTask[]}[];
    resources: IResource[];
}
