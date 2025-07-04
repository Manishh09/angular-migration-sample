  import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com'; // Example API

  constructor(private http: HttpClient) {}

  get<T>(): Observable<T> {
    return this.http.get<T>(`${this.API_URL}/users`);
  }

  post<T>(data: T): Observable<T> {
    return this.http.post<T>(`${this.API_URL}/users`, data);
  }

  delete<T>(id: number): Observable<T> {
    return this.http.delete<T>(`${this.API_URL}/users/${id}`);
  }

  put<T>(id: number, data: T): Observable<T> {
    return this.http.put<T>(`${this.API_URL}/users/${id}`, data);
  }

  patch<T>(id: number, data: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.API_URL}/users/${id}`, data);
  }

  

}
