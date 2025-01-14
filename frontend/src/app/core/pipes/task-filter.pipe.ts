import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskFilter'
})
export class TaskFilterPipe implements PipeTransform {

  transform(tasks: any[], status: string): any[] {
    return tasks.filter(task => task.status === status);
  }

}
