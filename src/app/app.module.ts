import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NguiMapModule} from '@ngui/map';
import { HttpClientModule } from '@angular/common/http';
import { AppSettingsService } from './service/app.settings.service';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NavBar } from './navbar/nav-bar';
import { NavFooter } from './navfooter/nav-footer';
import { MachineListing } from './machine-listing/machine-listing';

@NgModule({
  declarations: [
    AppComponent,
    NavBar,
    NavFooter,
    MachineListing
    
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    HttpClientModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyAzY5AegOVAdxw1zuTpZQKpI-XS6KJSK3A&components=country:AU&libraries=places'})
  ],
  providers: [AppSettingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }


//NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyBZ2YOJ8KI5qZERdDJVumciKredgdKRU5Q&components=country:AU&libraries=places'})
  