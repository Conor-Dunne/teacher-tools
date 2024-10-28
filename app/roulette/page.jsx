"use client"
import React, { useState } from 'react'
import { Wheel } from 'react-custom-roulette'

export default function Roulette () {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [inputValue, setInputValue] = useState(4)
  const [displayedValue, setDisplayedValue] = useState(4);

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  }

  function generateOptions(max) {
    return Array.from({ length: max }, (_, i) => ({ option: String(i) }));
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on submit
    if (inputValue < 1 || inputValue > 100) {
        alert("Must be between 1 to 100")
        return
    }
    setDisplayedValue(inputValue); // Update the displayed value with the input
    setInputValue(''); // Clear the input box
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
        spinDuration={0.35}
        outerBorderWidth={1}
        textDistance={90}
        fontSize={15}
        radiusLineWidth={1}

        onStopSpinning={() => {
          setMustSpin(false);
        }}
      />
      <button onClick={handleSpinClick} className=' bg-green-700 text-white p-4 rounded-md'>SPIN</button>
    </div>
  )
}