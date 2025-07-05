import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Generic API service for handling HTTP requests
 * Provides strongly-typed methods for common HTTP operations
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com'; // Example API

  constructor(private http: HttpClient) {}

  /**
   * Performs a GET request to fetch data
   * @returns Observable of the requested data
   */
  get<T>(): Observable<T> {
    return this.http.get<T>(`${this.API_URL}/users`);
  }

  /**
   * Performs a POST request to create a new resource
   * @param data - The data to send in the request body
   * @returns Observable of the created resource
   */
  post<T>(data: T): Observable<T> {
    return this.http.post<T>(`${this.API_URL}/users`, data);
  }

  /**
   * Performs a DELETE request to remove a resource
   * @param id - The ID of the resource to delete
   * @returns Observable of the deleted resource or confirmation
   */
  delete<T>(id: number): Observable<T> {
    return this.http.delete<T>(`${this.API_URL}/users/${id}`);
  }

  /**
   * Performs a PUT request to completely replace a resource
   * @param id - The ID of the resource to replace
   * @param data - The new data for the resource
   * @returns Observable of the updated resource
   */
  put<T>(id: number, data: T): Observable<T> {
    return this.http.put<T>(`${this.API_URL}/users/${id}`, data);
  }

  /**
   * Performs a PATCH request to partially update a resource
   * @param id - The ID of the resource to update
   * @param data - The partial data to update
   * @returns Observable of the updated resource
   */
  patch<T>(id: number, data: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.API_URL}/users/${id}`, data);
  }
}
