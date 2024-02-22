//data.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl!:string
  setApiUrl(url:string):void{
    this.apiUrl=url
  }
  constructor(private http: HttpClient) { }
  getItems():Observable<any[]>{
      return this.http.get<any[]>(this.apiUrl)
  }
  getItem(id:any):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/${id}`)
  }
  addItem(item:any):Observable<any>{
    return this.http.post<any>(this.apiUrl,item)
  }
  updateItem(id:any,item:any):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/${id}`,item)
  }
  deleteItem(id:any):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
  }

}
