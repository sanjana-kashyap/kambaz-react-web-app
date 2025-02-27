import React from "react";

// Icon for indicating if a post was created by an instructor.
const InstructorIcon: React.FC = () => {
    return (
        <div className="d-flex align-items-center bg-light px-2 py-1 me-1" style={{ gap: "4px" }}>
            <div style={{ width: "10px", height: "10px", backgroundColor: "#E4B229" }}></div>
            <span className="fw-bold text-dark small">Instr</span>
        </div>
    );
};

export default InstructorIcon;
