import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post []= [];
  private postsUpdated = new Subject<{post: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router:Router){}

  getPosts(postsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts'+queryParams)
    .pipe(map((postData) => {
      return {
        posts: postData.posts.map(post => {
            return{
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
            }
          }),
        maxPosts: postData.maxPosts
    };
    }))
    .subscribe((formatedPosts) => {
      this.posts = formatedPosts.posts;
      this.postsUpdated.next({post: [...this.posts], postCount: formatedPosts.maxPosts});
    });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  addPost(parmTitle:string, parmContent:string, image: File){
    const postData = new FormData();
    postData.append("title",parmTitle);
    postData.append("content",parmContent);
    postData.append("image",image, parmTitle);
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        this.router.navigate(["/"]);
      });
  }

  getPost(id: string){
    return this.http.get<{_id:string, title:string, content:string, imagePath: string, creator:string}>(
      'http://localhost:3000/api/posts/' + id
      );
  }

  updatePost(id: string, parmTitle:string, parmContent:string, image: File | string){
    let postData: Post | FormData;
    if(typeof(image) == 'object'){
      const postData = new FormData();
      postData.append("id",id);
      postData.append("title",parmTitle);
      postData.append("content",parmContent);
      postData.append("image",image);
    }else{
      const postData: Post = {
        id:id,
        title:parmTitle,
        content:parmContent,
        imagePath: image,
        creator: null
      }
    }
    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
    });
  }

  deletePost(postId: string){
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}

 //const post: Post = {id: responseData.post.id, title:parmTitle, content:parmContent, imagePath: responseData.post.imagePath};
        //const id = responseData.post.id;
        //post.id = id;
        //this.posts.push(post);
        //this.postsUpdated.next([...this.posts]);
        //.subscribe(() => {
      //const updatedPosts = this.posts.filter(post => post.id !== postId);
      //this.posts = updatedPosts;
      //this.postsUpdated.next([...this.posts]);
      //});
      //const updatedPosts = [...this.posts];
        //const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        //const post: Post = {
        //  id: id,
        //  title: parmTitle,
        //  content: parmContent,
        //  imagePath: ""
        //};
        //updatedPosts[oldPostIndex] = post;
        //this.posts = updatedPosts;
        //this.postsUpdated.next([...this.posts]);
