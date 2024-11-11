"use client"
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic';

const Wheel = dynamic(() => import('react-custom-roulette').then((mod) => mod.Wheel), { ssr: false });

export default function Roulette() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [inputValue, setInputValue] = useState(4)
  const [displayedValue, setDisplayedValue] = useState(4);
  
  const drumRoll = useRef(null);
  const cymbal = useRef(null);

  useEffect(() => {
    // Ensure Audio is initialized only on the client side
    if (typeof window !== "undefined") {
      drumRoll.current = new Audio('/sounds/drum-roll.mp3');
      drumRoll.current.loop = true;
      cymbal.current = new Audio('/sounds/cymbal.mp3');
    }
  }, []);

  const playDrumRoll = () => {
    drumRoll.current?.play();
  };

  const stopDrumRoll = () => {
    drumRoll.current?.pause();
  }

  const playCymbal = () => {
    cymbal.current?.play();
  }

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
      playDrumRoll();
    }
  }

  function generateOptions(max) {
    return Array.from({ length: max }, (_, i) => ({ option: String(i) }));
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue < 1 || inputValue > 100) {
        alert("Must be between 1 to 100")
        return;
    }
    setDisplayedValue(inputValue);
    setInputValue('');
  };
  
  const data = generateOptions(displayedValue);

  return (
    <div className='flex flex-col items-center py-4'>
      <div>
        <form onSubmit={handleSubmit}>
          <input 
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter a number"
            className=' p-2 border border-black rounded-md'
          />
          <button type="submit" className=' bg-blue-700 p-2 rounded-md text-white'>Submit</button>
        </form>
        <p>Max 100</p>
      </div>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        spinDuration={1}
        outerBorderWidth={0}
        innerBorderWidth={0}
        innerRadius={0}
        textDistance={90}
        fontSize={15}
        radiusLineWidth={1}
        onStopSpinning={() => {
          setMustSpin(false);
          stopDrumRoll();
          playCymbal();
        }}
      />
      <button onClick={handleSpinClick} className=' bg-green-700 text-white p-4 rounded-md'>SPIN</button>
    </div>
  )
}
