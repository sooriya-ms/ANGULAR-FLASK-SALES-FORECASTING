import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ElementRef } from '@angular/core';


interface Period {
  value: string;
  viewValue: string;
}

interface UploadResponse {
  status: any;
  success: boolean;
  returnimg: any;
  sentimg: any;
  preddata: string;
}

interface ShowTable {
  date: String;
  pred: String;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private http: HttpClient, private router: Router, private _snackBar: MatSnackBar, private el: ElementRef) { }

  sentgraph: string = "";
  returngraph: string = "";
  period: string = "";
  time: string = "";
  message: string = "";
  duration: number = 2 * 1000;
  color: string = 'mat-warn'
  file: any = null;
  seasonal: string = "1";
  graphshow: boolean = false;
  predicted_data:any[]=[];
  single_data: ShowTable = {date:"", pred:""};

  resetFileInput() {
    this.el.nativeElement.querySelector('input[type="file"]').value = '';
    this.file = null;
  }

  // // Assuming you have an input element with the ID "fileInput"
  // fileInput: HTMLInputElement = document.getElementById('fileInput') as HTMLInputElement;

  // // Get the selected file (if any)
  // selectedFile: File = this.fileInput.files ? this.fileInput.files[0] : null;

  // // Check that a file has been selected before assigning it to a variable of type File
  // if(this.selectedFile) {
  //   const  myFile: File = this.selectedFile;
  //   // Do something with myFile...
  // }

  // fileToUpload: File = null;

  // handleFileInput(files: FileList) {
  //   this.fileToUpload = files.item(0);
  // }

  // @ViewChild('fileInput') fileInput: any;

  openSnackBar() {
    this._snackBar.open(this.message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: this.duration,
      panelClass: ['mat-toolbar', this.color],
    });
  }

  validate() {
    if (this.time == "" || this.time == null) {
      this.message = "Time is empty🥲";
      this.duration = 3 * 1000;
      this.openSnackBar();
      return false;
    } else {
      if (this.period == "") {
        this.message = "Period is empty🥲";
        this.duration = 3 * 1000;
        this.openSnackBar();
        return false;
      }
    }
    return true;
  }


  onFileSelected(event: any) {
    this.file = event.target.files[0];
    console.log(this.file);
    if (this.file) {
      return true;
    }
    return false;
  }

  // uploadData() {
  //   console.log(this.file.name)
  //   if (this.validate()) {
  //     if (this.file != null) {
  //       var formData: FormData = new FormData();
  //       formData.append('this.file', this.file);
  //       console.log(formData)
  //       this.http.post<UploadResponse>('http://127.0.0.1:5000/upload_file', { time: this.time, period: this.period, file: formData }).subscribe((data: UploadResponse) => {
  //         console.log(data);
  //         console.log(data.auth.success);

  //         if (data.auth.success == true) {
  //         }
  //         else {
  //           this.message = "Error occured"
  //           this.openSnackBar()
  //           this.clear();
  //         }
  //       }, error => {
  //         console.log(error);
  //         this.clear();
  //       });
  //     }
  //     else {
  //       this.message = 'Select file'
  //       this.openSnackBar()
  //     }
  //   }
  //   //   this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
  //   //     // do something, if upload success
  //   //     }, error => {
  //   //       console.log(error);
  //   //     });
  //   console.log("submited")
  // }



  uploadData() {
    if (this.validate()) {
      if (this.file != null) {
        var formData: FormData = new FormData();
        formData.append('time', this.time);
        formData.append('period', this.period);
        formData.append('seasonal', this.seasonal);
        formData.append('file', this.file);
        console.log("formData", formData)
        this.http.post<UploadResponse>('http://127.0.0.1:5000/upload_file', formData).subscribe((data: UploadResponse) => {
          console.log(data);
          console.log(data.status.success);

          if (data.status.success == true) {
            this.sentgraph = 'data:image/png;base64,' + data.status.sentimg;
            this.returngraph = 'data:image/png;base64,' + data.status.returnimg;
            var datas = data.status.preddata;
            console.log("datas", datas)
            
            // Load predicted table
            datas = JSON.parse(datas)
            console.log(datas)

            // Object.entries(datas).forEach((entry) => {
            //   const [key, value] = entry;
            //   console.log(`${key}: ${value}`);
            //   value = JSON.parse(value)
            //   Object.entries(value).forEach((entryy) => {

            //   })
            //   this.single_data = {date:value.Date, pred:value.Sales}
            //   this.predicted_data.push(single_data);
            // });

            // console.log("datas", datas.length)
            // datas.Date.forEach(()) => {
            //   this.predicted_data.push("hiii");
            // });
            // for(let result of datas.Date){
            //   console.log("result num : ", result)
            //   this.predicted_data.push(result);
            // }
            this.predicted_data = datas;
            this.predicted_data = Object.values(this.predicted_data);

            console.log('predicted', this.predicted_data);
            console.log('dataarray')


            this.graphshow = true;
          }
          else {
            this.message = "Some error occured, Check instruction"
            this.openSnackBar()
            this.clear();
          }
        }, error => {
          console.log(error);
          this.clear();
        });
      }
      else {
        this.message = 'Select file'
        this.openSnackBar()
      }
    }
    //   this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
    //     // do something, if upload success
    //     }, error => {
    //       console.log(error);
    //     });
    console.log("submited")
  }

  clear() {
    this.time = "";
    this.period = "";
    this.seasonal = "1";
    this.resetFileInput();
    this.graphshow = false;
  }

  periods: Period[] = [
    { value: 'hour', viewValue: "Hourly" },
    { value: 'day', viewValue: "Daily" },
    { value: 'week', viewValue: 'Weekly' },
    { value: 'month', viewValue: 'Monthly' },
    { value: 'year', viewValue: 'Yearly' },
  ];
}
