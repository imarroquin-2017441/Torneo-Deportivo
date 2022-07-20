import { Component, OnInit } from '@angular/core';
import { ligaModel } from 'src/app/models/liga.model';
import { LigasRestService } from 'src/app/services/ligasRest/ligas-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ligas',
  templateUrl: './ligas.component.html',
  styleUrls: ['./ligas.component.css']
  
})
export class LigasComponent implements OnInit {
  ligas:any = [];
  liga: ligaModel;
  ligaUpdate: any;
  constructor(
    private ligaRest: LigasRestService
  ) { this.liga = new ligaModel('', '', '')}

  ngOnInit(): void {
    this.getLigas();
  }

    getLigas(){
      this.ligaRest.getLigas().subscribe({
        next:(res:any)=>{
          this.ligas = res.ligas;
          console.log(this.ligas);
        },
        error: (err) => console.log(err.error.message || err.error)
      })
    }

    saveLiga(addLigaForm:any){
      this.ligaRest.saveLiga(this.liga).subscribe({
        next: (res:any)=> {
          alert(res.message);
          this.getLigas();
          addLigaForm.reset();
        },
        error: (err)=> alert(err.error.message || err.error)
      })
    }

    deleteLiga(id:string){
      this.ligaRest.deleteLiga(id).subscribe({
        next: (res:any)=> {
          Swal.fire({
            title: res.message + ' ' + res.ligaDele.name,
            position: 'center',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000
          });
          this.getLigas();
        },
        error: (err)=> Swal.fire({
          title: err.error.message,
          position: 'center',
          icon: 'error',
          timer: 4000
        })
      })
    }

    /*getLiga(id: string){
      this.ligaRest.getLiga(id).subscribe({
        next:(res:any)=>{this.ligaUpdate = res.liga},
        error:(err)=>{alert(err.error.message)}
        
      })
    };
*/
}
