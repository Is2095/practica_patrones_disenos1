import { ExecutableTask, TaskBuilder } from "../builder/Builder_Task";
import { DbConnection } from "../singletonDB/Singleton_DB";
import { ExecutionStrategy } from "../strategy/Strategy_task";
import { Task, TaskFactory } from "../task_factory/Task";

export class TaskFacade {
  static createAndExecuteTask(
    type: string,
    name: string,
    strategy: ExecutionStrategy
  ): ExecutableTask {
    // usamos Factory para crear la tarea
    const task: Task = TaskFactory.createTask(type, name);

    // construimos un Builder
    const executable = new TaskBuilder()
      .setTask(task)
      .setStrategy(strategy)
      .build();

    // ejecutamos y guardamos en DB (singleton)
    executable.execute();
    return executable;
  }
  static getHistory() {
    return DbConnection.getInstance().getTasks();
  }

  static clearHistory() {
    DbConnection.getInstance().clear();
  }
}
