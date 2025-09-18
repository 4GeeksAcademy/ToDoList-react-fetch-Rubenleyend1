import React, { useState, useEffect } from "react";

const Api = "https://playground.4geeks.com/todo";

const Home = () => {
  const [usuario, setUsuario] = useState("");
  const [confirmado, setConfirmado] = useState(false);
  const [tarea, setTarea] = useState("");
  const [lista, setLista] = useState([]);

  // Cargar usuario y tareas al iniciar
  useEffect(() => {
    const u = localStorage.getItem("usuario");
    if (u) {
      setUsuario(u);
      setConfirmado(true);
      cargarTareas(u);
    }
  }, []);

  const cargarTareas = async (user) => {
    try {
      const res = await fetch(`${Api}/users/${user}`);
      const data = await res.json();
      setLista(data.todos || []);
    } catch (err) {
      console.log("Error cargando tareas:", err);
    }
  };

  const confirmarUsuario = async () => {
    if (!usuario.trim()) return;
    try {
      await fetch(`${Api}/users/${usuario}`, { method: "POST", headers: { accept: "application/json" } });
    } catch {}
    localStorage.setItem("usuario", usuario);
    setConfirmado(true);
    cargarTareas(usuario);
  };

  const agregarTarea = async (e) => {
    if (e.key === "Enter" && tarea.trim()) {
      const nuevaT = { label: tarea, is_done: false };
      try {
        const res = await fetch(`${Api}/todos/${usuario}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", accept: "application/json" },
          body: JSON.stringify(nuevaT),
        });
        const data = await res.json();
        setLista([...lista, data]);
        setTarea("");
      } catch (err) {
        console.log("Error agregando tarea:", err);
      }
    }
  };

  const eliminarTarea = async (id) => {
    try {
      await fetch(`${Api}/todos/${id}`, { method: "DELETE", headers: { accept: "application/json" } });
      setLista(lista.filter((lista_nueva) => lista_nueva.id !== id));
    } catch (err) {
      console.log("Error eliminando tarea:", err);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario("");
    setConfirmado(false);
    setLista([]);
  };

  return (
    <div className="container">
      {!confirmado ? (
        <div>
          <h1>Nombre de usuario</h1>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmarUsuario()}
            placeholder="Nombre de usuario"
          />
          <button className="btn btn-primary mt-2" onClick={confirmarUsuario}>
            Entrar
          </button>
        </div>
      ) : (
        <div>
          <h1>ToDo de {usuario}</h1>
          <input
            type="text"
            value={tarea}
            onChange={(e) => setTarea(e.target.value)}
            onKeyDown={agregarTarea}
            placeholder="Nueva tarea"
          />
          <ul>
            {lista.map((t) => (
              <li key={t.id} className="d-flex justify-content-between">
                <span>{t.label}</span>
                <button className="btn btn-danger btn-sm" onClick={() => eliminarTarea(t.id)}>X</button>
              </li>
            ))}
          </ul>
          <button className="btn btn-secondary mt-2" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;

