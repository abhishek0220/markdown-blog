import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';

import { PostComponent } from './post/post.component';



@NgModule({
  declarations: [PostComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: PostComponent, pathMatch: 'full' },
    ]),
    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
  ]
})
export class BlogModule { }
