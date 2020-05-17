import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MachineData } from "../model/machine.data";
import { HeaderData } from "../model/header.data";
import { VendingData } from "../model/vending.data";

@Injectable({
  providedIn: "root"
})
export class AppSettingsService {
  url = "./assets/data.json";
  urlheader = "./assets/header.json";
  urlvending = "./assets/vending.json";
  constructor(private http: HttpClient) {
    this.getJSON().subscribe(data => {});
    this.getHeaderJSON().subscribe(data => {});
    this.getVendingJSON().subscribe(data => {});
  }

  public getJSON(): Observable<MachineData[]> {
    return this.http.get<MachineData[]>(this.url);
  }

  public getHeaderJSON(): Observable<HeaderData[]> {
    return this.http.get<HeaderData[]>(this.urlheader);
  }
  public getVendingJSON(): Observable<VendingData[]> {
    return this.http.get<VendingData[]>(this.urlvending);
  }
}
