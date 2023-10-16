import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { ProjectService } from '../../services/project/project.service';
import { User } from '@firebase/auth';
import { AuthService } from '../../services/auth/auth.service';
import { fromEvent, interval, Observable, Subject, take, takeUntil, timer } from 'rxjs';
import { Project } from '../../services/project/project';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewProjectModalComponent } from './new-project-modal/new-project-modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmModalComponent } from '../common/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  private destroyRef = inject(DestroyRef);
  private projectService = inject(ProjectService);
  private modalService = inject(NgbModal);
  private currentUser: User = inject(AuthService).getCurrentUser();
  private projectDeleteSubject$: Subject<Project> = new Subject<Project>();
  private stopHolding$ = fromEvent(document, 'pointerup');
  
  protected currentDate: Date = new Date;
  protected projects$: Observable<Project[]> = this.projectService.getProjects(this.currentUser.email!);
  
  protected readonly faCirclePlus = faCirclePlus;
  
  ngOnInit() {
    timer(0, 1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.currentDate = new Date());
    
    this.projectDeleteSubject$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(project => this.deleteProject(project));
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
  
  holdForDelete(project: Project) {
    interval(1000)
      .pipe(
        take(1),
        takeUntil(this.stopHolding$),
        takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.projectDeleteSubject$.next(project);
      });
  }
  
  changeTimerStatus(project: Project) {
    if (project.startTimer) {
      const totalTimeWithCalculatedTime = this.getTotalTimeWithCalculated(this.currentDate, project);
      const updatedProject = new Project(project.id, null, project.name, project.owner, totalTimeWithCalculatedTime);
      this.projectService.updateProject(updatedProject).then();
    } else {
      const updatedProject = new Project(project.id, new Date(), project.name, project.owner, project.totalTimeInSeconds + 1);
      this.projectService.updateProject(updatedProject).then();
    }
  }
  
  getTimeToDisplay(project: Project, currentDate: Date): string {
    if (project.startTimer) {
      const totalTimeWithCalculatedTime = this.getTotalTimeWithCalculated(currentDate, project);
      return this.formatTime(totalTimeWithCalculatedTime);
    }
    
    return this.formatTime(project.totalTimeInSeconds);
  }
  
  private deleteProject(project: Project) {
    const modalRef = this.modalService.open(ConfirmModalComponent,
      {
        backdrop: 'static',
        centered: true
      });
    
    modalRef.componentInstance.message = `Are you sure you want to delete <strong>${project.name}</strong>?`;
    
    modalRef.closed
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        
        if (confirmed) {
          this.projectService.deleteProject(project).then();
        }
      });
  }
  
  private getTotalTimeWithCalculated(currentDate: Date, project: Project) {
    const differenceInMilliseconds = currentDate.getTime() - (project?.startTimer ? project.startTimer.getTime() : new Date(0).getTime());
    return project.totalTimeInSeconds + Math.floor(differenceInMilliseconds / 1000);
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
