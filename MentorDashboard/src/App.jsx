import { useState } from 'react'
import Header from "./components/Header";
import Sidebar from './components/Sidebar';   

function App() {


  return (
    <>
        <div className="min-h-screen w-full bg-[#F4F4F4]">
      <Header />
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar />
        <main className="flex-1 bg-white p-6">
        <div >
          <h1>
            Welcome
          </h1>
        </div>
        </main>
      </div>
    </div>

    </>
  )
}

export default App
