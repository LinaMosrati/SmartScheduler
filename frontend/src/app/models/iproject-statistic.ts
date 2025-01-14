
export interface IProjectStatistic {
  daysPassed: number;
  daysRemaining: number ;
  roleCount: { [role: string]: number };
  completedTasks: number ;
  inProgressTasks: number ;
  totalResourceCost: number;
}
