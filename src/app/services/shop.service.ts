import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Item } from '../interfaces/item.interface';

const url: string = environment.firebaseUrl;

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  public items$: Observable<Item[]>;
  public total = 0;

  constructor(
    private http: HttpClient,
    private toastController: ToastController
  ) {}

  public getItems(): void {
    this.items$ = this.http.get<Item[]>(`${url}/shop.json`).pipe(
      map(this.createArray),
      tap((items) => {
        let accum = 0;
        items.forEach((item) => {
          accum += item.quantity * item.price;
        });
        this.total = accum;
      })
    );
  }

  public addItem(item: Item): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${url}/shop.json`, item)
        .pipe(take(1))
        .subscribe(
          (resp: any) => {
            this.presentToast('Item agregado');
            this.getItems();
            resolve(true);
          },
          (err) => {
            console.log(err);
            resolve(false);
          }
        );
    });
  }

  public updateItem(item: Item): Promise<boolean> {
    const temporaryItem = {
      ...item,
    };

    return new Promise((resolve, reject) => {
      this.http
        .put(`${url}/shop/${item.id}.json`, temporaryItem)
        .pipe(take(1))
        .subscribe(
          () => {
            this.presentToast('Item actualizado');
            this.getItems();
            resolve(true);
          },
          (err) => {
            console.log(err);
            resolve(false);
          }
        );
    });
  }

  public deleteItem(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http
        .delete(`${url}/shop/${id}.json`)
        .pipe(take(1))
        .subscribe(
          () => {
            this.presentToast('Item eliminado');
            this.getItems();
            resolve(true);
          },
          (err) => {
            console.log(err);
            resolve(false);
          }
        );
    });
  }

  private createArray(shopObject): Item[] {
    const items: Item[] = [];
    if (shopObject === null) {
      return [];
    } else {
      Object.keys(shopObject).forEach((key) => {
        const item: Item = shopObject[key];
        item.id = key;
        items.push(item);
      });
    }
    // Sort ascending by string
    items.sort((a, b) => ('' + a.name).localeCompare(b.name));
    return items;
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      position: 'top',
      duration: 1500,
    });
    toast.present();
  }
}
