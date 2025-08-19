import { Task } from "../task_factory/Task";

// Strategy
export interface ExecutionStrategy {
  run(task: Task): void;
}

export class InmediateStrategy implements ExecutionStrategy {
  run(task: Task): void {
    console.log(`Ejecutando la estrategia: INMEDIATA...`);
    task.execute();
  }
}

export class ScheduledStrategy implements ExecutionStrategy {
  run(task: Task): void {
    console.log(`Ejecutando la estrategia: PROGRAMADA...`);
    task.execute();
  }
}

export class ConditionalStrategy implements ExecutionStrategy {
  run(task: Task): void {
      const isDay = new Date().getHours() >= 6 && new Date().getHours() <=18;
      console.log(`Ejecutando la estrategia: CONDICIONAL...`);
      if(isDay) {
        console.log("Es de día, se ejecutará la tarea: ");
        task.execute()
      } else {
        console.log("Es de noche, la tarea no se ejecutará");
      }
  }
}