import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-control-bill',
  templateUrl: './control-bill.component.html',
  styleUrl: './control-bill.component.css'
})
export class ControlBillComponent implements OnInit {
  bills: any;


  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadBill();
  }

  loadBill(): void {
    this.authService.getAllBill().subscribe(
      (bill: any) => {
        this.bills = bill;
        console.log('Bills:', this.bills);
      },
      (error: any) => {
        console.error('Error getting Bills:', error);
      }
    );
  }
  selectedMood: string | null = null;
  selectMood(mood: string): void {
    if (this.selectedMood === mood) {
      this.selectedMood = null;
    } else {
      this.selectedMood = mood;
    }
  }

  confirmOrder(bill: any): void {
    console.log('Thông tin đơn hàng trước khi cập nhật:', bill);

    // Thêm updatedData vào hàm
    const updatedData = { name: bill.name, address: bill.address, phone: bill.phone, email: bill.email, item: bill.item };

    this.authService.updateBillStatus(bill.id, 'Chờ Xử Lý', updatedData).subscribe(
      () => {
        console.log('Đã xác nhận đơn hàng có ID:', bill.id);
        this.loadBill();
      },
      (error: any) => {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      }
    );
  }
  cancelOrder(bill: any): void {
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
  }

  processOrder(bill: any): void {
    const updatedData = { name: bill.name, address: bill.address, phone: bill.phone, email: bill.email, item: bill.item };

    this.authService.updateBillStatus(bill.id, 'Đang Giao', updatedData).subscribe(
      () => {
        console.log('Đã xử lý đơn hàng và chuyển sang trạng thái Đang Giao có ID:', bill.id);
        this.loadBill();
      },
      (error: any) => {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      }
    );
  }

  deliverOrder(bill: any): void {
    // Thực hiện logic để giao hàng đơn hàng
    console.log('Đã giao hàng đơn hàng có ID:', bill.id);
  }

  completeOrder(bill: any): void {
    console.log('Thông tin đơn hàng trước khi cập nhật:', bill);
    this.authService.updateBillStatus(bill.id, 'Đã Giao', {}).subscribe(
      () => {
        console.log('Đã hoàn thành đơn hàng có ID:', bill.id);
        this.loadBill();
      },
      (error: any) => {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      }
    );
  }

  showReason(bill: any): void {
    // Thực hiện logic để hiển thị lý do hủy đơn hàng
    console.log('Đang hiển thị lý do hủy đơn hàng có ID:', bill.id);
  }
}
