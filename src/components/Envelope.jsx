"use client"

import { useState } from "react"

export default function Envelope() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <h2 className="text-2xl font-bold text-pink-600 mb-8">A Special Message For You</h2>

      <div className="relative w-full max-w-md mx-auto mb-10">
        {!isOpen ? (
          <div className="relative">
            <div
              className="bg-pink-200 rounded-lg p-8 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setIsOpen(true)}
            >
              <div className="bg-pink-100 rounded p-4 flex items-center justify-center h-40">
                <p className="text-pink-600 text-lg font-medium text-center">Click to open your special message ❤️</p>
              </div>
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-0 h-0 border-solid border-t-[20px] border-r-[20px] border-t-transparent border-r-pink-300"></div>
                <div className="absolute bottom-0 right-0 w-0 h-0 border-solid border-t-[20px] border-l-[20px] border-t-transparent border-l-pink-300"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-pink-300 rounded-full flex items-center justify-center">
                  <div className="text-white text-2xl">❤️</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-flip-in">
            <div className="rounded-lg border bg-gradient-to-br from-pink-100 to-red-50 border-pink-200 shadow-lg">
              <div className="p-6">
                <div className="text-center mb-4">
                  
                </div>

                <div className="animate-fade-in-delay">
                  <h3 className="text-xl font-bold text-pink-700 mb-4 text-center">Hello KISYAAAAAAAAAAAAAAAAAA,</h3>

                  <p className="text-pink-800 mb-4 leading-relaxed">
                  Tuo nimog wala koy buhaton ig Valentines noooo, joke ra bitaw, anywayss Happy Hearts dayy, pwede ba nako kawaton imo dughan  HAHAHAHHAHA, bitawwww I know you are so busy these past days so no matter unsa may nahitabo you deserve to rest, and also so proud of you hehe, you kknow naman ata ana always, I know naa kay mga struggles or Challenges na imo gi tagoan nga di nimo ganahan i sulti, I just want you to know again n again n again nga raa rako pirme if ever you want someone you can run or talk to, Hapit nasad mahuman bitaw klase kaya rana, and I know you are doing your very99999x best so I am going to do my 999999x too HAHHAHAHAHA, anyways basin ga hilak naka diha ha charot, HAPPY HEART'S DAY KISSHA REY ABELINAAA!!
                  </p>
                  <p className="text-pink-800 mb-4 leading-relaxed">
                    (update) HAPPY BIRTHDAYYYYYYYYYYYYYYYYYYYYYYYYYYY Happy Birthday! I hope you have a great day filled with good moments and enjoy your time with the people around you. Wishing you another year of success, happiness, and good health.
                    -ChatGPT 2025
                  </p>
                  
                  <p className="text-pink-700 font-medium text-right">From KYUT,</p>
                  <p className="text-pink-700 font-bold text-right">Bejay</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4 border border-pink-300 bg-white hover:bg-pink-50 text-pink-600"
                onClick={() => setIsOpen(false)}
              >
                Close Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

