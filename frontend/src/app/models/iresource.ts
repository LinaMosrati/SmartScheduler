export enum ResourceType {
    human = 'human',
    material = 'material',
    financial = 'financial'
}

export interface IResource {
    id ?: string;
    name : string;
    details ?: string;
    cost ?: number;
    type : ResourceType;
    availability : boolean;
    projectId : string;
}
