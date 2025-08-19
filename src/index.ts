import { TaskBuilder } from "./builder/Builder_Task";
import { DbConnection } from "./singletonDB/Singleton_DB";
import {
  ConditionalStrategy,
  ExecutionStrategy,
  InmediateStrategy,
  ScheduledStrategy,
} from "./strategy/Strategy_task";
import { TaskFactory } from "./task_factory/Task";

import readlineSync from "readline-sync";
/*
//creamosuna tarea con Factory
const task = TaskFactory.createTask("mail", "Responder correos de clientes ")

// definimos una estrategia
const strategy = new InmediateStrategy()

// la construimos con Builder
const executable = new TaskBuilder()
.setTask(task)
.setStrategy(strategy)
.build()

// ejecutamos
executable.execute()

// vemos historial desde singleton
console.log("Historial de tareas: ", DbConnection.getInstance().getTasks());
*/

function main() {
  console.log(" -- Bienvenido al asistente de tareas -- ");

  let exit = false;
  while (!exit) {
    console.log("\n¿Qué deseas hacer? ");
    console.log("[1] Crear nueva tarea");
    console.log("[2] Ver historial de tareas");
    console.log("[3] Limpiar historial");
    console.log("[0] Salir");

    const choice = readlineSync.question("Seleccione una opción: ");

    switch (choice) {
      case "1": {
        console.log("\n¿Qué tipo de tarea deseas crear? ");
        console.log("[1] Contestar Mail");
        console.log("[2] Agregar Recordatorio Calendario");
        console.log("[3] Realizar post en Red Social");

        const taskType = readlineSync.question("Seleccione el tipo: ");
        const taskName = readlineSync.question("Nombre de la tarea: ");

        let type = "";
        if (taskType === "1") {
          type = "mail";
        } else if(taskType === "2") {
          type = "calendar"
        } else if (taskType === "3") {
          type = "social"
        }
        const task = TaskFactory.createTask(type, taskName);

        console.log("\n¿Estrategia de ejecución?");
        console.log("[1] Inmediato");
        console.log("[2] Programado");
        console.log("[3] Condicional");

        const strategyChoice = readlineSync.question(
          "Selecione la estrategia: "
        );
        let strategy: ExecutionStrategy;

        switch (strategyChoice) {
          case "1":
            strategy = new InmediateStrategy();
            break;
          case "2":
            strategy = new ScheduledStrategy();
            break;
          case "3":
            strategy = new ConditionalStrategy();
            break;

          default:
            throw new Error("Estrategia no válida");
        }

        const executable = new TaskBuilder()
          .setTask(task)
          .setStrategy(strategy)
          .build();

        executable.execute();
        break;
      }
      case "2": {
        const db = DbConnection.getInstance();
        const tasks = db.getTasks();

        if(tasks.length === 0) {
          console.log("\nNo hay tareas guardas");
        } else {
          console.log("\nHistorial de tareas.");
          
          tasks.forEach((t, i) => {
            console.log(`
              #${i+1} - ${t.type} | ${t.name} | Estrategia: ${t.strategy} | Fecha: ${t.executedAt.toLocaleString()}
              `);
            
          })
        }
        
        // console.log(
        //   db.getTasks().length ? db.getTasks() : "No hay tareas registradas. "
        // );
        break;
      }
      case "3": {
        const db = DbConnection.getInstance();
        db.clear();
        console.log("Historial limpio.");
        break;
      }
      case "0": {
        exit = true;
        console.log("Saliendo del asistente. ¡Hasta luego!");
        break;
      }
      default:
        console.log("Ooción no válida.");
      return;
    }
  }
}

main();
