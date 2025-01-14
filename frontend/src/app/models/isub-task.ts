import { TaskStatus } from "./itask";

export interface ISubTask {
    id ?: string;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    status: TaskStatus | 'todo';
    estimatedTime ?: number;
    taskId : string;
    userId ?: string;
}
