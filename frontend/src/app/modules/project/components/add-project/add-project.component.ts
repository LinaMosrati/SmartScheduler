import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IProject, ProjectStatus } from '../../../../models/iproject';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent {
  projectForm: FormGroup;
  projectStatus = Object.values(ProjectStatus);

  constructor(private fb: FormBuilder, private router: Router, private readonly projectService: ProjectService) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      budget: [0, [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    }, { validators: [this.validateDates] });
  }

  // Custom validator to ensure the end date is after the start date
  validateDates(group: FormGroup): { [key: string]: boolean } | null {
    const endDateField = group.get('endDate');
    const startDate = new Date(group.get('startDate')?.value);
    const endDate = new Date(group.get('endDate')?.value);
    if ( endDateField && endDate < startDate) {
      console.log('End date is before start date');
      endDateField.setErrors({ endDateBeforeStartDate: true });
      return { endDateBeforeStartDate: true };
    }
    else {
      if (endDateField?.hasError('endDateBeforeStartDate'))
        endDateField.setErrors(null);
      return null;
    }
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const project: IProject = this.projectForm.value;
      console.log('Project data:', project);
      
      this.projectService.addProject(project).subscribe({
        next: response => {
          if (response) {
            console.log('Project added:', response);
            this.router.navigate(['/project']); // Navigate back to the project list
          }
        }
      });
    } else {
      alert('Please correct the errors in the form.');
    }
  }

  onCancel() {
    this.router.navigate(['/project']); // Navigate back to the project list
  }
}
