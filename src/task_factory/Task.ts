// interfaz de tareas

export interface Task {
  name: string;
  prioridad: number;
  mensaje: string;
  execute(): void;
}

export class MailTask implements Task {
  constructor(public name: string, public prioridad: number, public mensaje: string) {}

  execute(): void {
      console.log(`Ejecutando tarea de Mail: ${this.name}`);
  }
}

export class CalendarTask implements Task {
  constructor(public name: string, public prioridad: number, public mensaje: string){}

  execute(): void {
      console.log(`Ejecutando tarea de calendario: ${this.name}`);      
  }
}

export class SocialPostTask implements Task {
  constructor(public name: string, public prioridad: number, public mensaje: string) {}

  execute(): void {
      console.log(`Ejecutando tarea de Red Social: ${this.name}`);      
  }
}

// Factory
export class TaskFactory {
  static createTask(type: string, name: string, prioridad: number, mensaje: string): Task {
    
    switch (type) {
      case "mail":   
        return new MailTask(name, prioridad, mensaje);
      case "calendar":   
        return new CalendarTask(name, prioridad, mensaje);
      case "social":   
        return new SocialPostTask(name, prioridad, mensaje)
    
      default:
        throw new Error("Tipo de tarea no soportada");
    }
  }
}