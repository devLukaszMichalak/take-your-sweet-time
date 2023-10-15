import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { ProjectService } from '../../services/project/project.service';
import { User } from '@firebase/auth';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, Subject, take, takeUntil, timer } from 'rxjs';
import { Project } from '../../services/project/project';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewProjectModalComponent } from './new-project-modal/new-project-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  private projectService = inject(ProjectService);
  private modalService = inject(NgbModal);
  private currentUser: User = inject(AuthService).getCurrentUser();
  
  protected readonly faCirclePlus = faCirclePlus;
  
  projects$: Observable<Project[]> = this.projectService.getProjects(this.currentUser.email!)
  currentDate: Date = new Date;
  
  private readonly destroy$ = new Subject();
  
  ngOnInit() {
    timer(0, 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.currentDate = new Date());
  }
  
  ngOnDestroy() {
    this.destroy$.next('');
    this.destroy$.complete();
  }
  
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
          const projectToSave = new Project(null, null, name, this.currentUser.email!, 0);
          
          this.projectService.saveProject(projectToSave).then();
        }
      });
  }
  
  getTimeToDisplay(project: Project, currentDate: Date): string {
    if (project.startTimer) {
      const differenceInMilliseconds = currentDate.getTime() - project.startTimer.getTime();
      return this.formatTime(project.totalTimeInSeconds + Math.floor(differenceInMilliseconds / 1000));
    }
    
    return this.formatTime(project.totalTimeInSeconds);
  }
  
  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
}
