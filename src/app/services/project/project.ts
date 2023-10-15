export class Project {
  constructor(public id: string | null,
              public startTimer: Date | null,
              public name: string,
              public owner: string,
              public totalTimeInSeconds: number) {
  }
}