import { Component, OnInit } from '@angular/core';
import { equipoModel } from 'src/app/models/equipo.model';
import { equipoRestService } from 'src/app/services/equipoRest/equipo-rest.service';
import { LigasRestService } from 'src/app/services/ligasRest/ligas-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css']
})
export class EquiposComponent implements OnInit {
  equipo: equipoModel;
  equipos: any = [];
  ligas:any;

  constructor(
    private equipoRest: equipoRestService,
    private ligaRest: LigasRestService
  ) { this.equipo = new equipoModel('','', 0, 0, 0,'','') }

  ngOnInit(): void {
    this.getEquipos();
    this.getLigas();
  }

  getEquipos(){
    this.equipoRest.getEquipos().subscribe({
      next:(res:any)=>{
        this.equipos = res.equipos;
        console.log(this.equipos);
      },
      error: (err) => console.log(err.error.message || err.error)
    })
  };

  deleteEquipo(id:string){
    this.equipoRest.deleteEquipo(id).subscribe({
      next: (res:any)=> {
        Swal.fire({
          title: res.message + ' ' + res.equiDele.name,
          position: 'center',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        this.getEquipos();
      },
      error: (err)=> Swal.fire({
        title: err.error.message,
        position: 'center',
        icon: 'error',
        timer: 4000
      })
    })
  }

  saveEquipo(addEquipoForm:any){
    this.equipoRest.saveEquipo(this.equipo).subscribe({
      next: (res:any)=> {
        alert(res.message);
        this.getEquipos();
        addEquipoForm.reset();
      },
      error: (err)=> alert(err.error.message || err.error)
    })
  }

  getLigas(){
    this.ligaRest.getLigas().subscribe({
      next: (res:any)=>{
        this.ligas = res.ligas;
        console.log(this.ligas)
      },
      error: (err)=> console.log(err.error.message)
    })
  }

}
