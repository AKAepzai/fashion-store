// header.component.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartService } from '../../../service/cart.service';
import { AuthService } from '../../../service/auth.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  totalQuantity: number = 0;
  user: any = null;
  showOptions: boolean = false;

  constructor(private router: Router, private cartService: CartService, private cdr: ChangeDetectorRef, private authService: AuthService,   private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Cart subscription
    this.cartService.getCart().subscribe(cartItems => {
      this.totalQuantity = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
      this.cdr.detectChanges();
    });

    // User subscription
    this.authService.user$.subscribe((data) => {
      this.user = data;
    });
  }

  onMouseEnter() {
    console.log('Mouse Enter');
    this.showOptions = true;
  }

  onMouseLeave() {
    console.log('Mouse Leave');
    this.showOptions = false;
  }

  logOut() {
    Swal.fire({
      title: 'Bạn chắc chắn muốn đăng xuất?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.user = null;
        Swal.fire('Đăng xuất thành công!', '', 'success');
        location.reload();
      }
    });
  }
  goToCart(): void {
    // Lấy thông tin người dùng hiện tại
    const currentUser = this.authService.getUserInfo();
    const userId = currentUser ? currentUser.id : 0;
    this.router.navigate(['/cart'], { queryParams: { userId } });
  }
 // Thêm hàm cartCount
 cartCount(userId: number): void {
  this.cartService.getUserCart(userId).subscribe(cartItems => {
    this.totalQuantity = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
    this.cdr.detectChanges();
  });
}
}
