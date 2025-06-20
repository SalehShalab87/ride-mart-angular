import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { TableColumn, DashboardTableComponent } from '../../../shared/components/dashboard-table/dashboard-table.component';
import { CarModel } from '../../../models/car-model.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { AdminService } from '../../../core/services/admin/admin.service';
import { ToastService } from '../../../core/services/main/toast.service';
import { Subscription } from 'rxjs';
import { LoaderComponent } from "../../../shared/components/loader/loader.component";
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { I18nService } from '../../../core/services/i18n/i18n.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { Car } from '../../../models/car.model';
import { Request } from '../../../models/car-request.model';

@Component({
  selector: 'app-admin-cars-models',
  imports: [
    DashboardTableComponent,
    TranslatePipe,
    LoaderComponent,
    ConfirmDialog,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-cars-models.component.html',
  styleUrl: './admin-cars-models.component.scss',
  providers: [ConfirmationService],
})
export class AdminCarsModelsComponent implements OnInit, OnDestroy {
  carModelsColumns: TableColumn[] = [
    { field: 'name', header: 'modelName' },
    { field: 'brand', header: 'brand' },
    { field: 'actions', header: 'actions' },
  ];
  carModelsList: CarModel[] = [];
  isLoading = false;
  subscriptions: Subscription[] = [];
  editCarModelForm!: FormGroup;
  addCarModalForm!: FormGroup;
  selectedCarModel: CarModel | null = null;

  private adminService = inject(AdminService);
  private toast = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private i18n = inject(I18nService);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.loadCarModels();
    this.initializeEditForm();
    this.initializeAddForm();
  }

  initializeEditForm() {
    this.editCarModelForm = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
    });
  }

  initializeAddForm() {
    this.addCarModalForm = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
    });
  }

  loadCarModels() {
    this.isLoading = true;
    const sub = this.adminService.getCarModels().subscribe({
      next: (carModels: CarModel[]) => {
        this.carModelsList = carModels;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
    this.subscriptions.push(sub);
  }

  showDeleteConfirmation(carModel: CarModel | User | Request| Car) {
    const translateHeader = this.i18n.translate(
      'dialog.deleteConfirmationHeader'
    );
    const translatedMessage = this.i18n.translate(
      'dialog.deleteCarModelConfirmation'
    );
    this.confirmationService.confirm({
      message: translatedMessage,
      header: translateHeader,
      icon: 'pi pi-exclamation-triangle',
      closable: true,
      closeOnEscape: true,
      acceptLabel: this.i18n.translate('dialog.yes'),
      rejectLabel: this.i18n.translate('dialog.no'),
      acceptButtonStyleClass: 'p-button-danger my-2 me-1',
      rejectButtonStyleClass: 'p-button-secondary my-2 ms-1',
      accept: () => {
        this.deleteCarModel(carModel as CarModel);
      },
      reject: () => {
        // User rejected the deletion
      },
    });
  }

  deleteCarModel(carModel: CarModel) {
    this.isLoading = true;
    const sub = this.adminService.deleteCarModel(carModel.id).subscribe({
      next: () => {
        this.toast.showSuccess('toast.success.carModelDeleted');
        this.loadCarModels();
      },
      error: () => {
        this.isLoading = false;
      },
    });
    this.subscriptions.push(sub);
  }

  showEditModal(carModel: CarModel | User | Request | Car) {
    this.selectedCarModel = carModel as CarModel;
    this.editCarModelForm.patchValue({
      name: (carModel as CarModel).name,
      brand: (carModel as CarModel).brand,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('editCarModelModal')
    );
    modal.show();
  }

  onEditCarModelSubmit() {
    if (this.editCarModelForm.invalid || !this.selectedCarModel) return;
    const updatedCarModel: CarModel = {
      ...this.selectedCarModel,
      ...this.editCarModelForm.value,
    };
    this.editCarModel(updatedCarModel);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modal = (window as any).bootstrap.Modal.getInstance(
      document.getElementById('editCarModelModal')
    );
    modal.hide();
  }

  editCarModel(carModel: CarModel) {
    this.isLoading = true;
    const sub = this.adminService.updateCarModel(carModel).subscribe({
      next: () => {
        this.toast.showSuccess('toast.success.carModelUpdated');
        this.isLoading = false;
        this.loadCarModels();
      },
      error: () => {
        this.isLoading = false;
      },
    });
    this.subscriptions.push(sub);
  }

  showAddModal() {
    this.addCarModalForm.reset();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('addCarModelModal')
    );
    modal.show();
  }

  onAddCarModelSubmit(){
    if (this.addCarModalForm.invalid) return;
    const newCarModel: CarModel = this.addCarModalForm.value;
    this.addNewCarModel(newCarModel);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modal = (window as any).bootstrap.Modal.getInstance(
      document.getElementById('addCarModelModal')
    );
    modal.hide();
  }

  addNewCarModel(carModel: CarModel) {
    this.isLoading = true;
    const sub = this.adminService.addNewCarModel(carModel).subscribe({
      next: () => {
        this.toast.showSuccess('toast.success.carModelAdded');
        this.isLoading = false;
        this.loadCarModels();
      },
      error: () => {
        this.isLoading = false;
      },
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
