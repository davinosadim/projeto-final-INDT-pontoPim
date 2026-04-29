import { Component } from '@angular/core';
import { TopBar } from '../../components/top-bar/top-bar';
import { SideNav } from '../../components/side-nav/side-nav';
import { DashboardMenu } from '../../components/dashboard-menu/dashboard-menu';

@Component({
  selector: 'app-dashboard-gestor',
  imports: [TopBar, SideNav, DashboardMenu],
  templateUrl: './dashboard-gestor.html',
  styleUrl: './dashboard-gestor.css',
})
export class DashboardGestor {}
