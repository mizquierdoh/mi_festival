import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./components/search/search.module').then(m => m.SearchPageModule)
  },
  {
    path: 'grupo/:uuid',
    loadChildren: () => import('./components/grupo/grupo.module').then(m => m.GrupoPageModule)
  },
  {
    path: 'escuchando',
    loadChildren: () => import('./components/escuchando/escuchando.module').then(m => m.EscuchandoPageModule)
  },
  {
    path: 'editar',
    loadChildren: () => import('./components/editar/editar.module').then(m => m.EditarPageModule)
  },
  {
    path: 'editar/:uuid',
    loadChildren: () => import('./components/editar/editar.module').then(m => m.EditarPageModule)

  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
