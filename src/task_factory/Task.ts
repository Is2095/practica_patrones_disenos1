// interfaz de tareas

export interface Task {
  name: string;
  execute(): void;
}

export class MailTask implements Task {
  constructor(public name: string) {}

  execute(): void {
      console.log(`Ejecutando tarea de Mail: ${this.name}`);
  }
}

export class CalendarTask implements Task {
  constructor(public name: string){}

  execute(): void {
      console.log(`Ejecutando tarea de calendario: ${this.name}`);      
  }
}

export class SocialPostTask implements Task {
  constructor(public name: string) {}

  execute(): void {
      console.log(`Ejecutando tarea de Red Social: ${this.name}`);      
  }
}

// Factory
export class TaskFactory {
  static createTask(type: string, name: string): Task {
    
    switch (type) {
      case "mail":   
        return new MailTask(name);
      case "calendar":   
        return new CalendarTask(name);
      case "social":   
        return new SocialPostTask(name)
    
      default:
        throw new Error("Tipo de tarea no soportada");
    }
  }
}