import { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"

export default function App() {
  const [menu, setMenu] = useState("Inicio")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [inversionistas, setInversionistas] = useState([])
  const [showDelete, setShowDelete] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const montoTotal = inversionistas.reduce(
    (total, inv) => total + Number(inv.monto || 0),
    0
  )

  const iniciarSesion = () => {
    if (usuario === "admin" && password === "1234") {
      setIsLoggedIn(true)
      setError("")
    } else {
      setError("Credenciales incorrectas")
    }
  }

  const cambiarMenu = (item) => {
    setMenu(item)
    window.scrollTo(0, 0)
  }

  const obtenerInversionistas = async () => {
    const { data, error } = await supabase
      .from("inversionistas")
      .select("*")
      .order("id", { ascending: false })

    if (error) {
      console.log(error)
    } else {
      setInversionistas(data)
    }
  }

  const eliminarInversionista = async () => {
    const { error } = await supabase
      .from("inversionistas")
      .delete()
      .eq("id", deleteId)

    if (error) {
      alert("Error al eliminar")
      console.log(error)
    } else {
      setShowDelete(false)
      setDeleteId(null)
      obtenerInversionistas()
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      obtenerInversionistas()
    }
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-blue-950 flex items-center justify-center">
        <div className="bg-white w-96 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto font-bold text-2xl">
              S
            </div>

            <h1 className="text-2xl font-bold mt-4">
              Sistema de Inversionistas
            </h1>

            <p className="text-gray-500 text-sm">Ingresa tus credenciales</p>
          </div>

          <div className="space-y-4">
            <input
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="Usuario"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="Contraseña"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={iniciarSesion}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Iniciar sesión
            </button>

            <p className="text-center text-xs text-gray-400">
              Usuario: admin | Contraseña: 1234
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex text-gray-800">
      <aside className="w-64 bg-blue-950 text-white p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
              S
            </div>

            <div>
              <h1 className="font-bold text-sm">Sistema de</h1>
              <p className="text-sm">Inversionistas</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              "Inicio",
              "Agregar Inversionista",
              "Lista de Inversionistas",
              "Progreso",
              "Reportes",
              "Configuración",
            ].map((item) => (
              <button
                key={item}
                onClick={() => cambiarMenu(item)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm ${
                  menu === item ? "bg-blue-600" : "hover:bg-blue-900"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={() => setIsLoggedIn(false)}
          className="text-left text-sm hover:text-gray-300"
        >
          Cerrar sesión
        </button>
      </aside>

      <main className="flex-1">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <button className="text-gray-500 text-2xl">☰</button>

          <div className="flex items-center gap-4">
            <span>🔔</span>
            <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
              A
            </div>
            <span className="text-sm font-medium">Admin</span>
          </div>
        </header>

        <section className="p-8">
          {menu === "Inicio" && (
            <Inicio
              cambiarMenu={cambiarMenu}
              total={inversionistas.length}
              montoTotal={montoTotal}
            />
          )}

          {menu === "Agregar Inversionista" && (
            <Formulario
              obtenerInversionistas={obtenerInversionistas}
              cambiarMenu={cambiarMenu}
            />
          )}

          {menu === "Lista de Inversionistas" && (
            <Lista
              inversionistas={inversionistas}
              setShowDelete={setShowDelete}
              setDeleteId={setDeleteId}
              cambiarMenu={cambiarMenu}
            />
          )}

          {menu === "Progreso" && (
            <Progreso montoTotal={montoTotal} total={inversionistas.length} />
          )}

          {menu === "Reportes" && (
            <h2 className="text-2xl font-bold">Reportes</h2>
          )}

          {menu === "Configuración" && (
            <h2 className="text-2xl font-bold">Configuración</h2>
          )}
        </section>
      </main>

      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-8 w-96 text-center">
            <div className="text-5xl mb-4">⚠️</div>

            <h2 className="text-xl font-bold mb-3">
              Eliminar Inversionista
            </h2>

            <p className="text-gray-600 mb-6">
              ¿Estás seguro que deseas eliminar este inversionista?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDelete(false)}
                className="px-5 py-3 border rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={eliminarInversionista}
                className="px-5 py-3 bg-red-600 text-white rounded-lg"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Inicio({ cambiarMenu, total, montoTotal }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Bienvenido, Admin</h2>

      <p className="text-gray-500 mb-8">
        Gestiona tus inversionistas y el progreso de tus operaciones.
      </p>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          ["👤➕", "Agregar Inversionista", "Registra un nuevo inversionista en el sistema."],
          ["👥", "Lista de Inversionistas", "Consulta, edita o elimina inversionistas registrados."],
          ["📊", "Progreso", "Visualiza el progreso y estadísticas generales."],
          ["📄", "Reportes", "Genera reportes y exporta información."],
        ].map(([icono, titulo, texto]) => (
          <div
            key={titulo}
            className="bg-white p-6 rounded-xl shadow text-center hover:shadow-lg"
          >
            <div className="text-4xl mb-4">{icono}</div>
            <h3 className="font-bold mb-3">{titulo}</h3>
            <p className="text-gray-500 text-sm mb-4">{texto}</p>

            <button
              onClick={() => cambiarMenu(titulo)}
              className="text-blue-600 font-semibold text-sm"
            >
              Ir
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-bold text-xl mb-6">Resumen General</h3>

        <div className="grid grid-cols-4 gap-6">
          <Card titulo="Total inversionistas" valor={total} />

          <Card
            titulo="Monto total invertido"
            valor={`S/ ${montoTotal.toLocaleString("es-PE")}`}
          />

          <Card titulo="En Proceso" valor="45" />
          <Card titulo="Completados" valor="83" />
        </div>
      </div>
    </div>
  )
}

function Formulario({ obtenerInversionistas, cambiarMenu }) {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    dni: "",
    agencia: "",
    canal: "",
    estado_civil: "",
    monto: "",
    estado: "Nuevo",
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const guardarInversionista = async () => {
    const { error } = await supabase.from("inversionistas").insert([form])

    if (error) {
      alert("Error al guardar")
      console.log(error)
    } else {
      alert("Inversionista registrado correctamente")

      setForm({
        nombres: "",
        apellidos: "",
        telefono: "",
        dni: "",
        agencia: "",
        canal: "",
        estado_civil: "",
        monto: "",
        estado: "Nuevo",
      })

      obtenerInversionistas()
      cambiarMenu("Lista de Inversionistas")
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Agregar Inversionista</h2>

      <div className="bg-white rounded-xl shadow p-8">
        <form className="grid grid-cols-2 gap-6">
          <Input name="nombres" label="Nombres" value={form.nombres} onChange={handleChange} />
          <Input name="apellidos" label="Apellidos" value={form.apellidos} onChange={handleChange} />
          <Input name="telefono" label="Teléfono" value={form.telefono} onChange={handleChange} />
          <Input name="dni" label="DNI" value={form.dni} onChange={handleChange} />

          <Select
            name="agencia"
            label="Agencia"
            value={form.agencia}
            onChange={handleChange}
            options={["", "Lima", "Arequipa", "Cusco", "Huancayo"]}
          />

          <Select
            name="canal"
            label="Canal"
            value={form.canal}
            onChange={handleChange}
            options={["", "WhatsApp", "Facebook", "Lead", "Referido", "Cartera"]}
          />

          <Select
            name="estado_civil"
            label="Estado Civil"
            value={form.estado_civil}
            onChange={handleChange}
            options={["", "Soltero", "Casado", "Divorciado"]}
          />

          <Input name="monto" label="Monto" value={form.monto} onChange={handleChange} />

          <div className="col-span-2 flex justify-end gap-4 mt-6">
            <button type="button" className="px-6 py-3 border rounded-lg">
              Cancelar
            </button>

            <button
              type="button"
              onClick={guardarInversionista}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Lista({ inversionistas, setShowDelete, setDeleteId, cambiarMenu }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Lista de Inversionistas</h2>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex gap-4 mb-6">
          <input
            className="border rounded-lg p-3 flex-1"
            placeholder="Buscar por nombre, apellido, DNI o teléfono..."
          />

          <button
            onClick={() => cambiarMenu("Agregar Inversionista")}
            className="bg-blue-600 text-white px-5 rounded-lg"
          >
            + Nuevo
          </button>
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-3">ID</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>DNI</th>
              <th>Teléfono</th>
              <th>Agencia</th>
              <th>Canal</th>
              <th>Estado Civil</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {inversionistas.map((inv) => (
              <tr key={inv.id} className="border-b">
                <td className="py-3">{inv.id}</td>
                <td>{inv.nombres}</td>
                <td>{inv.apellidos}</td>
                <td>{inv.dni}</td>
                <td>{inv.telefono}</td>
                <td>{inv.agencia}</td>
                <td>{inv.canal}</td>
                <td>{inv.estado_civil}</td>
                <td>S/ {Number(inv.monto || 0).toLocaleString("es-PE")}</td>
                <td>{inv.estado}</td>
                <td>
                  <button
                    onClick={() => {
                      setDeleteId(inv.id)
                      setShowDelete(true)
                    }}
                    className="bg-red-100 text-red-600 px-2 py-1 rounded"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}

            {inversionistas.length === 0 && (
              <tr>
                <td colSpan="11" className="text-center py-6 text-gray-400">
                  No hay inversionistas registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Progreso({ montoTotal, total }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Progreso</h2>

        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm">
          Exportar
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-6">
        <MetricCard
          titulo="Monto Total Invertido"
          valor={`S/ ${montoTotal.toLocaleString("es-PE")}`}
          porcentaje="+12.5%"
        />

        <MetricCard titulo="En Proceso" valor="45" porcentaje="+8.3%" />
        <MetricCard titulo="Completados" valor="83" porcentaje="+15.2%" />

        <MetricCard
          titulo="Nuevos Inversionistas"
          valor={total}
          porcentaje="+5.6%"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold mb-6">Monto invertido por Mes</h3>

          <svg viewBox="0 0 600 260" className="w-full h-72">
            <polyline
              fill="none"
              stroke="#2563eb"
              strokeWidth="5"
              points="0,230 50,190 100,210 150,140 200,170 250,160 300,100 350,130 400,70 450,110 500,60 550,55 600,10"
            />
          </svg>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold mb-6">Inversionistas por Canal</h3>

          <div className="flex items-center justify-center gap-10">
            <div
              className="w-56 h-56 rounded-full"
              style={{
                background:
                  "conic-gradient(#2563eb 0deg 126deg, #22c55e 126deg 234deg, #f59e0b 234deg 360deg)",
              }}
            >
              <div className="w-32 h-32 bg-white rounded-full relative top-12 left-12"></div>
            </div>

            <div className="space-y-5 text-sm">
              <p>🔵 Online 45%</p>
              <p>🟢 Referido 31%</p>
              <p>🟠 Agencia 34%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ titulo, valor }) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <p className="text-gray-500 text-sm">{titulo}</p>
      <h2 className="text-2xl font-bold mt-2">{valor}</h2>
    </div>
  )
}

function MetricCard({ titulo, valor, porcentaje }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-gray-500 text-sm mb-3">{titulo}</p>
      <h2 className="text-2xl font-bold">{valor}</h2>
      <p className="text-green-600 text-sm mt-3">{porcentaje}</p>
      <p className="text-gray-400 text-xs">vs mes anterior</p>
    </div>
  )
}

function Input({ name, label, value, onChange }) {
  return (
    <div>
      <label className="font-semibold text-sm">{label}</label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-2 border rounded-lg p-3"
        placeholder={`Ingrese ${label}`}
      />
    </div>
  )
}

function Select({ name, label, value, onChange, options }) {
  return (
    <div>
      <label className="font-semibold text-sm">{label}</label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-2 border rounded-lg p-3"
      >
        {options.map((op) => (
          <option key={op} value={op}>
            {op === "" ? `Seleccione ${label.toLowerCase()}` : op}
          </option>
        ))}
      </select>
    </div>
  )
}