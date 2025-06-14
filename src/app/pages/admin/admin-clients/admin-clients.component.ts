import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { TableColumn, DashboardTableComponent } from '../../../shared/components/dashboard-table/dashboard-table.component';
import { User } from '../../../models/user.model';
import { Subscription } from 'rxjs';
import { AdminService } from '../../../core/services/admin/admin.service';

import { ToastService } from '../../../core/services/main/toast.service';
import { LoaderComponent } from "../../../shared/components/loader/loader.component";
import { Request } from '../../../models/car-request.model';

@Component({
  selector: 'app-admin-clients',
  imports: [DashboardTableComponent, LoaderComponent],
  templateUrl: './admin-clients.component.html',
  styleUrl: './admin-clients.component.scss',
})
export class AdminClientsComponent implements OnInit, OnDestroy {
  clientColumns: TableColumn[] = [
    { field: 'name', header: 'name' },
    { field: 'email', header: 'email' },
    { field: 'address', header: 'Address' },
    { field: 'phone', header: 'phone' },
    { field: 'accountStatus', header: 'status' },
    { field: 'Client Actions', header: 'actions' },
  ];
  subscriptions: Subscription[] = [];
  clientsList: User[] = [];
  clientsStatusOptions: string[] = ['approved', 'rejected', 'pending'];
  isLoading = false;
  private adminService = inject(AdminService);
  private toast = inject(ToastService);

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.isLoading = true;
    const sub = this.adminService.getAllClients().subscribe({
      next: (clients: User[]) => {
        this.clientsList = clients;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
    this.subscriptions.push(sub);
  }
  approveClient(client: User |Request) {
    const sub = this.adminService.markClientAsApproved(client as User).subscribe(() => {
      this.loadClients();
    });
    this.subscriptions.push(sub);
  }

  rejectClient(client: User|Request) {
    const sub = this.adminService.markClientAsRejected(client as User).subscribe(() => {
      this.loadClients();
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
