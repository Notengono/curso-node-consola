require('colors');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu,
    pausa,
    leerInput,
    listadoTareaBorrar,
    confirmar, mostrarListadoChecklist } = require('./helpers/inquirer');
// const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');
// const { mostrarMenu, pausa } = require('./helpers/mensajes');


console.clear();

const main = async () => {
    let opt = '';
    const tareas = new Tareas();
    const tareasDB = leerDB();

    if (tareasDB) { // Cargar Tareas
        tareas.cargarTareasFromArray(tareasDB);
    }

    do {
        // Imprimir el menú
        opt = await inquirerMenu();
        // console.log({ opt })

        switch (opt) {
            case '1':
                // crear tarea
                const desc = await leerInput('Descripción:');
                tareas.crearTarea(desc);
                break;
            case '2':
                tareas.listadoCompleto();
                break;
            case '3':
                tareas.listarPendientesCompletadas(true);
                break;
            case '4':
                tareas.listarPendientesCompletadas(false);
                break;
            case '5':
                const ids = await mostrarListadoChecklist(tareas.listadoArr);
                tareas.toggleCompletadas(ids);
                break;
            case '6':
                const id = await listadoTareaBorrar(tareas.listadoArr);
                if (id !== '0') {
                    const confirmarOk = await confirmar('¿Estás seguro de borrar?')
                    if (confirmarOk) {
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada.')
                    }
                }
                break;
            default:
                break;
        }

        guardarDB(tareas.listadoArr);
        await pausa();
    } while (opt !== '0');
}

main();