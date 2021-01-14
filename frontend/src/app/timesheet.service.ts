import { Injectable } from '@angular/core';
import {Timesheet} from './timesheets';
import {Student} from './students';
import {LoginData} from './loginData';

import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse} from '@angular/common/http';
import {map} from "rxjs/operators";
import { Location } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class TimesheetService {
  loginData: LoginData;
  message: string;
  url: string= 'https://'+window.location.hostname+':8080/';

  constructor(private http: HttpClient) { }


  getStudents(year: number, month: number): Observable<Timesheet[]>{
      return this.http.get<Timesheet[]>(this.url+'timesheets/'+year+"/"+month);
  };

  createTimesheet(userName: string, year: number, month: number): Observable<any> {
      return this.http.put<any>('https://8yl0i8h71f.execute-api.eu-central-1.amazonaws.com/default/'+userName+'/'+year+'/'+month,
        JSON.parse('{"loginUserName": "'+sessionStorage.getItem('loginUserName')+'", "password": "'+sessionStorage.getItem('password')+'"}'))//, {'Content-Type': 'application/json'});
  }

  openTimesheet(userName: string, year: number, month: number){
      return this.http.get('https://8yl0i8h71f.execute-api.eu-central-1.amazonaws.com/default/'+userName+'/'+year+'/'+month,
       {
         responseType: 'blob',
         observe: 'response',
         headers: {'Accept': 'application/octet-stream'}
         });
  }

  postNewStudent(studentData): Observable<string>{
     const body= new FormData();
     body.append('firstName', studentData.firstName);
     body.append('lastName', studentData.lastName);
     body.append('userName', studentData.userName);
     body.append('loginUserName', sessionStorage.getItem('loginUserName'));
     body.append('password', sessionStorage.getItem('password'));
    return this.http.post(this.url+'students', body, {responseType: "text"});
  }

  deleteStudent(student: Student){
    return this.http.delete(this.url+'students/'+student.userName, {responseType: 'text'});
  }

  deleteTimesheet(timesheet: Timesheet){
    return this.http.delete(this.url+'timesheets/'+timesheet.student.userName+'/'+timesheet.year+'/'+ timesheet.month, {responseType: 'text'});
  }


}
