export enum TaskPriority {
    low = 'low',
    medium = 'medium',
    high = 'high'
}
export enum TaskStatus {
    todo = 'todo',
    inProgress = 'in-progress',
    done = 'done'
}

export interface ITask {
    id ?: string;
    name: string;
    description?: string;
    priority: TaskPriority | 'low';
    startDate?: string;
    endDate?: string;
    status: TaskStatus | 'todo';
    estimatedTime ?: number;
    cost ?: number;
    userId ?: string;
    projectId : string;

    nbSubtasks ?: number;
    dependentTasksId ?: string[];
    resourcesId ?: string[];
}
