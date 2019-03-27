import { Article } from './../../article/article';
import { CustomCardComponent } from './../../components/custom-card/custom-card';
import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { NewsPage } from './news';

@NgModule({
  declarations: [
    NewsPage,
    CustomCardComponent,
    Article
  ],
  imports: [
    // IonicModule,
    CustomCardComponent,
    IonicPageModule.forChild(NewsPage),
  ],
})
export class NewsPageModule {}
