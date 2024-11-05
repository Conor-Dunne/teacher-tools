"use client"

import { jsPDF } from 'jspdf';
import React, { useState, useRef, useEffect } from 'react';
import { Eraser, Pencil, Undo2, Redo2, RefreshCw, Type, } from 'lucide-react';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState('pen');
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [textBoxes, setTextBoxes] = useState([]);
  // const [isAddingText, setIsAddingText] = useState(false);
  const [selectedTextBox, setSelectedTextBox] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');
    const newHistory = history.slice(0, historyStep + 1);
    setHistory([...newHistory, { imageData, textBoxes: [...textBoxes] }]);
    setHistoryStep(newHistory.length);
  };

  const startDrawing = (e) => {
    if (tool === 'text') {
      handleTextClick(e);
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
    
    context.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    context.lineWidth = tool === 'eraser' ? 20 : 2;
    context.lineCap = 'round';
  };

  const draw = (e) => {
    if (!isDrawing || tool === 'text') return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const handleTextClick = (e) => {
    if (tool !== 'text') return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newTextBox = {
      id: Date.now(),
      x,
      y,
      text: '',
      color,
      fontSize,
      isDragging: false,
    };

    setTextBoxes([...textBoxes, newTextBox]);
    setSelectedTextBox(newTextBox.id);
    setIsAddingText(true);
  };

  const handleTextChange = (id, newText) => {
    setTextBoxes(textBoxes.map(box => 
      box.id === id ? { ...box, text: newText } : box
    ));
  };

  const handleTextDragStart = (e, id) => {
    setTextBoxes(textBoxes.map(box =>
      box.id === id ? { ...box, isDragging: true } : box
    ));
  };

  const handleTextDrag = (e, id) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTextBoxes(textBoxes.map(box =>
      box.id === id ? { ...box, x, y } : box
    ));
  };

  const handleTextDragEnd = (id) => {
    setTextBoxes(textBoxes.map(box =>
      box.id === id ? { ...box, isDragging: false } : box
    ));
    saveState();
  };

  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const newStep = historyStep - 1;
      const previousState = history[newStep];
      
      const img = new Image();
      img.src = previousState.imageData;
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
        setTextBoxes(previousState.textBoxes);
        setHistoryStep(newStep);
      };
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const newStep = historyStep + 1;
      const nextState = history[newStep];
      
      const img = new Image();
      img.src = nextState.imageData;
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
        setTextBoxes(nextState.textBoxes);
        setHistoryStep(newStep);
      };
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    setTextBoxes([]);
    saveState();
  };

  const exportCanvas = (format) => {
    const canvas = canvasRef.current;
    // const context = canvas.getContext('2d');
    
    // Create a temporary canvas to include text boxes
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempContext = tempCanvas.getContext('2d');
    
    // Draw the main canvas content
    tempContext.drawImage(canvas, 0, 0);
    
    // Draw all text boxes
    textBoxes.forEach(box => {
      tempContext.font = `${box.fontSize}px Arial`;
      tempContext.fillStyle = box.color;
      tempContext.fillText(box.text, box.x, box.y);
    });

    // Export based on format
    let dataUrl;
    switch (format) {
      case 'png':
        dataUrl = tempCanvas.toDataURL('image/png');
        break;
      case 'jpg':
        dataUrl = tempCanvas.toDataURL('image/jpeg', 0.8);
        break;
      case 'pdf':
        // Create PDF using canvas content
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(tempCanvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, canvas.width, canvas.height);
        pdf.save('whiteboard.pdf');
        return;
    }

    // Create download link
    const link = document.createElement('a');
    link.download = `whiteboard.${format}`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4 p-2 bg-gray-100 rounded-lg">
        <button
          className={`p-2 rounded ${tool === 'pen' ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
          onClick={() => setTool('pen')}
        >
          <Pencil className="w-6 h-6" />
        </button>
        <button
          className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
          onClick={() => setTool('eraser')}
        >
          <Eraser className="w-6 h-6" />
        </button>
        <button
          className={`p-2 rounded ${tool === 'text' ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
          onClick={() => setTool('text')}
        >
          <Type className="w-6 h-6" />
        </button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 cursor-pointer"
        />
        <select
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="p-1 rounded border"
        >
          {[12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>
        <button
          className="p-2 rounded hover:bg-gray-200"
          onClick={undo}
        >
          <Undo2 className="w-6 h-6" />
        </button>
        <button
          className="p-2 rounded hover:bg-gray-200"
          onClick={redo}
        >
          <Redo2 className="w-6 h-6" />
        </button>
        <button
          className="p-2 rounded hover:bg-gray-200"
          onClick={clearCanvas}
        >
          <RefreshCw className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => exportCanvas('png')}
          >
            PNG
          </button>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => exportCanvas('jpg')}
          >
            JPG
          </button>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => exportCanvas('pdf')}
          >
            PDF
          </button>
        </div>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border border-gray-300 rounded-lg cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        />
        {textBoxes.map(box => (
          <div
            key={box.id}
            style={{
              position: 'absolute',
              left: box.x,
              top: box.y - 24,
              cursor: 'move',
            }}
            onMouseDown={(e) => handleTextDragStart(e, box.id)}
            onMouseMove={(e) => box.isDragging && handleTextDrag(e, box.id)}
            onMouseUp={() => handleTextDragEnd(box.id)}
          >
            <input
              type="text"
              value={box.text}
              onChange={(e) => handleTextChange(box.id, e.target.value)}
              style={{
                color: box.color,
                fontSize: `${box.fontSize}px`,
                background: 'transparent',
                border: selectedTextBox === box.id ? '1px dashed #000' : 'none',
                padding: '2px',
                minWidth: '100px',
              }}
              onFocus={() => setSelectedTextBox(box.id)}
              onBlur={() => {
                setSelectedTextBox(null);
                saveState();
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Whiteboard;