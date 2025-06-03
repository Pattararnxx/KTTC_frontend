import { Routes } from '@angular/router';
import {HomeComponent} from './features/home/home.component';
import {PageNotFoundComponent} from './features/page-not-found/page-not-found.component';
import {PaymentCheckComponent} from './features/payment-check/payment-check.component';
import {DetailComponent} from './features/detail/detail.component';
import {CheckMatchComponent} from './features/check-match/check-match.component';
import {RegisterComponent} from './features/register/register.component';
import {CompetitorsComponent} from './features/competitors/competitors.component';
import {AdminLoginComponent} from './features/admin-login/admin-login.component';

export const routes: Routes = [
  { path: '',component: HomeComponent},
  { path: 'payment-check', component: PaymentCheckComponent},
  { path: 'competitors', component: CompetitorsComponent},
  { path: 'check-match', component: CheckMatchComponent},
  { path: 'detail', component: DetailComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: AdminLoginComponent},
  { path: '**' ,component: PageNotFoundComponent}
];
