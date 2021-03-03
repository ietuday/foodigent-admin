import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/services/authentication/guards/auth.guard';
import { CustomPreloadingStrategyService } from '../app/core/services/custom-preloading-strategy/custom-preloading-strategy.service';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/authentication/authentication.module').then(m => m.AuthenticationModule),
    canActivate: [AuthGuard],
    data: {
      name: 'auth',
      preload: false,
      delay: false
    }
  },
  {
    path: '',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard],
    data: {
      name: 'dashboard',
      preload: false,
      delay: false
    }
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: CustomPreloadingStrategyService })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
