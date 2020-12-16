import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{

  //{title: 'First Post', content: 'This is the first post\'s content'},
  //{title: 'Second Post', content: 'This is the second post\'s content'},
  //{title: 'Third Post', content: 'This is the third post\'s content'}

  posts: Post[] = [];
  isLoading = false;
  currentPage = 1;
  totalPosts = 0;
  postsPerPage = 5;
  pageSizeOptions = [1,5,10,15];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSubs: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService){}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage,0);
    this.userId = this.authService.getUserId();
    this.postsService.getPostUpdateListener().subscribe((postData: {post: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.post;
      console.log(postData);
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userId = this.authService.getUserId();
        this.userIsAuthenticated = isAuthenticated;
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
  }

  onDelete(postId: string){
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(()=>{
      this.postsService.getPosts(this.postsPerPage,this.currentPage);
    },() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(){
    if (this.postsSub) {
      this.postsSub.unsubscribe();
      this.authStatusSubs.unsubscribe();
    }
  }

}
