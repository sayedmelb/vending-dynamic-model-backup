import {
  Component,
  OnInit,
  ViewChild,
  Injectable,
  Output,
  EventEmitter,
  Input
} from "@angular/core";
import * as _ from "lodash";
import mapValues = require("lodash/mapValues");

@Component({
  selector: "machine-listing",
  templateUrl: "./machine-listing.html",
  styleUrls: ["./machine-listing.scss"]
})
export class MachineListing implements OnInit {
  @Input("listing") listing: any;
  @Input("listingHeaders") listingHeaders: any;
  visbilityTray = {};

  columnOrderList = {};

  productList = [];

  constructor() {}

  ngOnInit() {
    console.log("MACHINE listing", this.listing);
    this.setVisibilityTray();
    this.setColumnOrder();
  }
  setColumnOrder() {
    this.listing.forEach(productObj => {
      //_.forEach(this.listing, productObj => {

      // console.log("productObj", productObj);
      let new_obj = new Map();
      //  forEach()
      //   let locFound = this.listingHeaders.schema.fields.find(fieldObj => {
      //                               return fieldObj.fieldid == productObj.id;
      //                           });

      _.forEach(this.listingHeaders.schema.fields, field => {
        // let resource = _.find(productObj, res => {
        //   return res.id == field.fieldid;
        // });
        // var resultObject = this.search(field.fieldid, productObj);
        //  console.log("resultObject ", productObj);
        // console.log("field", productObj[field.fieldid]);
        if (productObj[field.fieldid] !== undefined)
          new_obj.set(field.fieldid, productObj[field.fieldid]);
        //  new_obj[field.fieldid] = productObj[field.fieldid];
      });
      this.productList.push(new_obj);
    });
    console.log("this.productList[0]", this.productList[0]);
    for (let [key, value] of this.productList[0].entries()) {
      console.log(key, value);
    }
    // _.forEach(this.productList[0], map => {
    //   console.log("map", map);
    // });

    // _.forEach(this.listingHeaders.schema.fields, field => {
    //   console.log("field", field);
    //   let temp_obj = {};
    //   temp_obj[field.fieldid] = parseInt(field.attributeid);
    //   Object.assign(new_obj, temp_obj);

    // });
    //this.columnOrderList = new_obj;
    // console.log("columnOrderList", this.columnOrderList);
  }

  search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].name === nameKey) {
        return myArray[i];
      }
    }
  }

  setVisibilityTray() {
    let new_obj = {};
    _.forEach(this.listingHeaders.schema.fields, field => {
      new_obj[field.fieldid] = field.visible;
    });
    this.visbilityTray = new_obj;
    // console.log("visbilityTray", this.visbilityTray);
  }

  setHome(navitem: string) {
    // alert (navitem);
  }

  asIsOrder(a, b) {
  return 1;
}
}
