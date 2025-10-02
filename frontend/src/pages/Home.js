import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIUrl, handleError, handleSuccess } from "../utils";
import { ToastContainer, toast } from "react-toastify";
import ExpenseTable from "./ExpenseTable";
import ExpenseForm from "./ExpenseForm";
import "./Home.css";

function Home() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [salary, setSalary] = useState(
    localStorage.getItem("salary") ? parseInt(localStorage.getItem("salary")) : null
  );
  const [remaining, setRemaining] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
    const savedSalary = localStorage.getItem("salary");
    if (!savedSalary) {
      navigate("/salary");
    } else {
      setSalary(Number(savedSalary));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("salary");
    handleSuccess("User Logged out");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const url = `${APIUrl}/expenses`;
      const headers = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      const response = await fetch(url, headers);
      if (response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      const result = await response.json();
      setExpenses(result.data || []);
    } catch (err) {
      handleError(err);
    }
  };

  // Delete expense
  const deleteExpens = async (id) => {
    try {
      const url = `${APIUrl}/expenses/${id}`;
      const headers = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        method: "DELETE",
      };
      const response = await fetch(url, headers);
      if (response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      const result = await response.json();
      handleSuccess(result?.message);
      setExpenses(result.data);
    } catch (err) {
      handleError(err);
    }
  };

  // Update remaining balance
  useEffect(() => {
    if (salary !== null) {
      const totalSpent = expenses.reduce(
        (acc, item) => acc + Math.abs(item.amount),
        0
      );
      setRemaining(salary - totalSpent);
    }
  }, [expenses, salary]);

  // Add expense
  const addTransaction = async (data) => {
    if (salary !== null && remaining <= 0) {
      toast.error("😢 You have used your all salary!");
      return;
    }

    const expenseData = {
      ...data,
      amount: -Math.abs(data.amount),
    };

    try {
      const url = `${APIUrl}/expenses`;
      const headers = {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(expenseData),
      };
      const response = await fetch(url, headers);
      if (response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      const result = await response.json();
      handleSuccess(result?.message);
      setExpenses(result.data);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="home-container">
      <div className="tracker-box">
        <div className="user-section">
          <h1>Welcome {loggedInUser}</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>

        {salary !== null && (
          <>
            <h2>Your Salary is ₹{salary}</h2>
            <h3 style={{ color: remaining > 0 ? "lime" : "red" }}>
              Remaining Balance: ₹{remaining}
            </h3>
            {remaining <= 0 && (
              <p style={{ color: "red", fontWeight: "bold" }}>
                😢 You have used your all salary!
              </p>
            )}
          </>
        )}

        <ExpenseForm addTransaction={addTransaction} />
        <ExpenseTable expenses={expenses} deleteExpens={deleteExpens} />
        <ToastContainer />
      </div>
    </div>
  );
}

export default Home;
