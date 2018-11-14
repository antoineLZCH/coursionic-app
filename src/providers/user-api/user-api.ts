import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Friend } from '../../models/user';

/*
  Generated class for the UserApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserApiProvider {

  constructor(public http: HttpClient) {
    console.log('Hello UserApiProvider Provider');
  }

  getAllUsers(): Observable<any> {
    return new Observable(obs => {
      this.http.get("http://localhost:3000/users")
        .toPromise().then((res: any) => {
          let newFriend: Friend[] = new Array()
          if (res.httpCode === 200) {
            for (let i = 0; i < res.users.length; i++) {
              var friend = new Friend()
              friend.username = res.users[i].email.split("@")[0]
              friend.fullname = res.users[i].firstName + ' ' + res.users[i].lastName
              friend.avatar = res.users[i].avatar
              friend.email = res.users[i].email
              friend.createdAt = res.users[i].createdAt
              friend.updatedAt = res.users[i].updatedAt
              newFriend.push(friend)
            }
          }
        })
        .catch(err => {
          console.error(err)
        })
    })
  }
}
