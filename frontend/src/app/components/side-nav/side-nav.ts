import { Component } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  imports: [],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {
  user = {
    name: 'Davino Sadim',
    department: 'Development',
    avatarUrl: 'https://placehold.co/80x80',
  };

  menuItems = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      active: true,
      route: '/dashboard',
    },
    {
      label: 'Time Logs',
      icon: 'history_toggle_off',
      active: false,
      route: '/time-logs',
    },
    {
      label: 'Schedule',
      icon: 'calendar_month',
      active: false,
      route: '/schedule',
    },
    {
      label: 'Requests',
      icon: 'pending_actions',
      active: false,
      route: '/requests',
    },
    {
      label: 'Settings',
      icon: 'settings',
      active: false,
      route: '/settings',
    },
  ];
}
