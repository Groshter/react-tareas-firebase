import React, { useEffect, useState } from 'react'
import { firebase } from './firebase'
import swal from 'sweetalert'

function App() {

  const [Tareas, setTareas] = useState([]);
  const [TareaText, setTareaText] = useState('');
  const [ModoEdita, setModoEdita] = useState(false);
  const [Identificador, setIdentificador] = useState('');
  const [Elimina, setElimina] = useState(true);

  useEffect(() => {

    const ObtenerDatos = async () => {
      try {

        const database = firebase.firestore();
        const data = await database.collection('tareas').get();
        const ArrayData = data.docs.map(
          tarea => ({ id: tarea.id, ...tarea.data() })
        )

        setTareas(ArrayData);

      } catch (error) {
        console.log('Ocurrio un error:' + error);
      }
    }

    ObtenerDatos();

  }, []);

  const AgregarTarea = async (e) => {
    e.preventDefault();

    let Graba = true;

    if (!TareaText.trim()) {
      Graba = false;
    }

    if (Graba) {

      try {


        const database = firebase.firestore();

        const nuevaTarea = {
          nombre: TareaText,
          vigente: true,
          fecha: Date.now(),
        };

        const data = await database.collection('tareas').add(nuevaTarea);

        setTareas([...Tareas, {
          ...nuevaTarea, id: data.id
        }]);

        console.log(data);

        setTareaText('');


        swal({
          title: "Proceso Correcto",
          text: "Se ha grabado la tarea",
          icon: "success",
          buttons: "Aceptar",
        });


      } catch (error) {
        console.log('Error al grabar: ' + error);
      }



    }
    else {
      swal({
        title: "No se puede guardar",
        text: "Faltan Campos por completar.",
        icon: "error",
        buttons: "Terminar Formulario",
      });
    }

  }

  const Eliminar = async (id) =>{
    try {

      const database = firebase.firestore();
      await database.collection('tareas').doc(id).delete();

      const ArrayFiltrado = Tareas.filter(tarea => tarea.id !== id);

      setTareas(ArrayFiltrado);

      swal({
        title: "Proceso Correcto",
        text: "Se ha eliminado la tarea",
        icon: "success",
        buttons: "Aceptar",
      });
      
    } catch (error) {
      console.log('Ocurrio un erro al eliminar: ' + error);
    }
  }

  const ActivarEdicion = (Tareita) => {
    setModoEdita(true);
    setTareaText(Tareita.nombre);
    setIdentificador(Tareita.id);
    setElimina(false);

  }

  const ModificaTarea = async (e) => {
    e.preventDefault();

    let Edita = true;

    if (!TareaText.trim()) {
      Edita = false;
    }

    if (Edita) {
      try 
      {
        const database = firebase.firestore();
        await database.collection('tareas').doc(Identificador).update({
          nombre : TareaText
        });

        const ArrayEditado = Tareas.map(item => (
          item.id === Identificador ? { fecha: item.fecha, id: item.id, nombre: TareaText, vigente: item.vigente } : item
        ))

        setTareas(ArrayEditado);
        setModoEdita(false);
        setTareaText('');
        setIdentificador('');
        setElimina(true);

        swal({
          title: "Proceso Correcto",
          text: "Se ha modificado la tarea",
          icon: "success",
          buttons: "Aceptar",
        });

      } catch (error) {
        console.log('Ocurrio un error al editar: ' + error);
      }
    }else{
      swal({
        title: "No se puede modificar",
        text: "Faltan Campos por completar.",
        icon: "error",
        buttons: "Terminar Formulario",
      });
    }

    

  }

  const TerminarTarea = async (id) => {
    try {

      const database = firebase.firestore();
      await database.collection('tareas').doc(id).update({
        vigente : false
      });

      const ArrayModificado = Tareas.map(item  => 
        ( item.id === id ? { fecha: item.fecha, id: item.id, nombre: item.nombre, vigente: false } : item )  
      );


      setTareas(ArrayModificado);

      swal({
        title: "Proceso Correcto",
        text: "Se ha finalizado la tarea",
        icon: "success",
        buttons: "Aceptar",
      });

    } catch (error) {
      console.log('Ocurrio un error al terminar la tarea: ' + error);
    } 
  }

  const ActivarTarea = async(id) =>{
    try {

      const database = firebase.firestore();
      await database.collection('tareas').doc(id).update({
        vigente : true
      });

      const ArrayModificado = Tareas.map(item  => 
        ( item.id === id ? { fecha: item.fecha, id: item.id, nombre: item.nombre, vigente: true } : item )  
      );


      setTareas(ArrayModificado);

      swal({
        title: "Proceso Correcto",
        text: "Se ha activado la tarea",
        icon: "success",
        buttons: "Aceptar",
      });

    } catch (error) {
      console.log('Ocurrio un error al terminar la tarea: ' + error);
    } 
  }


  return (
    <div className='container mt-3'>
      <div className="row">
        <div className="col-md-6">
          Listado de Tareas
            <ul className="list-group">
            {
              Tareas.length > 0 ?
                (
                  Tareas.map(tarea =>
                    (
                      <li className={ tarea.vigente ? 'list-group-item' : 'list-group-item active' } key={tarea.id} > 
                        { tarea.nombre }

                        <button 
                        className="btn btn-success btn-sm float-right"
                        hidden = { tarea.vigente ? false : true }
                        onClick = { () => TerminarTarea(tarea.id) }
                        disabled = { Elimina ? false : true }
                        >Terminar </button>

                        <button
                        className="btn btn-danger btn-sm float-right mr-2"
                        disabled = { Elimina ? false : true }
                        onClick={ () => Eliminar( tarea.id ) }
                        hidden= { tarea.vigente ? false : true }
                        >Eliminar</button>

                        <button 
                        className="btn btn-warning btn-sm float-right mr-2"
                        onClick = { () => ActivarEdicion(tarea)}
                        hidden= { tarea.vigente ? false : true }
                        >Editar</button>

                        {/* <button 
                        className='btn btn-light btn-sm float-right'
                        hidden = { tarea.vigente? true : false }
                        >
                        Terminada 
                        </button> */}

                        <button 
                        className="btn btn-sm btn-info float-right mr-2"
                        hidden = { tarea.vigente? true : false }
                        onClick = { () => ActivarTarea(tarea.id)}
                        >Activar</button>

                        <span 
                        class="badge bg-warning rounded-pill float-right mr-2 text-center"
                        hidden = { tarea.vigente? true : false }
                        >Terminada</span>

                      </li>
                    )
                  )

                ) : (
                  <div className="alert alert-info" role="alert">
                    No se han agregado tareas a la lista.
                  </div>
                )
            }
          </ul>
        </div>
        <div className="col-md-6">
          <h3 className='text-center'>{ ModoEdita ? 'Modificar Tarea' :  'Agregar Tarea'  }</h3>
          <form onSubmit={ ModoEdita ? (e) => ModificaTarea(e) : (e) => AgregarTarea(e)}>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Ingrese Tarea"
              onChange={(e) => setTareaText(e.target.value)}
              value={TareaText}
            />

            <button
            className={
              ModoEdita ? 'btn btn-warning btn-block' :  'btn btn-dark btn-block'
            } 
            type="submit">
              {
                ModoEdita ? 'Modificar' : 'Agregar'
              }
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
