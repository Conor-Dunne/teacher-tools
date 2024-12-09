"use client";
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false }
);

export default function Roulette() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState("1");
  const [inputValue, setInputValue] = useState(4);
  const [displayedValue, setDisplayedValue] = useState(4);
  const [confetti, setConfetti] = useState(false);
  const [result, setResult] = useState(null);
  const [data, setData] = useState(generateOptions(4));

  const drumRoll = useRef(null);
  const cymbal = useRef(null);

  const modalRef = useRef(null);

  useEffect(() => {
    // Initialize data when displayedValue changes
    setData(generateOptions(displayedValue));
  }, [displayedValue]);

  useEffect(() => {
    // Ensure Audio is initialized only on the client side
    if (typeof window !== "undefined") {
      drumRoll.current = new Audio("/sounds/drum-roll.mp3");
      drumRoll.current.loop = true;
      cymbal.current = new Audio("/sounds/cymbal.mp3");
    }
  }, []);

  useEffect(() => {
    if (confetti) {
      const timer = setTimeout(() => setConfetti(false), 3000); // 4 seconds
      return () => clearTimeout(timer); // Clean up timer on component unmount or when confetti state changes
    }
  }, [confetti]);

  const playDrumRoll = () => {
    drumRoll.current?.play();
  };

  const stopDrumRoll = () => {
    drumRoll.current?.pause();
  };

  const playCymbal = () => {
    cymbal.current?.play();
  };

  const handleSpinClick = (data) => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
      playDrumRoll();
    }
  };

  function generateOptions(max) {
    return Array.from({ length: max }, (_, i) => ({ option: String(i + 1) }));
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue < 1 || inputValue > 100) {
      alert("Must be between 1 to 100");
      return;
    }
    setDisplayedValue(inputValue);
    setInputValue("");
  };

  const handleRemoveOption = () => {
    if (data.length > 1) {
      const updatedData = data.filter((_, index) => index !== prizeNumber);
      setData(updatedData);
      setResult(null);
      modalRef.current?.close();
    } else {
      alert("Cannot remove the last option!");
    }
  };

  return (
    <div className="flex flex-col items-center py-4">
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter a number"
            className=" p-2 border border-black rounded-md"
          />
          <button
            type="submit"
            className="btn bg-blue-700 p-2 rounded-md text-white"
          >
            Submit
          </button>
        </form>
        <p className=" text-center">Max: 100</p>
      </div>
      <div className=" relative">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          spinDuration={1}
          outerBorderWidth={0}
          innerBorderWidth={0}
          innerRadius={0}
          textDistance={90}
          fontSize={25}
          radiusLineWidth={1}
          onStopSpinning={() => {
            setMustSpin(false);
            stopDrumRoll();
            setResult(data[prizeNumber]?.option);
            modalRef.current?.showModal();
            playCymbal();
            setConfetti(true);
          }}
        />
        <button
          onClick={() => handleSpinClick(data)}
          className=" bg-green-700 border border-white shadow-2xl text-white rounded-full absolute top-[50%] left-[50%] z-10 transform -translate-x-1/2 -translate-y-1/2 w-1/5 h-1/5"
        >
          SPIN
        </button>
      </div>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      {/* <button className="btn" onClick={()=>document.getElementById('my_modal_3').showModal()}>open modal</button> */}
      <dialog ref={modalRef} id="my_modal_3" className="modal">
        <div className="modal-box flex flex-col items-center justify-center h-3/5">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              onClick={() => setConfetti(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <h1 className="font-bold text-7xl">{result}</h1>
          <button
            onClick={handleRemoveOption}
            className="btn bg-red-500 text-white"
          >
            Remove Choice?
          </button>
        </div>
        {confetti && <Fireworks autorun={{ speed: 3 }} />}
      </dialog>
    </div>
  );
}
