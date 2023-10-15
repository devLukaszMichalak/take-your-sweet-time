import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-project-modal',
  templateUrl: './new-project-modal.component.html',
  styleUrls: ['./new-project-modal.component.scss']
})
export class NewProjectModalComponent {
  
  private activeModal = inject(NgbActiveModal);
  
  newProjectForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required])
    },
    {}
  );
  
  dismiss = () => this.activeModal.close(false);
  
  save = () => this.activeModal.close(this.newProjectForm.controls['name'].value);
  
}
