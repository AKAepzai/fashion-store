  // cart.service.ts
  import { HttpClient } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';

  @Injectable({
    providedIn: 'root',
  })
  export class CartService {
    private apiUrl = 'http://localhost:3000/cart';

    constructor(private http: HttpClient) {}

    getUserCartCount(userId: number): Observable<number> {
      const url = `${this.apiUrl}/cart/count?userid=${userId}`;
      return this.http.get<number>(url);
    }
    getUserCart(userId: number): Observable<any[]> {
      const url = `${this.apiUrl}?userid=${userId}`;
      return this.http.get<any[]>(url);
    }
    getCart(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }

    addToCart(product: any): Observable<any> {
      return this.http.post<any>(this.apiUrl, product);
    }

    updateCart(product: any): Observable<any> {
      const updateUrl = `${this.apiUrl}/${product.id}`;
      return this.http.put<any>(updateUrl, product);
    }
    deleteItem(id:any):Observable<any>{
      return this.http.delete<any>(`${this.apiUrl}/${id}`)
    }
    clearCart(): Observable<any> {
      return this.http.delete<any>(this.apiUrl);
    }
    handlePayment(carts: any[], name: string, address: any, phone: number, email: string, mood:string,): Observable<any> {
      const formData = {
        name: name,
        address: address,
        phone: phone,
        email: email,
        item: carts,
        mood : mood,
      };
      return this.http.post<any>(`http://localhost:3000/bill`, formData);
  }

  }
