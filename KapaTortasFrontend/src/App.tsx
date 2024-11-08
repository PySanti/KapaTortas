import { useState, useEffect } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const p = async ()=>{
    /*
        email = serializers.EmailField()
    nombre_completo = serializers.CharField()
    password = serializers.CharField()
    rol = serializers.CharField(choices=[(role.value, role.name) for role in RolEnum], default=RolEnum.CLIENTE)
    numero_telefonico = serializers.CharField()
    fecha_nacimiento = serializers.DateField()


    */
   try{
      console.log(await axios.post(" http://127.0.0.1:8000/api/perfiles/consultar", {
        'email' : 'santiagodeandrade4@gmail.com',
      }).data)
   } catch (e){
    console.log(e)
   }

  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={p}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
