import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NewsComponent } from './news/news.component';
import { DialogsComponent } from './dialogs/dialogs.component';
import { SettingsComponent } from './settings/settings.component';
import { SignComponent } from './sign/sign.component';
import { ErrorComponent } from './error/error.component';
import { SidebarComponent } from './parts/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { CommentsComponent } from './comments/comments.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AccountsService } from './services/accounts.service';
import { DialogsPreviewsService } from './services/dialogs-previews.service';
import { DialogsService } from './services/dialogs.service';

const appRoutes: Routes = [
  { path: '', component: NewsComponent},
  { path: 'dialogs/:id', component: DialogsComponent},
  { path: 'dialogs', component: DialogsComponent},
  { path: 'settings', component: SettingsComponent },
  { path: 'comments', component: CommentsComponent },
  { path: 'sign', component: SignComponent },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NewsComponent,
    DialogsComponent,
    SettingsComponent,
    SignComponent,
    ErrorComponent,
    SidebarComponent,
    CommentsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
    MatTabsModule,
    MatBadgeModule,
    MatChipsModule,
    MatTreeModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
  ],
  providers: [DatePipe, AccountsService, DialogsPreviewsService, DialogsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
