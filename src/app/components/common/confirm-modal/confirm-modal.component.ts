import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  
  private activeModal = inject(NgbActiveModal);
  
  public message?: string;
  
  dismiss = () => this.activeModal.close(false);
  
  confirm = () => this.activeModal.close(true);
  
}
