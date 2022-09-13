import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwPush } from '@angular/service-worker';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-statusbar',
  templateUrl: 'statusbar.component.html',
  styleUrls: ['statusbar.component.scss']
})
export class StatusBarComponent implements OnInit {
  status = 0;
  registered = false;
  checking = false;
  swReg: any;

  constructor(
    private http: HttpClient,
    private swPush: SwPush,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getSubscription();
  }

  getSubscription() {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
        .then(() => {
          this.requestSubscription();
        })
        .catch(() => {
          this.status = 0;
          this._snackBar.open(
            'You denied this application from sending web notifications. Please, consider unblocking it from your browser options.',
            'Close',
            {
              panelClass: 'darkSnack',
              duration: 3000,
            }
          );
        });
    } else if (Notification.permission === 'denied') {
      this.status = 0;
      this._snackBar.open(
        'You denied this application from sending web notifications. Please, consider unblocking it from your browser options.',
        'Close',
        {
          panelClass: 'darkSnack',
          duration: 2000,
        }
      );
    } else {
      this.requestSubscription();
    }
  }
  async requestSubscription() {
    try {
      this.status = 2;
      await this.swPush
        .requestSubscription({
          serverPublicKey:
            'BB2wzMQ93_kDVyn5G7DUAYAtAGml8XfpmYlu3xO_L5DuPyta6hgidhw40upfDLVY7Yvt-jPc6MvmRsbdIL9B7YY',
        })
        .then((data) => {
          const headers = new HttpHeaders()
            .set('content-type', 'application/json')
            .set('Access-Control-Allow-Origin', '*');
          this.swReg = data;
          this.http
            .post(
              `${environment.endpoint}/api/subscribe`,
              JSON.stringify(this.swReg),
              { headers }
            )
            .subscribe(
              (res) => {
                this.status = 1;
                this._snackBar.open('Notifications enabled!', 'Close', {
                  panelClass: 'darkSnack',
                  duration: 3000,
                });
              },
              (err) => {
                this.status = 0;
                console.error(err);
                this._snackBar.open(
                  'Error subscribing to notifications. Please try again.',
                  'Close',
                  {
                    panelClass: 'darkSnack',
                    duration: 3000,
                  }
                );
              }
            );
        });
    } catch (e) {
      this.status = 0;
      console.log(e);
      this._snackBar.open('Error subscribing to notifications', 'Close', {
        panelClass: 'darkSnack',
        duration: 3000,
      });
    }
  }

  registeredModal(){
    this._snackBar.open(
      'You have successfully registered to receive notifications! Go and enable them on the assets of your interest :)',
      'Close',
      {
        panelClass: 'darkSnack',
        duration: 6000,
      }
    );
  }
  
  pendingModal(){
    this._snackBar.open(
      'We are still trying to register your browser to receive push notifications. Please wait. If there\'s no changes after 1 minute, please refresh the webpage and clean your browser cache.',
      'Close',
      {
        panelClass: 'darkSnack',
        duration: 10000,
      }
    );
  }

}
