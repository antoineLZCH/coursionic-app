import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, MenuController } from 'ionic-angular';
import { UserProvider } from "../../providers/user/user";
import { HttpProvider } from "../../providers/http/http";
import { User } from "../../models/user";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

/**
 * @author: KMR
 * @email: yajuve.25.dz@gmail.com
 */

export class LoginPage {
  // Permet de pré-remplir les formulaires d'inscription
  // et de connexion.
  public account: User = {
    "password": "alzch",
    "username": "anLZCH",
    "avatar": "Raouf.png",
    "fullname": "Antoine LZCH",
    "email": "antoine.lozach@imie.fr"
  };

  // Our translated text strings
  public loginErrorString: string; // Message d'erreur à la connexion
  // private opt: string = 'signin'; // définition de la tab par défaut

  constructor(public http: HttpProvider, public userProvider: UserProvider, public menuCtrl: MenuController, public navCtrl: NavController, public translateService: TranslateService) {
    // Pas de Menu
    this.menuCtrl.enable(false);
    // Promesse de traduction (multithreading)
    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  doLoginv1() {
    this.http.get('my-profile.json').subscribe((profile: User) => {
      // Requête async dans le fichier my-profile.json,
      // renvoie le résultat dans la variable profile
      this.userProvider.user = <User>profile;
      if (this.checkConnection(profile))
        this.navCtrl.setRoot('ListFriendsPage');
      else {
        this.account.email = ""
        this.account.password = ""
        this.loginErrorString = "LOGIN ERROR"
      }
      // supprime toutes les vues de la stack et définir une nouvelle rootPage
      // navCtrl = navigation
    }, (err) => {
      console.error(err);
    });
  }

  doLogin() {
    this.userProvider.loginUser(this.account.email, this.account.password).then(
      isConnect => {
        if (isConnect)
          this.navCtrl.setRoot('ListFriendsPage')
        else
          this.loginErrorString = 'Connection error'
      }
    )
  }

  doLoginV2() {
    this.userProvider.loginUserV2(this.account.email, this.account.password).then(
      (data: any) => {
        if (data.error) this.loginErrorString = "Connection error"
        else {
          localStorage.setItem("user", data.user)
          this.navCtrl.setRoot('ListFriendPage')
        }
      }
    )
  }

  doRegister() {
    this.userProvider.registerUser(this.account);
  }
  checkConnection(user: User) {
    return (user.email === this.account.email && user.password === this.account.password)
  }
}
