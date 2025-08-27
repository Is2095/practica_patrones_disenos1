import { TaskBuilder } from "./builder/Builder_Task";
import { TaskFacade } from "./facade/FacadePro";
import { CloneableTask } from "./prototype/PrototypePro";
import { DbConnection } from "./singletonDB/Singleton_DB";
import {
  ConditionalStrategy,
  ExecutionStrategy,
  InmediateStrategy,
  ScheduledStrategy,
} from "./strategy/Strategy_task";
import { TaskFactory } from "./task_factory/Task";

import readlineSync from "readline-sync";

function main() {
  console.log(" -- Bienvenido al asistente de tareas -- ");

  let exit = false;
  while (!exit) {
    console.log("\n¿Qué deseas hacer? ");
    console.log("[1] Crear nueva tarea");
    console.log("[2] Ver historial de tareas");
    console.log("[3] Limpiar historial");
    console.log("[4] Crear tarea desde plantilla");
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

        const prioridad = readlineSync.questionInt(
          "Ingrese la prioridad (0 al 5): ",
          { limit: [0, 1, 2, 3, 4, 5] }
        );

        const mensaje = readlineSync.question(
          "Ingrese el mensaje para la tarea: "
        );

        let type = "";
        if (taskType === "1") {
          type = "mail";
        } else if (taskType === "2") {
          type = "calendar";
        } else if (taskType === "3") {
          type = "social";
        }
        const task = TaskFactory.createTask(type, taskName, prioridad, mensaje);

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

        if (tasks.length === 0) {
          console.log("\nNo hay tareas guardas");
        } else {
          console.log("\nHistorial de tareas.");

          tasks.forEach((t, i) => {
            console.log(`
              #${i + 1} - ${t.type} | ${t.name} | Prioridad: ${
              t.prioridad
            } | Mensaje: ${t.mensaje} | Estrategia: ${
              t.strategy
            } | Fecha: ${t.executedAt.toLocaleString()}
              `);
          });
        }
        break;
      }
      case "3": {
        const db = DbConnection.getInstance();
        db.clear();
        console.log("Historial limpio.");
        break;
      }
      case "4": {
        const facade = TaskFacade.getInstance();
        const templates = facade.listAvailableTemplate();

        console.log("\nPlantillas disponibles: ");
        templates.forEach((template, index) => {
          console.log(`[${index + 1}] ${template.name}`);
        });
        const index = readlineSync.questionInt("Selecione una plantilla: ", {
          limit: Array.from(Array(templates.length).keys()),
        });
        const templateName = templates[index - 1];
        if (!templateName) break;
        const nuevaNombre = readlineSync.question("Nombre de la nueva tarea: ");

        const nuevaTarea = templateName.clone() as CloneableTask;
        nuevaTarea.setName(nuevaNombre);

        const nuevaPrioridad = readlineSync.questionInt(
          "Nueva prioridad (0 para mantener la actual): "
        );
        if (nuevaPrioridad !== 0) nuevaTarea.setPrioridad(nuevaPrioridad);

        const nuevoMensaje = readlineSync.question(
          "Nuevo mensaje (Enter para mantener el actual): "
        );
        if (nuevoMensaje) nuevaTarea.setMensaje(nuevoMensaje);

        console.log("\nEstrategias disponibles:");
        console.log("[1] Inmediata");
        console.log("[2] Programada");
        console.log("[3] Condicional");

        const opcion = readlineSync.questionInt("Selecione una estrategia: ");

        let nuevaStrategy: ExecutionStrategy;
        switch (opcion) {
          case 1:
            nuevaStrategy = new InmediateStrategy();
            break;
          case 2:
            nuevaStrategy = new ScheduledStrategy();
            break;
          case 3:
            nuevaStrategy = new ConditionalStrategy();
            break;
          default:
            nuevaStrategy = new InmediateStrategy();
        }

        facade.executeTask(nuevaTarea, nuevaStrategy);

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
