import { Routes } from '@angular/router';
import {HomeComponent} from './features/users/home/home.component';
import {PageNotFoundComponent} from './features/page-not-found/page-not-found.component';
import {PaymentCheckComponent} from './features/users/payment-check/payment-check.component';
import {DetailComponent} from './features/users/detail/detail.component';
import {CheckMatchComponent} from './features/users/check-match/check-match.component';
import {RegisterComponent} from './features/users/register/register.component';
import {CompetitorsComponent} from './features/users/competitors/competitors.component';
import {AdminLoginComponent} from './features/admin/admin-login/admin-login.component';
import {AdminApproveComponent} from './features/admin/admin-approve/admin-approve.component';
import {DivideGroupsComponent} from './features/admin/divide-groups/divide-groups.component';
import {GroupResultsComponent} from './features/admin/group-results/group-results.component';

export const routes: Routes = [
  { path: '',component: HomeComponent},
  { path: 'payment-check', component: PaymentCheckComponent},
  { path: 'competitors', component: CompetitorsComponent},
  { path: 'check-match', component: CheckMatchComponent},
  { path: 'detail', component: DetailComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: AdminLoginComponent},
  { path: 'admin/approve', component: AdminApproveComponent},
  { path: 'admin/divide-group', component: DivideGroupsComponent},
  { path: 'admin/group-results', component: GroupResultsComponent},
  { path: '**' ,component: PageNotFoundComponent}
];
