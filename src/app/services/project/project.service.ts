import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { addDoc, collection, collectionData, deleteDoc, doc, DocumentData, DocumentReference, getFirestore, query, Query, updateDoc, where } from '@angular/fire/firestore';
import { Project } from './project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  
  private firestore = getFirestore();
  private projectsCollection = collection(this.firestore, 'projects');
  
  saveProject(project: Project): Promise<DocumentReference> {
    const projectData = (({id, ...rest}) => rest)(project);
    return addDoc(this.projectsCollection, projectData);
  }
  
  deleteProject(project: Project): Promise<void> {
    const projectDocRef = doc(this.projectsCollection, project.id!);
    return deleteDoc(projectDocRef);
  }
  
  updateProject(project: Project): Promise<void> {
    const {id, ...updatedData} = project;
    const projectDocRef = doc(this.projectsCollection, id!);
    return updateDoc(projectDocRef, updatedData);
  }
  
  getProjects(owner: string): Observable<Project[]> {
    const queryFn: Query = query(this.projectsCollection, where('owner', '==', owner));
    
    return collectionData(queryFn, {idField: 'id'})
      .pipe(map((projects: DocumentData[]) => projects
        .map(project => {
          if (project['startTimer']) {
            project['startTimer'] = this.timestampToJsDate(project['startTimer']);
          }
          
          return project;
        })
        .map((project: DocumentData) => project as Project)));
  }
  
  private timestampToJsDate(timestamp: { seconds: number, nanoseconds: number }) {
    const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    return new Date(milliseconds);
  }
  
}
