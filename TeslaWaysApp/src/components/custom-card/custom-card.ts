import { Component, Input } from '@angular/core';
import { Article } from '../../article/article';

/**
 * Generated class for the CustomCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'custom-card',
  templateUrl: 'custom-card.html'
})
export class CustomCardComponent {

  @Input() article: Article;

  constructor() {
    // console.log(this.article.title + " " + this.article.text);
    
  }

}
