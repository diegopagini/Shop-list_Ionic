import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  public addForm: FormGroup;

  constructor(private fb: FormBuilder, private shopService: ShopService) {}

  ngOnInit() {
    this.addForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      quantity: [1, [Validators.required]],
      id: [new Date().getTime().toString()],
      checked: [false],
    });
  }

  public addProduct() {
    if (this.addForm.valid) {
      console.log(this.addForm.value);
      this.shopService.addItem(this.addForm.value).subscribe();
    }
  }
}
