import { Component } from '@angular/core';

@Component({
  selector: 'app-bottom-nav',
  imports: [],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.css',
})
export class BottomNav {
   items = [
    {
      label: 'Home',
      icon: 'home',
      active: true,
      route: '/meu-ponto',
    },
    {
      label: 'Logs',
      icon: 'timer',
      active: false,
      route: '/logs',
    },
    {
      label: 'Events',
      icon: 'event_note',
      active: false,
      route: '/eventos',
    },
    {
      label: 'Profile',
      icon: 'person',
      active: false,
      route: '/perfil',
    },
  ];
}
