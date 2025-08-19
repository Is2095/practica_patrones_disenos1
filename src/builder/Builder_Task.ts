import { DbConnection } from "../singletonDB/Singleton_DB";
import { ExecutionStrategy } from "../strategy/Strategy_task";
import { Task } from "../task_factory/Task";

// Builder
export class ExecutableTask {
  constructor(private task: Task, private strategy: ExecutionStrategy) {}

  execute() {
    this.strategy.run(this.task);
    // guardamos en la base de datos (singleton)
    const db = DbConnection.getInstance();
    db.addTask({
      name: this.task.name,
      type: this.task.constructor.name,
      strategy: this.strategy.constructor.name,
      executedAt: new Date()
    });
  }
}

export class TaskBuilder {
  private task!: Task;
  private strategy!: ExecutionStrategy;

  setTask(task: Task): this {
    this.task = task;
    return this;
  }

  setStrategy(strategy: ExecutionStrategy): this {
    this.strategy = strategy;
    return this;
  }

  build(): ExecutableTask {
    if(!this.task) throw new Error("Falta definir la tarea")
    if(!this.strategy) throw new Error("Falta definir la estrategia")
    return new ExecutableTask(this.task, this.strategy)
  }
}
