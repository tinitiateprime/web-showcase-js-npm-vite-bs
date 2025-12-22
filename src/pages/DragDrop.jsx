import React, { useState } from "react";
import Draggable from "react-draggable";
import { v4 as uuidv4 } from "uuid";
import "bootstrap/dist/css/bootstrap.min.css";

const DragAndDropPage = () => {
  const [shapes, setShapes] = useState([]);

  const handleAddShape = (type) => {
    const newShape = {
      id: uuidv4(),
      type,
      x: 50,
      y: 50,
    };
    setShapes((prev) => [...prev, newShape]);
  };

  return (
    <div className="container-fluid mt-3">
      <h2 className="text-center mb-4">🧩 Drag & Drop Page (draw.io style)</h2>
      <div className="row">
        {/* Toolbox */}
        <div className="col-md-3">
          <div className="p-3 border bg-light rounded">
            <h5>🛠️ Toolbox</h5>
            <button
              className="btn btn-outline-primary w-100 mb-2"
              onClick={() => handleAddShape("rectangle")}
            >
              ➕ Add Rectangle
            </button>
            <button
              className="btn btn-outline-success w-100"
              onClick={() => handleAddShape("circle")}
            >
              ➕ Add Circle
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="col-md-9">
          <div
            className="border bg-white position-relative"
            style={{ height: "80vh", width: "100%", overflow: "hidden" }}
          >
            {shapes.map((shape) => (
              <Draggable key={shape.id} defaultPosition={{ x: shape.x, y: shape.y }}>
                <div
                  className={`position-absolute d-flex align-items-center justify-content-center text-white ${
                    shape.type === "rectangle" ? "bg-primary" : "bg-success"
                  }`}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: shape.type === "circle" ? "50%" : "0",
                    cursor: "move",
                    fontWeight: "bold",
                  }}
                >
                  {shape.type}
                </div>
              </Draggable>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragAndDropPage;
