import { TaskBuilder } from "../builder/Builder_Task";
import { CloneableTask, PrototypeRegistry } from "../prototype/PrototypePro";
import { DbConnection, TaskRecord } from "../singletonDB/Singleton_DB";
import { ExecutionStrategy, InmediateStrategy } from "../strategy/Strategy_task";
import { Task } from "../task_factory/Task";

export class TaskFacade {
  private static instance: TaskFacade;
  private prototypeRegistry: PrototypeRegistry;
  private taskBuilder: TaskBuilder;

  private constructor() {
    this.prototypeRegistry = PrototypeRegistry.getInstance();
    this.taskBuilder = new TaskBuilder();
  }

  static getInstance(): TaskFacade {
    if (!TaskFacade.instance) {
      TaskFacade.instance = new TaskFacade();
    }
    return TaskFacade.instance;
  }

  createTaskFromTemplate(templateName: string, newName: string): Task {
    // const template2 = this.createTaskFromTemplate.p
    const template = this.prototypeRegistry.getPrototype(templateName);
    const clonedTask = template.clone() as Task;
    clonedTask.name = newName;
    return clonedTask;
  }

  executeTask(task: Task, nuevaStrategy: ExecutionStrategy = new InmediateStrategy()): void {
    const executableTask = this.taskBuilder
      .setTask(task)
      .setStrategy(nuevaStrategy)
      .build();

    executableTask.execute()
  }

  getTaskHistory(): TaskRecord[] {
    const db = DbConnection.getInstance()
    return db.getTasks()
  }

  listAvailableTemplate(): CloneableTask[] {
    const registry = PrototypeRegistry.getInstance()
    const templateNames = registry.listPrototypes()
    return Array.from(templateNames.entries()).map(
      ([, template]) => registry.getPrototype(template)
    )
  }
}
