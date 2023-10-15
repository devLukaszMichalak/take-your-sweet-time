import { Component, inject } from '@angular/core';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { ProjectService } from '../../services/project/project.service';
import { User } from '@firebase/auth';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, take } from 'rxjs';
import { Project } from '../../services/project/project';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewProjectModalComponent } from './new-project-modal/new-project-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  
  private projectService = inject(ProjectService);
  private modalService = inject(NgbModal);
  private currentUser: User = inject(AuthService).getCurrentUser();
  
  protected readonly faCirclePlus = faCirclePlus;
  
  projects$: Observable<Project[]> = this.projectService.getProjects(this.currentUser.email!)
  
  addProject() {
    const modalRef = this.modalService.open(NewProjectModalComponent,
      {
        backdrop: 'static',
        centered: true
      });
    
    modalRef.closed
      .pipe(take(1))
      .subscribe(name => {
        if (name) {
          const projectToSave = new Project(null, new Date, name, this.currentUser.email!, 0);
          
          this.projectService.saveProject(projectToSave).then();
        }
      });
  }
}
