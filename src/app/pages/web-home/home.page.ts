import { Component } from '@angular/core';
import { HeaderComponent } from 'src/app/sharedComponent/web/header/components/header/header.component';
import { PresentationComponent } from './component/presentation/presentation.component';
import { CardComponent } from './component/card/card.component';
import { IconCardComponent } from './component/icon-card/icon-card.component';
import { ContactBannerComponent } from './component/contact-banner/contact-banner.component';
import { AccordeonComponent } from './component/accordeon/accordeon.component';
import { HeroComponent } from './component/hero/hero.component';
import { FooterComponent } from 'src/app/sharedComponent/web/footer/footer.component';
import { TestimonialComponent } from './component/testimonial/testimonial.component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,PresentationComponent,
    CardComponent,IconCardComponent,ContactBannerComponent,AccordeonComponent,HeroComponent,FooterComponent,TestimonialComponent,RouterModule],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {

}
