//import { ImageLoader } from 'ionic-image-loader';
import { NgModule } from '@angular/core';
import { CustomCardComponent } from './custom-card/custom-card';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [CustomCardComponent],
	imports: [IonicModule],
	exports: [CustomCardComponent]
})
export class ComponentsModule {}
