// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CartService } from './cart.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();


  constructor(private http: HttpClient, private router: Router,  private cartService: CartService) { }


  private isAuthenticated = false;

  private userSubject = new BehaviorSubject<any>(null);
  clearCartByUserId(userId: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/cart?userid=${userId}`);
  }
  user$ = this.userSubject.asObservable();
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8000/auth');
  }
  updateBillStatus(billId: number, newStatus: string, updatedData: any): Observable<any> {
    const updatedBill = { ...updatedData, mood: newStatus };
    return this.http.put(`http://localhost:3000/bill/${billId}`, updatedBill);
  }
  getAllBill(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/bill');
  }
  getBillsByUserId(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/bill`)
  }
  getBillsById(id: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/bill?id=${id}`);
  }
  showUserOrders: boolean = true;
  showUserProfile: boolean = false;
  showUserProfileSection() {
    this.showUserProfile = true;
    this.showUserOrders = false;
  }
  register(username: string, email: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      console.error('Error registering: Passwords do not match');
      return;
    }

   const user = {
      'username': username,
      'email': email,
      'password': password
    };
    this.http.post('http://localhost:8000/auth/register', user).subscribe(
      (response: any) => {
        const token = response.access_token;
        localStorage.setItem('access_token', token);
        this.userSubject.next(this.getUserInfo());
        this.isAuthenticated = true;
        this.router.navigate(['/admin/login']);
      },
      (error: any) => {
        console.error('Error registering:', error);
      }
    );
  }
  login(email: string, password: string) {
    const user = {
      'email': email,
      'password': password
    }
    this.http.post('http://localhost:8000/auth/login', user).subscribe(
      (response: any) => {
        const token = response.access_token;
        localStorage.setItem('access_token', token);
        this.userSubject.next(this.getUserInfo());
        this.isAuthenticated = true;
        this.router.navigate(['/products']);
      }
    );
  }
  logout() {
    localStorage.removeItem('access_token');
    this.userSubject.next(null);
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
  getUserInfo(): any {
    let result: any = null
    try {
      let token: any = localStorage.getItem('access_token');
      const decodedToken = this.jwtHelper.decodeToken(token);
      result = decodedToken
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    return result
  }
  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    let result: boolean = false
    try {
      result = !!token && !this.jwtHelper.isTokenExpired(token);
    } catch { }
    return result
  }

 SpecialAccess(): boolean {
    const token = localStorage.getItem('access_token');
    let result: boolean = false;
    try {
      const isLoggedIn = !!token && !this.jwtHelper.isTokenExpired(token);
      if (isLoggedIn) {
        const userInfo = this.getUserInfo();
        const hasSpecialAccess = userInfo?.special === 1;
        result = isLoggedIn && hasSpecialAccess;
      }
    } catch { }

    return result;
  }
  getUserByUsername(username: string) {
    this.http.get(`http://localhost:8000/auth/${username}`).subscribe(
      (response: any) => {
        this.userSubject.next(response);
      },
      (error: any) => {
        console.error(`Error getting user by username (${username}):`, error);
      }
    );
  }
  changePassword(userId: number, oldPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
    const body = { oldPassword, newPassword, confirmPassword };
    return this.http.put(`http://localhost:8000/auth/change-password/${userId}`, body);
  }

  // Cập nhật phương thức cập nhật thông tin người dùng
  updateUserInfoById(userId: number, updatedUser: any) {
    return this.http.put(`http://localhost:8000/auth/update/${userId}`, updatedUser);
  }
}


