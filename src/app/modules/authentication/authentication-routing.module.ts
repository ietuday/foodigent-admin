import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthHomeComponent } from './auth-home/auth-home.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from 'src/app/core/pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from 'src/app/core/pages/reset-password/reset-password.component';

const routes: Routes = [
    {
        path: '',
        component: AuthHomeComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent
            },
            {
                path: 'reset-password/:email/:token',
                component: ResetPasswordComponent
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    }
    // ,
    // {
    //     path: 'reset-success',
    //     component: ResetSuccessComponent
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
