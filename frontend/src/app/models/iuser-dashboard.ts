import { ProjectStatus } from "./iproject";
import { ProjectMemberRole } from "./iproject-member";

export interface IUserDashboard {
  totalAssignedProjects: number; // Total number of projects the user is assigned to
  rolesPercentage: RolePercentage[]; // Percentage of projects the user owns, manages, or is a member of
  completedProjects: number; // Number of projects completed
  totalAssignedTasks: number; // Total tasks (including subtasks) assigned to the user
  completedTasksPercentage: number; // Percentage of tasks assigned to the user that are completed
  projects: IProjectOverview[]; // Array of projects with details about the user's role, budget, and status
}

export interface IProjectOverview {
  id: string; // Project ID
  name: string; // Project name
  role: ProjectMemberRole; // User's role in the project (e.g., "Owner", "Member")
  budget: number; // Project budget
  status: ProjectStatus; // Project status (e.g., "Active", "Completed", "Cancelled")
  assignedTasks: number; // Number of tasks assigned to the user
  completedTaskPercentage: number; // Percentage of completed tasks assigned to the user
}

export interface RolePercentage {
    role: ProjectMemberRole;
    percentage: number;
}
