import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { DatasetListComponent } from './components/dataset-list/dataset-list.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { DatasetDetailsComponent } from './components/dataset-details/dataset-details.component';
import { PictureAnnotatorComponent } from './components/picture-annotator/picture-annotator.component';

@NgModule({
  declarations: [AppComponent, DatasetListComponent, DatasetDetailsComponent, PictureAnnotatorComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
