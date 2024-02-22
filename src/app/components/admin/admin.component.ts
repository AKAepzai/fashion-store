//admin.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DataService } from '../../service/data.service';
import { CategoryService } from '../../service/category.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']})
export class AdminComponent implements OnInit {
  products: any;
  categories: any;
  users: any[] = [];
  bills: any[] = [];

  constructor(private dataService: DataService, private router: Router, private http: HttpClient, private cateService : CategoryService, private authService: AuthService) {
    this.dataService.setApiUrl('http://localhost:3000/products')
  }
  ngOnInit(): void {
    this.loadData();
    this.loadCate();
    this.loadUser();
    this.loadBill();
  }
  loadBill(){
    this.authService.getAllBill().subscribe(
      (bill: any[]) => {
        this.bills = bill;
      },
      (error: any) => {
        console.error('Error getting Bills:', error);
      }
    );
  }
  loadUser(){
    this.authService.getAllUsers().subscribe(
      (users: any[]) => {
        this.users = users;
      },
      (error: any) => {
        console.error('Error getting users:', error);
      }
    );
  }
  loadData() {
    this.dataService.getItems().subscribe(data => {
      this.products = data
    })
  }
  loadCate() {
    this.cateService.getCategories().subscribe(da => {
      this.categories = da
    })
  }
  async deleteCate(id: any) {
    console.log('Deleting category with ID:', id);
    const result = await Swal.fire({
      title: 'Xác Nhận',
      text: 'Bạn có chắc muốn xóa sản phẩm?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    });
    if (result.isConfirmed) {
      this.cateService.deleteCategory(id).subscribe(() => this.loadCate());
      Swal.fire({
        title: 'Đã Xóa',
        text: 'Sản phẩm đã được xóa thành công.',
        icon: 'success',
        showConfirmButton: true
      });
    }
  }
  async deleteProduct(id: any) {
    const result = await Swal.fire({
      title: 'Xác Nhận',
      text: 'Bạn có chắc muốn xóa sản phẩm?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    });
    if (result.isConfirmed) {
      this.dataService.deleteItem(id).subscribe(() => this.loadData());
      Swal.fire({
        title: 'Đã Xóa',
        text: 'Sản phẩm đã được xóa thành công.',
        icon: 'success',
        showConfirmButton: true
      });
    }
  }
  showAddForm: boolean = false;
  newProduct: any = {};
  saveProduct() {
    if (this.editedProductId) {
      this.dataService.updateItem(this.editedProductId, this.newProduct).subscribe(() => {
        this.loadData();
        this.showAddForm = false;
        this.editedProductId = null;
        this.newProduct = {};
      });
    } else {
      this.dataService.addItem(this.newProduct).subscribe(() => {
        this.loadData();
        this.newProduct.date = new Date().toISOString();
        this.showAddForm = false;
        this.newProduct = {};
      });
    }
  }
  editedProductId: any;
  editProduct(id: any) {
    this.editedProductId = id;
    this.dataService.getItem(id).subscribe((product) => {
      this.showAddForm = true;
      this.newProduct = { ...product };
    });
  }
  showEditCategoryForm: boolean = false;
  editedCategory: any = {};
  editedCategoryId: any;
  // ...
  newCategory: any = {};

  showAddCategory() {
    this.showEditCategoryForm = true;
    console.log('showAddCategoryForm:', this.showEditCategoryForm);
  }

  saveNewCategory() {
    this.cateService.addCategory(this.newCategory).subscribe(() => {
      this.loadCate();
      this.showEditCategoryForm = false;
      this.newCategory = {};
    });
  }

  editCategory(id: any) {
    this.editedCategoryId = id;
    this.cateService.getCategory(id).subscribe((category) => {
      this.showEditCategoryForm = true;
      this.editedCategory = { ...category };
    });
  }
  saveCategory() {
    if (this.editedCategoryId) {
      this.cateService.updateCategory(this.editedCategoryId, this.editedCategory).subscribe(() => {
        this.loadCate();
        this.showEditCategoryForm = false;
        this.editedCategoryId = null;
        this.editedCategory = {};
      });
    } else {
      this.cateService.addCategory(this.editedCategory).subscribe(() => {
        this.loadCate();
        this.showEditCategoryForm = false;
        this.editedCategory = {};
      });
    }
  }
  getTotalProducts(): number {
    let total = 0;
    for (const item of this.products) {
      total += item.quantity + item.quantity;
    }
    return total;
  }

  getTotalCustomers(): number {
    return this.users.length;
  }

  // Function to calculate the total number of orders
  getTotalOrders(): number {
    return this.bills.length;
  }

  hideForm() {
    console.log('Hiding Form');
    this.showAddForm = false;
    this.showEditCategoryForm = false;
    this.editedCategoryId = null;
    this.editedCategory = {};
  }
}
