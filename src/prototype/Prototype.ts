import { Task } from "../task_factory/Task";

// Interfaz Prototype
export interface Prototype<T> {
  clone(): T
}

// Implementación para las tareas
export class PrototypeTask implements Prototype<Task> {
  constructor(private original: Task){}

  clone(): Task {
      // clonamos la tarea manteniendo su nombre pero con sufijo " (copia)"
      const cloneName = this.original.name + " (copia>)"
      const cloned = Object.create(
        Object.getPrototypeOf(this.original),
        Object.getOwnPropertyDescriptors(this.original),
      )

      cloned.name = cloneName;

      return cloned
  }
}