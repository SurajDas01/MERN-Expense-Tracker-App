import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AnimatedBg.css";

function SalaryPage() {
  const [salaryInput, setSalaryInput] = useState("");
  const navigate = useNavigate();

  const handleSalarySubmit = (e) => {
    e.preventDefault();
    if (!salaryInput || isNaN(salaryInput) || salaryInput <= 0) {
      alert("Please enter a valid salary amount");
      return;
    }
    localStorage.setItem("salary", salaryInput);
    navigate("/home");
  };

  return (
    <div className="auth-wrapper">
      {/* Animated Background */}
      <div id="bg-wrap">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          {/* put your defs + rect shapes here */}
        </svg>
      </div>

      <div className="auth-box">
        <h1>Enter Salary</h1>
        <form onSubmit={handleSalarySubmit}>
          <input
            type="number"
            placeholder="Enter your salary..."
            value={salaryInput}
            onChange={(e) => setSalaryInput(e.target.value)}
          />
          <button type="submit">Save Salary</button>
        </form>
      </div>
    </div>
  );
}

export default SalaryPage;