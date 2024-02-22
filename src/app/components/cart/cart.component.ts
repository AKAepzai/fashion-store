// cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../service/cart.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  carts: any = [];
  totalAmount: number = 0;
  userId: number = 0;
  constructor(private cartService: CartService,
    private router: Router,
     private route: ActivatedRoute,
     private authService: AuthService) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = +params['userId'] || 0;
    });

    // Gọi service để lấy giỏ hàng với userId tương ứng
    this.cartService.getUserCart(this.userId).subscribe(cartItems => {
      this.carts = cartItems;
    });
  }

  downSL(idx: number, sl: any) {
    let newSl = sl - 1;
    newSl = newSl > 0 ? newSl : 1;
    this.carts[idx].quantity = newSl;
    this.cartService.updateCart(this.carts[idx]).subscribe();
  }

  upSL(idx: number, sl: any) {
    let newSl = sl + 1;
    newSl = newSl <= 100 ? newSl : 100;
    this.carts[idx].quantity = newSl;
    this.cartService.updateCart(this.carts[idx]).subscribe();
  }

  async remove(idx: number) {
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
      const itemId = this.carts[idx].id; // Assuming there is an 'id' property on each cart item
      this.cartService.deleteItem(itemId).subscribe(() => {
        this.loadData(); // Assuming you have a loadData method to refresh the cart data
        Swal.fire({
          title: 'Đã Xóa',
          text: 'Sản phẩm đã được xóa thành công.',
          icon: 'success',
          showConfirmButton: true
        });
      });
    }
  }


  clearCart() {
    const confirmClear = async () => {
      const result = await Swal.fire({
        title: 'Xác Nhận',
        text: 'Bạn có chắc muốn xóa toàn bộ giỏ hàng?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        // Gọi phương thức xóa giỏ hàng từ AuthService dựa trên userId
        this.authService.clearCartByUserId(this.userId).subscribe(() => {
          // Sau khi xóa thành công, làm mới dữ liệu giỏ hàng
          this.loadData();
          Swal.fire({
            title: 'Đã Xóa',
            text: 'Giỏ hàng đã được xóa thành công.',
            icon: 'success',
            showConfirmButton: true
          });
        });
      }
    };

    confirmClear();
  }

  // Assuming you add the following method to your CartComponent
  loadData(): void {
    this.cartService.getUserCart(this.userId).subscribe(cartItems => {
      this.carts = cartItems;
    });
  }
  calculateTotal(): number {
    let total = 0;
    for (const item of this.carts) {
      total += item.quantity * item.price;
    }
    return total;
  }
  handlePayment():void {
    const name = (document.getElementById('name') as HTMLInputElement)?.value;
    const address = (document.getElementById('address') as HTMLInputElement)?.value;
    const phone = Number((document.getElementById('phone') as HTMLInputElement).value);
    const email = (document.getElementById('email') as HTMLInputElement)?.value;
    const mood = "Chờ Xác Nhận";
    this.cartService.handlePayment(this.carts, name, address, phone, email, mood).subscribe(
      (save) => {
        console.log('Lưu vào bill', save);
        this.carts = [];
        this.router.navigate(['/bill/',save.id]);
      },
      (error) => {
        console.error('Lõi khi thêm vào bill:', error);
      }
    );
  }
}
