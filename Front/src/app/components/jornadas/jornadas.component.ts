import { Component, OnInit } from '@angular/core';
import { equipoRestService } from 'src/app/services/equipoRest/equipo-rest.service';
import { LigasRestService } from 'src/app/services/ligasRest/ligas-rest.service';
import { JornadaRestService } from 'src/app/services/jornadaRest/jornada-rest.service';

@Component({
  selector: 'app-jornadas',
  templateUrl: './jornadas.component.html',
  styleUrls: ['./jornadas.component.css']
})
export class JornadasComponent implements OnInit {
  jornadas: any = [];
  equipos: any;
  ligas: any;
  jornada:number = 0;
  equipolocal: any = '';
  equipolocalGoles:number = 0;
  equipovisitante:any= '';
  equipovisitanteGoles:number=0;
  addJornadas:any;

  constructor(
    private jornadaRest: JornadaRestService,
    private equipoRest: equipoRestService,
    private ligaRest: LigasRestService
  ) {}

  ngOnInit(): void {
    this.getJornadas();
    this.getLigas();
    this.getEquipos();
  }

  getJornadas(){
    this.jornadaRest.getJornadas().subscribe({
        next: (res:any)=>{
          this.jornadas = res.jornadas;
          console.log(this.jornadas);
        },
        error: (err)=> console.log(err.error.message)
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

  getEquipos(){
    this.equipoRest.getEquipos().subscribe({
      next: (res:any)=>{
        this.equipos = res.equipos;
        console.log(this.equipos)
      },
      error: (err)=> console.log(err.error.message)
    })
  }

  saveJornada(){
    let addJornada ={
      jornada: this.jornada,
      equipolocal: this.equipolocal,
      equipolocalGoles :this.equipolocalGoles,
      equipovisitante: this.equipovisitante,
      equipovisitanteGoles: this.equipovisitanteGoles
    };
    this.jornadaRest.saveJornada(addJornada).subscribe({
      next: (res:any)=>{
        addJornada = res.empujarJornada ;
        console.log(addJornada);
      }, 
      error: (err)=> alert(err.error.message || err.error)
    })
  }
}
