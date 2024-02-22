import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css'
})
export class BillComponent implements OnInit {
  bill: any;
  constructor(private route: ActivatedRoute, private billService: AuthService) {}
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const billId = params.get('id');
      if (billId) {
        const numericBillId = +billId;
        this.billService.getBillsById(numericBillId).subscribe(
          (response: any) => {
            this.bill = response;
            console.log(this.bill);

          },
          (error: any) => {
            console.error('Lỗi khi lấy thông tin hóa đơn:', error);
          });
      }
    });
  }
  calculateTotal(): number {
    let total = 0;
    for (const bill of this.bill) {
      for (const item of bill.item) {
        total += item.quantity * item.price;
      }}
    return total;
  }
}
