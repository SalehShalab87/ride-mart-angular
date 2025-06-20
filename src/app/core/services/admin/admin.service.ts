import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';
import { Car } from '../../../models/car.model';
import { CarModel } from '../../../models/car-model.model';
import { Request } from '../../../models/car-request.model';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getAllCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/cars`);
  }

  getCarModels(): Observable<CarModel[]> {
    return this.http.get<CarModel[]>(`${this.apiUrl}/carModels`);
  }

  getAllRequests(): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.apiUrl}/requests`);
  }

  getAllClients(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users?role=client`);
  }

  markClientAsApproved(client: User): Observable<User[]> {
    return this.http.put<User[]>(`${this.apiUrl}/users/${client.id}`, {
      ...client,
      accountStatus: 'approved',
    });
  }

  markClientAsRejected(client: User): Observable<User[]> {
    return this.http.put<User[]>(`${this.apiUrl}/users/${client.id}`, {
      ...client,
      accountStatus: 'rejected',
    });
  }

  addNewCarModel(carModel: CarModel): Observable<CarModel[]> {
    return this.http.post<CarModel[]>(`${this.apiUrl}/carModels`, carModel);
  }

  deleteCarModel(carModelId: string): Observable<CarModel>{
    return this.http.delete<CarModel>(`${this.apiUrl}/carModels/${carModelId}`);
  }

  updateCarModel(carModel: CarModel): Observable<CarModel[]> {
    return this.http.put<CarModel[]>(
      `${this.apiUrl}/carModels/${carModel.id}`,
      carModel
    );
  }
  deleteCar(carId: string): Observable<Car> {
    return this.http.delete<Car>(`${this.apiUrl}/cars/${carId}`);
  }
  deleteRequest(requestId: string): Observable<Request> {
    return this.http.delete<Request>(`${this.apiUrl}/requests/${requestId}`);
  }
  deleteUser(userId: string): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/users/${userId}`);
  }
  updateRequestStatus(requestId: string, status: string): Observable<Request> {
    return this.http.patch<Request>(`${this.apiUrl}/requests/${requestId}`, {
      requestStatus: status,
    });
  }
}
