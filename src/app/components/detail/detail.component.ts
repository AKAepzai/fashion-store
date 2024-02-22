import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../../entities/products';
import { CartService } from '../../service/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  products: IProduct[] = [];
  productDetails: IProduct | undefined;
  id!: number;
  // carts: any = this.cartService.getCarts();
  filteredProducts: IProduct[] = [];
  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.httpClient.get<IProduct[]>('http://localhost:3000/products').subscribe(data => {
      this.products = data;

      this.filteredProducts = this.products.filter(product => product.sold < 50);
      this.filteredProducts.forEach(product => {
        product.price = product.price * 0.5;
      });

      this.route.paramMap.subscribe(params => {
        this.id = parseInt(params.get('id') || '');
        this.productDetails = this.products.find(product => product.id === this.id);
      });
    });
  }
  buyNow(product: any) {
    this.cartService.getCart().subscribe((cartItems) => {
      const existingCartItem = cartItems.find((item) => item.productId === product.id);
      if (existingCartItem) {
        existingCartItem.quantity += 1;
        this.cartService.updateCart(existingCartItem).subscribe(() => {
            Swal.fire('Đã thêm vào giỏ hàng!', '', 'success');
        });
      } else {
        const newCartItem = { ...product, productId: product.id, id: null, quantity: 1 };
        this.cartService.addToCart(newCartItem).subscribe(() => {
            Swal.fire('Đã thêm vào giỏ hàng!', '', 'success');
          });
      }
    });
  }



}
