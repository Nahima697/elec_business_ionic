import { Component, inject,  signal } from '@angular/core';
import { HeaderComponent } from 'src/app/shared-component/header/header.component';
import { PresentationComponent } from '../component/presentation/presentation.component';
import { CardComponent } from '../component/card/card.component';
import { IconCardComponent } from '../component/icon-card/icon-card.component';
import { ContactBannerComponent } from '../component/contact-banner/contact-banner.component';
import { AccordeonComponent } from '../component/accordeon/accordeon.component';
import { HeroComponent } from '../component/hero/hero.component';
import { FooterComponent } from 'src/app/shared-component/footer/footer.component';
import { TestimonialComponent } from '../component/testimonial/testimonial.component';
import { RouterModule } from '@angular/router';
import { IonContent } from "@ionic/angular/standalone";
import { TextCarouselComponent } from '../component/text-carousel/text-carousel.component';
import { StationApiService } from 'src/app/features/charging-station/services/station-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonContent, HeaderComponent, PresentationComponent,
    CardComponent, IconCardComponent, ContactBannerComponent, AccordeonComponent, HeroComponent, FooterComponent, TestimonialComponent, RouterModule, TextCarouselComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {
  private stationService =inject(StationApiService)
 readonly stations = this.stationService.getAll();
 protected readonly openMenuMobile= signal(false);

}
