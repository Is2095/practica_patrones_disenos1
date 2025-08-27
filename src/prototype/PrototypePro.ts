import { ExecutionStrategy, InmediateStrategy } from "../strategy/Strategy_task";
import { Task } from "../task_factory/Task";

// interfaces para el patrón Prototype
export interface CloneableTask extends Task {
  clone(): CloneableTask;
  setName(nombre: string): void;
  setPrioridad(prioridad: number): void;
  setMensaje(mensaje: string): void;
  setEstrategia(estrategia: ExecutionStrategy): void;
}

// clase base para plantillas con implementación de clonado profundo
abstract class PlantillaTarea implements CloneableTask {
  constructor(
    public name: string,
    public prioridad: number,
    public mensaje: string,
    private strategy: ExecutionStrategy,
  ) {}

  abstract execute(): void;

  clone(): CloneableTask {
    const cloned = Object.create(this)
    cloned.strategy = this.strategy
    return cloned
  }

  setName(nombre: string): void {
      this.name = nombre
  }

  setPrioridad(prioridad: number): void {
      this.prioridad = prioridad
  }

  setMensaje(mensaje: string): void {
      this.mensaje = mensaje
  }

  setEstrategia(estrategia: ExecutionStrategy): void {
      this.strategy = estrategia
  }

  getEstrategia(): ExecutionStrategy {
    return this.strategy
  }
}

// ejemplos de plantillas 
export class RecordatorioBase extends PlantillaTarea {
  constructor() {
    super("Recordatorio", 1, "Mensaje predeterminado", new InmediateStrategy)
  }
  execute(): void {
      console.log(`Ejecutando el recordatorio: ${this.mensaje}`);
  }
}

export class BackupSemanal extends PlantillaTarea {
  constructor() {
    super("Backup Semanal", 2, "Realizando backup del sistema", new InmediateStrategy)
  }
  execute(): void {
      console.log(`Ejecutando backup: ${this.mensaje}`);    
  }
}

// Registro de prototipos
export class PrototypeRegistry {
  private static instance: PrototypeRegistry;
  private prototypes: Map<string, CloneableTask>

  private constructor() {
    this.prototypes = new Map()
    this.initializePrototypes()
  }
  private initializePrototypes(): void {
    this.registerPrototype("recordatorio", new RecordatorioBase())
    this.registerPrototype("backup", new BackupSemanal())
  }

  static getInstance(): PrototypeRegistry {
    if(!PrototypeRegistry.instance){
      PrototypeRegistry.instance = new PrototypeRegistry()
    }
    return PrototypeRegistry.instance
  }

  registerPrototype(nombre: string, prototipo: CloneableTask): void {
    this.prototypes.set(nombre, prototipo)
  }

  getPrototype(nombre: string): CloneableTask{
    const prototype = this.prototypes.get(nombre)
    if(!prototype){
      throw new Error(`Plantilla no encontrada: ${nombre}`)
    }
    return prototype.clone()
  }

  listPrototypes(): string[] {
    return Array.from(this.prototypes.keys())
  }
}

