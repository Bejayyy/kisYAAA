"use client"

import { useState } from "react"
import { Heart, Camera, Gift } from "lucide-react"
import Envelope from "./components/Envelope"
import PhotoBooth from "./components/PhotoBooth"
import Coupon from "./components/Coupon"
import "./App.css"

function App() {
  const [activeSection, setActiveSection] = useState("envelope")

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-red-50">
      <header className="py-6 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-2 animate-fade-in">
          Happy Valentine's & Birthday!
        </h1>
        <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-2 animate-fade-in">
          KISYAAAAAAAAAAAAA 
        </h1>
        <p className="text-lg text-pink-500 italic animate-fade-in-delay">A special gift just for you</p>
        <div className="flex justify-center mt-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Heart
                key={i}
                className="h-6 w-6 text-pink-500 mx-1 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
        </div>
      </header>

      <nav className="flex justify-center gap-4 mb-8 px-4">
        <button
          className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4 gap-2 ${
            activeSection === "envelope"
              ? "bg-pink-600 text-white hover:bg-pink-700"
              : "border border-pink-300 bg-white hover:bg-pink-50 text-pink-600"
          }`}
          onClick={() => setActiveSection("envelope")}
        >
          <Heart size={16} />
          Message
        </button>
        <button
          className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4 gap-2 ${
            activeSection === "photobooth"
              ? "bg-pink-600 text-white hover:bg-pink-700"
              : "border border-pink-300 bg-white hover:bg-pink-50 text-pink-600"
          }`}
          onClick={() => setActiveSection("photobooth")}
        >
          <Camera size={16} />
          Photo Booth
        </button>
        <button
          className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4 gap-2 ${
            activeSection === "coupon"
              ? "bg-pink-600 text-white hover:bg-pink-700"
              : "border border-pink-300 bg-white hover:bg-pink-50 text-pink-600"
          }`}
          onClick={() => setActiveSection("coupon")}
        >
          <Gift size={16} />
          Coupon
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pb-20">
        {activeSection === "envelope" && <Envelope />}
        {activeSection === "photobooth" && <PhotoBooth />}
        {activeSection === "coupon" && <Coupon />}
      </main>

      <footer className="text-center py-6 text-pink-400 text-sm">
        <p>Made with ❤️ just for you</p>
      </footer>
    </div>
  )
}

export default App

