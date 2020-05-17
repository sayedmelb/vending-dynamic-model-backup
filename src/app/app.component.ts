import { Component, OnInit, ViewChild, Injectable, AfterViewInit, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { MachineData } from './model/machine.data';
import * as _ from 'lodash';
import { NguiMapComponent } from '@ngui/map';
import { AppSettingsService } from './service/app.settings.service';

import { NavbarModule, WavesModule } from 'angular-bootstrap-md'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppSettingsService]
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild("iw", { static: false }) iw;
  @ViewChild(NguiMapComponent, { static: false }) nguiMapComponent: NguiMapComponent;

  summary: string = "This is a Vending Machine Application with the following update below"
  balanceAmount: number = 0;
  balanceCardAmountstr: string = '';
  balanceCardAmount: number = 0;
  descimalPressed = false;
  showVendingMc: boolean = false;
  vendData: any = {};
  totalAvailableFund = 0.0;
  itemPrice = 0.0;
  itemSize = '';
  dispensing: boolean = false;
  paymentSelected: boolean = true;
  cashPayment: boolean = false;
  cardPayment: boolean = false;
  returnFundCard: boolean = false;
  returnFundCash: boolean = false;
  authorising: boolean = false;
  approved: boolean = false;
  fundAvailable: boolean = false;
  fundAvailablesuccess: boolean = false;

  public positions = [];
  imgpath: string = './assets/images/';
  statusMessage: string = "";
  map: any;
  navtoggle: string = "home";
  // items: [0,1,2,3,4,5,6,7,8,9];
  items = Array(10).fill(0, 9).map((x, i) => i);
  productItems = [];

  errorStatus = false;
  errorMessage = "";
  headerData = {};
  vendingData = {};
  listingHeaders = [];
  

    imggithubpath: string = "https://github.com/sayedmelb/energysyed/blob/master/src/assets/images/";
  imgpathsuffice: string ="?raw=true"

  paths = [[
    { lat: -27.75980769, lng: 152.4 },
    { lat: -27.78980769, lng: 152.33 },
    { lat: -27.82980769, lng: 152.31 },
    { lat: -27.84980769, lng: 152.32 },
    { lat: -27.84780769, lng: 152.43 }
  ]
  ];
  pos = { lat: 1, lng: 2 };



  constructor(private appSettingsService: AppSettingsService) {

  }

  ngOnInit() {
    this.urlheader();
    this.getData();
    this.getVendingData();

  }
  ngAfterViewInit() {
    this.vendData = this.positions[0];
    console.log('this.vendData', this.vendData);
  }

  urlheader() {
    this.appSettingsService.getHeaderJSON().subscribe(data => {
    //alert('header data'+ data.widget);
    this.headerData = data;
    console.log(data);
     

    },
      err => {
        console.log("http error", err);
        this.errorStatus = true;
        this.errorMessage = err.message;

      }

    );

  }
  getData() {
    this.appSettingsService.getJSON().subscribe(data => {
      console.log('LISTING', data);
      this.positions = this.normalizeData(data);
      this.vendData = this.positions[0];
     

    },
      err => {
        console.log("http error", err);
        this.errorStatus = true;
        this.errorMessage = err.message;

      }

    );

  }

  getVendingData() {
    this.appSettingsService.getVendingJSON().subscribe(data => {
      this.vendingData = data;
     

    },
      err => {
        console.log("http error", err);
        this.errorStatus = true;
        this.errorMessage = err.message;

      }

    );

  }



  onCustomMarkerInit(customMarker, markerPoint) {
    markerPoint.customMarker = customMarker;
  }


  onMapReady(map) {
    this.map = map;
  }

  normalizeData(mapData: any) {

this.listingHeaders = mapData;

    let positions = [];
    let lat: number, lng: number, icon: string, status: number = 0, products: [];
    let newObj;

    _.forEach(mapData.products, mapdata => {

      lat = mapdata.lat;
      lng = mapdata.lng;
      status = mapdata.status;
      if (mapdata.status == 0)
        icon = this.imggithubpath + 'green.png' + this.imgpathsuffice;
      else if (mapdata.status == 1)
        icon = this.imggithubpath + 'violet.png' + this.imgpathsuffice;
      else if (mapdata.status == 2)
        icon = this.imggithubpath + 'warning.png' + this.imgpathsuffice;
      else if (mapdata.status == 3)
        icon = this.imggithubpath + 'danger.png' + this.imgpathsuffice;
      newObj = {
        lat: lat,
        lng: lng,
        icon: icon,
        status: status,
        desc: mapdata.description,
        id: mapdata.id,
        products: mapdata.products
      }
      positions.push(newObj);

    });

    return positions;

  }


  onHover(event, data) {
    this.statusMessage = "Machine id : " + "<b>" + data.id + "</b><br>" + " Comment: " + data.desc + "<br>" + "Status: " + "<img height='20px' src='" + data.icon + "' class='custom-icon'/>";
    this.nguiMapComponent.openInfoWindow('iw',
      data.customMarker
    );

  }

  


  private getAllValues(object: object) {
    let values = []
    for (let key of Object.keys(object)) {
      if (typeof object[key] !== 'object') values.push(object[key]);
      else values = [...values, ...this.getAllValues(object[key])]
    }
    return values;
  }

  private updateFilter(event) {
    if (this.positions.length < 1) this.getData();
    let temp;
    temp = [...this.positions];
    temp = temp.map(({ customMarker, ...item }) => item);
    const val = event ? event.target.value.toLowerCase() : "";
    let _th = this;
    this.positions = temp.filter(function (d) {
      return (
        JSON.stringify(_th.getAllValues(d))
          .toLowerCase()
          .indexOf(val) !== -1 || !val
      );
    });
  }

  clearFilter() {
    this.getData();
    console.log("this.positions", this.positions);
  }

  OnNavBarClicked(event) {
    console.log(event);
    if (event.state == 'home') {
      this.navtoggle = 'home';
    } else if (event.state == 'listing') {
      this.navtoggle = 'listing';

    }


  }

  clicked(event, data) {
    console.log(data);
    this.showVendingMc = true;
    this.vendData = data;
    for(let i = 0; i< this.vendData.products.length; i++) {
      console.log("yesy");
       this.productItems = Array(this.vendData.products[i].quantity).fill(0, 9).map((x, i) => i);
       this.vendData.products[i].productItems=this.productItems;
    }
    console.log(' this.vendData',  this.vendData);

    
    this.paymentSelected = false;

  }

  addToBalance(event, value) {

    this.balanceAmount = this.balanceAmount + value;
   
  }

  onDone() {

    this.fundAvailable = true;
    setTimeout(() => {
      this.fundAvailable = false;

      this.fundAvailablesuccess = true;
      setTimeout(() => {
        this.fundAvailablesuccess = false;
      }, 2000);

      this.totalAvailableFund = this.totalAvailableFund + this.balanceAmount;
      this.balanceAmount = 0;
    }, 2000);



  }

  addToBalanceCard(event, value) {
    if (value === '.') {
      if (!this.balanceCardAmountstr.includes('.')) {
        this.balanceCardAmountstr = this.balanceCardAmountstr + value;
      }

    } else {
      this.balanceCardAmountstr = this.balanceCardAmountstr + value;
    }

  }

  onClear(event, value) {
    this.balanceCardAmountstr = '';
    this.descimalPressed = false;
  }
  calculateAndDispense(event, item) {
    this.balanceAmount = 0;

    if (item.quantity === 0) {
      alert('Stock for this item is no more available in this machine Sorry');
    } else {
      if (this.totalAvailableFund - item.price < 0) {
        alert('Insufficient Fund ')
      } else {

        if(!this.dispensing) {

          this.dispensing = true;
          setTimeout(() => {
            this.dispensing = false;
          }, 1500);
          this.UpdateDomforIcon(item.icon,'hide',true, item.quantity);
          item.quantity--;
          this.totalAvailableFund = this.totalAvailableFund - item.price;

        }
       
        
      }
    }

  }

  onAuthorise() {
    if(this.balanceCardAmountstr==='') {
      alert('please add amount first');
    } else {
      this.authorising = true;
      setTimeout(() => {
        this.authorising = false;
  
        this.approved = true;
        setTimeout(() => {
          this.approved = false;
        }, 2000);
  
        this.totalAvailableFund = this.totalAvailableFund + parseFloat(this.balanceCardAmountstr);
  
      }, 2000);
    }
   



  }

  onHoverProduct(event, item) {
    this.itemPrice = item.price;
    this.itemSize = item.size;
  }

  onPaymentModeSelection(mode) {
    this.paymentSelected = true;
    if (mode === 'cash') {
      this.cashPayment = true;
      this.cardPayment = false;

    } else {
      this.cashPayment = false;
      this.cardPayment = true;

    }
  }

  onComplete() {
    if (this.cashPayment) {
      this.returnFundCash = true;
      setTimeout(() => {
        this.returnFundCash = false;
        this.totalAvailableFund = 0;
        this.resetAllValues();
      }, 2000);
    } else {
      this.returnFundCard = true;
      setTimeout(() => {
        this.returnFundCard = false;
        this.totalAvailableFund = 0;
        this.resetAllValues();
      }, 2000);
    }




  }

  resetAllValues() {
    this.balanceAmount = 0;
    this.balanceCardAmountstr = "";
    this.paymentSelected = true;
    this.cashPayment = false;
    this.cardPayment = false;
    this.showVendingMc = false;

  }

  UpdateDomforIcon(iconclass, setclass: string, value: boolean, count) {

    const elementClass = iconclass.replace('.jpeg', '');
    const styleClass = setclass;
    const styleStartNormal = document.getElementsByClassName(
      elementClass
    ) as HTMLCollectionOf<HTMLElement>;
    styleStartNormal[count-1].classList.add(styleClass);
  }


}
