"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, Download, Trash, RefreshCw } from "lucide-react"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, push, set } from "firebase/database"
import { getAuth, signInAnonymously } from "firebase/auth"
import html2canvas from "html2canvas"

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA-MkzGejmrQ-Ak66aiqNIyvBp-Xm8DKec",
  authDomain: "kisya-74ac7.firebaseapp.com",
  projectId: "kisya-74ac7",
  storageBucket: "kisya-74ac7.firebasestorage.app",
  messagingSenderId: "632807406142",
  appId: "1:632807406142:web:bac02be726397de8736f6f",
  measurementId: "G-7LQEG4XPRJ",
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const auth = getAuth(app)

export default function PhotoBooth() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const instaxFrameRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [capturedImages, setCapturedImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState(null)
  const [activeFilter, setActiveFilter] = useState("none")
  const [showInstaxFrame, setShowInstaxFrame] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)

  const MAX_PHOTOS = 3

  const filters = [
    { id: "none", name: "Normal" },
    { id: "grayscale", name: "Grayscale" },
    { id: "sepia", name: "Sepia" },
    { id: "invert", name: "Invert" },
    { id: "hearts", name: "Hearts" },
  ]

  // Sign in anonymously to Firebase (no image loading)
  useEffect(() => {
    signInAnonymously(auth)
      .then((result) => {
        setUserId(result.user.uid)
      })
      .catch((error) => {
        console.error("Error signing in anonymously:", error)
      })
  }, [])

  // Start camera
  const startCamera = async () => {
    setIsLoading(true)
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("Could not access camera. Please make sure you've granted permission.")
    }
    setIsLoading(false)
  }

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      setStream(null)
    }
  }

  // Capture image and save to Firebase
  const captureImage = async () => {
    if (isCapturing || !videoRef.current || !canvasRef.current || !userId) return
    if (capturedImages.length >= MAX_PHOTOS) return

    setIsCapturing(true)

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      // Wait for video to be ready if needed
      if (video.readyState !== 4) {
        await new Promise(resolve => {
          const onCanPlay = () => {
            video.removeEventListener('canplay', onCanPlay)
            resolve()
          }
          video.addEventListener('canplay', onCanPlay)
        })
      }

      // Set canvas dimensions
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // Draw video frame
      const context = canvas.getContext('2d')
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Apply filter if needed
      if (activeFilter !== "none" && activeFilter !== "hearts") {
        context.save()
        context.filter = getFilterStyle(activeFilter)
        context.drawImage(canvas, 0, 0)
        context.restore()
      }

      // Add hearts if selected
      if (activeFilter === "hearts") {
        addHearts(context, canvas.width, canvas.height)
      }

      // Create and save image
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
      const newImageRef = push(ref(database, `images/${userId}`))
      const newImage = {
        dataUrl,
        timestamp: new Date().toISOString(),
        filter: activeFilter
      }

      await set(newImageRef, newImage)
      
      // Update local state only
      setCapturedImages(prev => {
        const updated = [{ id: newImageRef.key, ...newImage }, ...prev]
        return updated.slice(0, MAX_PHOTOS)
      })

      // Show instax frame if we reached max photos
      if (capturedImages.length + 1 >= MAX_PHOTOS) {
        setShowInstaxFrame(true)
      }

    } catch (error) {
      console.error("Capture error:", error)
      alert("Failed to capture photo. Please try again.")
    } finally {
      setIsCapturing(false)
    }
  }

  // Reset current session (doesn't affect Firebase)
  const resetPhotos = () => {
    if (capturedImages.length === 0) return

    const confirmReset = window.confirm("Are you sure you want to clear the current session?")
    if (!confirmReset) return

    setCapturedImages([])
    setShowInstaxFrame(false)
  }

  // Get CSS filter style
  const getFilterStyle = (filter) => {
    switch (filter) {
      case "grayscale": return "grayscale(100%)"
      case "sepia": return "sepia(100%)"
      case "invert": return "invert(80%)"
      default: return "none"
    }
  }

  // Add hearts to canvas
  const addHearts = (context, width, height) => {
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = 10 + Math.random() * 30
      context.font = `${size}px Arial`
      context.fillStyle = "rgba(255, 0, 100, 0.7)"
      context.fillText("❤️", x, y)
    }
  }

  // Download individual image
  const downloadImage = (dataUrl, index) => {
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = `valentine-photo-${index + 1}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Download Instax frame with improved reliability
  const downloadInstaxFrame = async () => {
    if (!instaxFrameRef.current || capturedImages.length < MAX_PHOTOS) {
      alert("Please take 3 photos first to create a photo strip")
      return
    }

    try {
      // Add loading state
      setIsLoading(true)
      
      // Ensure all images are loaded
      await Promise.all(
        capturedImages.slice(0, MAX_PHOTOS).map(img => 
          new Promise((resolve) => {
            const image = new Image()
            image.onload = resolve
            image.src = img.dataUrl
          })
        )
      )

      // Capture the frame
      const canvas = await html2canvas(instaxFrameRef.current, {
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      })

      // Create download link
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `valentine-photo-strip-${new Date().toISOString().slice(0, 10)}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

    } catch (error) {
      console.error("Error generating Instax frame:", error)
      alert("Failed to generate photo strip. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <h2 className="text-2xl font-bold text-pink-600 mb-8">Photo Booth</h2>

      {/* Photo counter */}
      <div className="w-full max-w-3xl mx-auto mb-4 flex justify-between items-center">
        <div className="text-pink-600 font-medium">
          Photos: {capturedImages.length}/{MAX_PHOTOS}
        </div>
        {capturedImages.length > 0 && (
          <button
            onClick={resetPhotos}
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none h-9 px-3 border border-pink-300 bg-white hover:bg-pink-50 text-pink-600 gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset All
          </button>
        )}
      </div>

      {/* Instax Frame */}
      {showInstaxFrame && capturedImages.length >= MAX_PHOTOS && (
        <div className="w-full max-w-md mx-auto mb-8">
          <div ref={instaxFrameRef} className="bg-white p-4 rounded-lg shadow-lg border-8 border-pink-100">
            <div className="bg-pink-50 p-3 rounded-md mb-3">
              <h3 className="text-center text-pink-600 font-bold mb-2">Valentine's Photo Strip</h3>
              <div className="grid gap-3">
                {capturedImages.slice(0, MAX_PHOTOS).map((image, index) => (
                  <div key={image.id} className="relative">
                    <div className="bg-white p-2 rounded shadow-sm">
                      <img
                        src={image.dataUrl}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-auto rounded"
                        crossOrigin="anonymous"
                      />
                      <p className="text-xs text-center text-pink-500 mt-1">
                        {new Date(image.timestamp).toLocaleDateString()} •{" "}
                        {image.filter !== "none" ? image.filter : "normal"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-3 text-pink-600 text-sm">
                <p>Happy Valentine's & Birthday!</p>
                <p className="text-xs">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={downloadInstaxFrame}
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4 bg-pink-600 text-white hover:bg-pink-700 gap-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Preparing Download...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Photo Strip
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl mx-auto mb-8 rounded-lg border bg-white shadow-sm">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Camera Section */}
            <div className="flex-1">
              <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${
                    activeFilter !== "none" && activeFilter !== "hearts" ? `filter-${activeFilter}` : ""
                  }`}
                />

                {!stream && (
                  <button
                    onClick={startCamera}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4 bg-pink-600 text-white hover:bg-pink-700"
                  >
                    {isLoading ? "Starting Camera..." : "Start Camera"}
                  </button>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </div>

              {stream && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none h-9 px-3 ${
                        activeFilter === filter.id
                          ? "bg-pink-600 text-white"
                          : "border border-pink-300 bg-white hover:bg-pink-50 text-pink-600"
                      }`}
                      onClick={() => setActiveFilter(filter.id)}
                    >
                      {filter.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-4 flex justify-between">
                {stream && (
                  <>
                    <button
                      onClick={captureImage}
                      disabled={isCapturing || capturedImages.length >= MAX_PHOTOS}
                      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4 bg-pink-600 text-white hover:bg-pink-700 gap-2 ${
                        isCapturing ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      <Camera className="h-4 w-4" />
                      {isCapturing ? "Capturing..." : 
                       capturedImages.length >= MAX_PHOTOS ? "Max Photos Reached" : "Take Photo"}
                    </button>
                    <button
                      onClick={stopCamera}
                      className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4 border border-pink-300 bg-white hover:bg-pink-50 text-pink-600"
                    >
                      Stop Camera
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Photos Section */}
            <div className="flex-1">
              <div>
                <h3 className="text-lg font-medium text-pink-600 mb-2">Your Photos</h3>
                {capturedImages.length === 0 ? (
                  <div className="bg-pink-50 rounded-lg p-4 text-center">
                    <p className="text-pink-600">Take 3 photos to create your Valentine's photo strip!</p>
                    <p className="text-gray-500 text-sm mt-2">Photos are automatically saved when you take them.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto p-2">
                    {capturedImages.map((image, index) => (
                      <div key={image.id} className="relative group bg-pink-50 p-2 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 flex-shrink-0 bg-white rounded overflow-hidden">
                            <img
                              src={image.dataUrl}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover"
                              crossOrigin="anonymous"
                            />
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-medium text-pink-600">Photo {index + 1}</p>
                            <p className="text-xs text-gray-500">{new Date(image.timestamp).toLocaleString()}</p>
                            <p className="text-xs text-gray-500">
                              Filter: {image.filter !== "none" ? image.filter : "normal"}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              className="h-8 w-8 rounded-md inline-flex items-center justify-center text-pink-600 hover:bg-pink-100"
                              onClick={() => downloadImage(image.dataUrl, index)}
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {capturedImages.length > 0 && capturedImages.length < MAX_PHOTOS && (
                  <div className="mt-4 text-center text-pink-600 text-sm">
                    Take {MAX_PHOTOS - capturedImages.length} more photo
                    {MAX_PHOTOS - capturedImages.length > 1 ? "s" : ""} to complete your photo strip!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}