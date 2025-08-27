// singleton

export interface TaskRecord {
  name: string;
  type: string;
  strategy: string;
  prioridad: number;
  mensaje: string;
  executedAt: Date
}
export class TaskDb {
  private tasks: TaskRecord[] = [];

  addTask(record: TaskRecord) {
    this.tasks.push(record);
  }

  getTasks(): TaskRecord[] {
    return this.tasks;
  }

  clear() {
    this.tasks = [];
  }
}

export class DbConnection {
  private static instanceDB: TaskDb;

  static getInstance(): TaskDb {
    if (!DbConnection.instanceDB) {
      DbConnection.instanceDB = new TaskDb();
    }
    return DbConnection.instanceDB;
  }
}
