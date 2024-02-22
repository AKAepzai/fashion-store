//user.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  username: string | null = null;
  user: any;
  bills: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const usernameParam = params.get('username');
      if (usernameParam !== null) {
        this.username = usernameParam;
        this.authService.getUserByUsername(this.username);
      }
    });
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (this.user && this.user.id) {
        this.authService.getBillsByUserId().subscribe(
          (bills: any[]) => {
            this.bills = bills.filter(bill => {
              console.log(bill);
              return bill.item && bill.item.length > 0 && bill.item[0].userid === this.user.id;
            });
              console.log("day",bills);

          },
          (error: any) => {
            console.error('Lỗi khi lấy danh sách hóa đơn:', error);
          }
        );
      }
    });
  }
  saveChanges() {
    this.authService.updateUserInfoById(this.user.id, this.user).subscribe(
      (response: any) => {
        console.log('Thông tin người dùng đã được cập nhật.');

        // Hiển thị SweetAlert thành công
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Thông tin người dùng đã được cập nhật thành công!',
        });
        this.router.navigate(['/user', this.user.username]);
      },
      (error: any) => {
        console.error('Lỗi khi cập nhật thông tin người dùng:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra khi cập nhật thông tin người dùng.',
        });
      }
    );
  }
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  changePassword() {
    this.authService.changePassword(this.user.id, this.oldPassword, this.newPassword, this.confirmPassword).subscribe(
      (response: any) => {
        console.log('Mật khẩu đã được cập nhật.');

        // Reset các trường mật khẩu
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      (error: any) => {
        console.error('Lỗi khi cập nhật mật khẩu:', error);

      }
    );
  }
  hiddenMood :boolean = false;
  showChangePassword: boolean = false;
  showUserOrders: boolean = true;
  showUserProfile: boolean = false;
  showHiddens(): void {
    this.hiddenMood = !this.hiddenMood;
  }
  showUserOrdersSection() {
    this.showUserOrders = true;
    this.showUserProfile = false;
  }
  showUserProfileSection() {
    this.showUserProfile = true;
    this.showUserOrders = false;
  }
  toggleChangePasswordForm() {
    this.showChangePassword = !this.showChangePassword;
  }
  private loadBill(): void {
    this.authService.getBillsByUserId().subscribe(
      (bills: any[]) => {
        console.log(bills);
        this.bills = bills.filter(bill => {
          console.log(bill);
          return bill.item && bill.item.length > 0 && bill.item[0].userid === this.user.id;
        });
      },
      (error: any) => {
        console.error('Lỗi khi lấy danh sách hóa đơn:', error);
      }
    );
  }
  cancelOrder(bill: any): void {
    if (bill.mood === 'Chờ Xác Nhận' || bill.mood === 'Chờ Xử Lý') {
      const updatedData = { name: bill.name, address: bill.address, phone: bill.phone, email: bill.email, item: bill.item };

      this.authService.updateBillStatus(bill.id, 'Đã Hủy', updatedData).subscribe(
        () => {
          console.log('Đã hủy đơn hàng có ID:', bill.id);
          this.loadBill();
        },
        (error: any) => {
          console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
        }
      );
    } else {
      bill.mood = 'Đã Hủy';
      console.log('Đã hủy đơn hàng có ID:', bill.id);
    }
  }

  completeOrder(bill: any): void {
    if (bill.mood === 'Đang Giao') {
      const updatedData = { name: bill.name, address: bill.address, phone: bill.phone, email: bill.email, item: bill.item };

      this.authService.updateBillStatus(bill.id, 'Đã Giao', updatedData).subscribe(
        () => {
          console.log('Đã hoàn thành đơn hàng có ID:', bill.id);
          this.loadBill();
        },
        (error: any) => {
          console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
        }
      );
    } else {
      bill.mood = 'Đã Giao';
      console.log('Đã hoàn thành đơn hàng có ID:', bill.id);
    }
  }
  selectedMood: string | null = null;
  selectMood(mood: string): void {
    if (this.selectedMood === mood) {
      this.selectedMood = null;
    } else {
      this.selectedMood = mood;
    }
  }

}
