import { Injectable } from '@angular/core';
import { User } from "../../models/user";
import { Storage } from '@ionic/storage';

/*
 Generated class for the UserProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class UserProvider {

  private _user: User = new User();
  private _status: Number = 0;

  constructor(public ionStorage: Storage) {
    console.log('Hello UserProvider Provider');
    this.statusUser().then(
      status => this._status = status
    )
  }


  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  statusUser() {
    return this.ionStorage.get('user')
      .then(
        data => {
          if (data == null) {
            this.ionStorage.set('users', [])
            return 0
          } else {
            if (Array.isArray(data)) {
              return (data.length > 0) ? 1 : -1;
            }
            else {
              this.ionStorage.set('users', [])
              return 0
            }
          }
        },
        error => {
          this.ionStorage.set('users', [])
          return 0
        }
      )
  }

  checkedEmail(email: String) {
    return this.ionStorage.get('users').then(
      users => {
        for (let i = 0; i < users.length; i++) {
          if (users[i].email === email) {
            return true;
          }
        }
        return false;
      }
    )
  }

  loginUser(mail: String, pwd: String) {
    return this.checkedEmail(mail).then(
      data => {
        if (data) {
          this.ionStorage.get('users').then(
            data => {
              for (let i = 0; i < data.length; i++)
                if (data[i].email === mail && data[i].password === pwd)
                  return data[i];
              return false;
            }
          )
        }
        return false;
      }
    )
  }

  registerUser(user: User) {
    switch (this._status) {
      case 1:
        return this.ionStorage.get('users')
          .then(
            users => {
              let isValid: boolean = false
              for (let i = 0; i < users.length; i++)
                if (users[i].email === user.email)
                  isValid = true
              if (isValid)
                return false
              users.push(user)
              return true
            }
          )
        break;
      case 0:
      case -1:
        return this.ionStorage.set('users', [user]).then(
          data => {
            return true;
          }
        )
        break;
      default:
        return false;
    }
  }

  updateUser(user: User, isEmail: any = { type: false }) {
    return this.ionStorage.get('users').then(
      users => {
        for (let i = 0; i < users.length; i++) {
          if (users[i].email === user.email) {
            this._user = user;
            users[i] = user;
            this.ionStorage.set('users', users)
            return true
          }
          if (isEmail) {
            if (users[i].email === user.email) {
              this._user = user;
              users[i] = user;
              this.ionStorage.set('users', users)
              return true
            }
          }
          return false
        }
      }
    )
  }

}
