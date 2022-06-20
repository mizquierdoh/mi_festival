import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArtistSpotify } from '../entities/artist-spotify';
import { Grupo } from '../entities/grupo';

const client_id = '0ef858dc874e495a891f9ae9a1f01bf5'; // Your client id
const client_secret = '547a96667ac94ba3992d07f7df66686e'; // Your secret

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  token: string;

  constructor(private http: HttpClient) {
  }

  getCurrentlyPlaying(): Promise<Observable<any>> {
    return new Promise<any>(resolve => {
      this.getToken().subscribe(data => {
        const token = data['access_token'];
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        const url = "https://api.spotify.com/v1/me/player/currently-playing"
        resolve(this.http.get(url, { headers }));
      });
    });
  }


  getToken(): Observable<any> {

    const authorizationTokenUrl = `https://accounts.spotify.com/api/token`;
    const body = 'grant_type=client_credentials';
    return this.http.post(authorizationTokenUrl, body, {
      headers: new HttpHeaders({
        Authorization:
          'Basic  ' + btoa(client_id + ':' + client_secret),
        'Content-Type': 'application/x-www-form-urlencoded;',
      }),
    });
  }

  searchGrupo(nombre: string): Promise<ArtistSpotify[]> {
    return new Promise<ArtistSpotify[]>(resolve => {
      this.getToken().subscribe(data => {
        const token = data['access_token'];
        const nombreEncoded = window.encodeURIComponent(nombre);
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        const url = `https://api.spotify.com/v1/search?q=${nombreEncoded}&type=artist`;
        return this.http.get(url, { headers }).subscribe(busqueda => {
          let resultados: ArtistSpotify[] = [];
          const artists = busqueda['artists'];
          const items = artists['items'].sort((a, b) => Number.parseInt(a['popularity']) - Number.parseInt(b['popularity']));
          for (const item of items) {
            console.log(item);
            let artista = new ArtistSpotify();
            artista.idSpotify = item['id'];
            artista.nombre = item['name'];
            artista.generos = item['genres'];
            let height = 0;
            let imagen: string;
            for (const image of item['images']) {
              if (Number.parseInt(image['height']) > height) {
                height = Number.parseInt(image['height']);
                imagen = image['url'];
              }
            }
            artista.image = imagen;
            resultados.push(artista);

          }

          resolve(resultados);

        });
      });
    });

  }

  getGrupos(tanda: Grupo[]): Promise<ArtistSpotify[]> {
    return new Promise<ArtistSpotify[]>(resolve => {
      this.getToken().subscribe(data => {
        const token = data['access_token'];
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        let ids = "";
        for (let i = 0; i < tanda.length; i++) {
          if (!tanda[i].infoSpotify.idSpotify) {
            continue;
          }
          ids = ids + tanda[i].infoSpotify.idSpotify;
          if (tanda.length - 1 != i) {
            ids = ids + ",";
          }
        }

        const url = "https://api.spotify.com/v1/artists?ids=" + ids;
        return this.http.get(url, { headers }).subscribe(busqueda => {
          let resultados: ArtistSpotify[] = [];
          const artists = busqueda['artists'];
          for (const resultado of artists) {
            let artist = new ArtistSpotify();
            artist.nombre = resultado['name'];
            artist.idSpotify = resultado['id'];
            artist.generos = resultado['genres'];
            if (!!resultado['images']) {
              let height = 0;
              let imagen: string;
              for (const image of resultado['images']) {
                if (Number.parseInt(image['height']) > height) {
                  height = Number.parseInt(image['height']);
                  imagen = image['url'];
                }
              }
              artist.image = imagen;
            }
            resultados.push(artist);
          }

          resolve(resultados);

        });
      });
    });
  }


}
