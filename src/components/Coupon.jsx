"use client"

import { useRef } from "react"
import { Download, Gift, Scissors } from "lucide-react"

export default function Coupon() {
  const couponRef = useRef(null)

  const handleDownload = () => {
    // In a real implementation, you would use html2canvas to capture the div
    // and download it as an image
    alert("In a real implementation, this would download the coupon as an image")
  }

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <h2 className="text-2xl font-bold text-pink-600 mb-8">Your Special Coupon</h2>

      <div className="w-full max-w-md mx-auto mb-10">
        <div
          ref={couponRef}
          className="relative bg-white rounded-lg overflow-hidden border-2 border-dashed border-pink-400 p-1"
        >
          <div className="rounded-lg border bg-gradient-to-r from-pink-100 to-red-50 border-pink-200">
            <div className="p-6">
              <div className="absolute top-0 left-0 w-16 h-16">
                <div className="absolute transform rotate-45 bg-pink-500 text-white text-xs font-bold py-1 left-[-35px] top-[20px] w-[130px] text-center">
                  SPECIAL
                </div>
              </div>

              <div className="text-center mb-2 mt-4">
                <Gift className="h-12 w-12 text-pink-600 mx-auto" />
                <h3 className="text-2xl font-bold text-pink-700 mt-2">SPECIAL COUPON</h3>
              </div>

              <div className="text-center my-6 border-y-2 border-pink-200 py-4">
                <p className="text-pink-800 text-lg font-medium">This coupon entitles you to</p>
                <p className="text-pink-600 text-2xl font-bold my-2">ONE SPECIAL REQUEST</p>
                <p className="text-pink-800 text-sm">Redeem whenever you want - no expiration!</p>
              </div>

              <div className="text-center text-pink-700 text-sm">
                <p>Basta Feasible and dili lisodd</p>
                <p>ambot ug sakto bani nga desisyon na tagaan ka ani pero bahala na HAHAHAHHAHAHA</p>
                <p className="font-bold mt-2">KANAG DALI RA!!</p>
              </div>

            </div>
          </div>

          <div className="absolute top-0 left-0 w-full flex justify-between pointer-events-none">
            <div className="h-4 w-8 bg-white rounded-b-full border-r border-b border-l border-pink-400 border-dashed"></div>
            <div className="h-4 w-8 bg-white rounded-b-full border-r border-b border-l border-pink-400 border-dashed"></div>
          </div>

          <div className="absolute bottom-0 left-0 w-full flex justify-between pointer-events-none">
            <div className="h-4 w-8 bg-white rounded-t-full border-r border-t border-l border-pink-400 border-dashed"></div>
            <div className="h-4 w-8 bg-white rounded-t-full border-r border-t border-l border-pink-400 border-dashed"></div>
          </div>
        </div>

      
        <div className="mt-8 text-center text-pink-600 text-sm">
          <p>This coupon is a promise to do something special for you.</p>
          <p>Save it and redeem whenever you want!</p>
        </div>
      </div>
    </div>
  )
}

