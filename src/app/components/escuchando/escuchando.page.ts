import { Component, OnInit } from '@angular/core';
import { observable } from 'rxjs';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-escuchando',
  templateUrl: './escuchando.page.html',
  styleUrls: ['./escuchando.page.scss'],
})
export class EscuchandoPage implements OnInit {

  escuchando: any;

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.spotifyService.getCurrentlyPlaying().then(observable => {
      observable.subscribe(data => {
        console.log(data);
        this.escuchando = data;
      });
    });
  }

}
