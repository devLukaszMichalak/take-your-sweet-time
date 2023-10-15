export class Project {
  constructor(public id: string | null,
              public startTimer: Date | null,
              public totalTimeInSeconds: number) {
  }
}