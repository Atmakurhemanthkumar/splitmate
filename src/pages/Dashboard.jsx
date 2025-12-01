import React, { useState, useEffect } from "react";
import "../components/dashboard/Dashboard.css";
import { useNavigate } from "react-router-dom";
import { authAPI, groupAPI, expenseAPI } from "/src/services/api";
import ExpenseModal from "../components/expense/ExpenseModal";
import PaymentProofModal from "../components/payment/PaymentProofModal";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [group, setGroup] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  // Add these states to your Dashboard component
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch user data
        const userResponse = await authAPI.getMe();
        setUser(userResponse.user);

        // Fetch group data
        const groupResponse = await groupAPI.getMyGroup();
        setGroup(groupResponse.group);

        // Fetch expenses
        const expensesResponse = await expenseAPI.getExpenses();
        setExpenses(expensesResponse.expenses || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // If no group, redirect to role selection
        if (error.message.includes("not in any group")) {
          navigate("/role-selection");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleCopyCode = () => {
    if (group?.code) {
      navigator.clipboard.writeText(group.code).then(() => {
        alert("Group code copied to clipboard!");
      });
    }
  };

  const handleStatusToggle = async (expenseId, memberId, newStatus) => {
    try {
      // Update payment status in backend
      await expenseAPI.updatePaymentStatus(expenseId, "");

      // Update local state optimistically
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense._id === expenseId
            ? {
                ...expense,
                members: expense.members.map((member) =>
                  member.userId._id === user.id
                    ? {
                        ...member,
                        status: newStatus,
                        paidAt:
                          newStatus === "paid"
                            ? new Date().toISOString()
                            : null,
                      }
                    : member
                ),
              }
            : expense
        )
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status. Please try again.");
    }
  };

  // ADD THIS MISSING FUNCTION
  const handleViewProfile = () => {
    navigate("/profile");
  };

  const handleSettings = () => {
    alert("Settings feature coming soon!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const getPaidCount = (expenseMembers) => {
    return expenseMembers.filter((member) => member.status === "paid").length;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const handlePaymentProofUpload = async (proofUrl) => {
    try {
      // Update payment status with proof
      await expenseAPI.updatePaymentStatus(selectedExpense._id, proofUrl);

      // Update local state
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense._id === selectedExpense._id
            ? {
                ...expense,
                members: expense.members.map((member) =>
                  member.userId._id === user?.id
                    ? {
                        ...member,
                        status: "paid",
                        paidAt: new Date().toISOString(),
                        paymentProof: proofUrl,
                      }
                    : member
                ),
              }
            : expense
        )
      );

      // Close modals
      setIsPaymentModalOpen(false);
      setSelectedExpense(null);
      setSelectedMember(null);
    } catch (error) {
      console.error("Error updating payment with proof:", error);
      alert("Failed to update payment status");
    }
  };
  const handleThumbsUpClick = (expense, member) => {
    // If payment proof exists, just mark as paid
    if (member.paymentProof) {
      handleStatusToggle(expense._id, member.userId._id, "paid");
    } else {
      // Open payment proof modal
      setSelectedExpense(expense);
      setSelectedMember(member);
      setIsPaymentModalOpen(true);
    }
  };

  const handleViewProof = (proofUrl) => {
    window.open(proofUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="dashboard-standalone">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="dashboard-standalone">
        <div className="error-container">
          <h2>No Group Found</h2>
          <p>You need to join a group first.</p>
          <button onClick={() => navigate("/role-selection")}>
            Go to Role Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-standalone">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          {/* Mobile menu button */}
          <div
            className="mobile-menu-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </div>
          <div className="logo">
            <span>🏠</span>
            <span>SplitMate</span>
          </div>
          <div className="group-code-display">
            <span>Group:</span>
            <span className="code">{group.code}</span>
            <span className="copy-icon" onClick={handleCopyCode}>
              📋
            </span>
          </div>
        </div>
        <div className="navbar-right">
          {/* Settings Icon */}
          <div className="nav-icon" onClick={handleSettings} title="Settings">
            ⚙️
          </div>

          {/* User Profile Section */}
          <div className="user-profile-dropdown">
            <div className="profile-trigger">
              <div className="profile-circle">
                {user?.avatar || "👤"}
                <div className="online-indicator"></div>
              </div>
              <span className="user-name">{user?.name}</span>
            </div>
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={handleViewProfile}>
                👤 View Profile
              </div>
              <div className="dropdown-item" onClick={handleSettings}>
                ⚙️ Settings
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item logout-item" onClick={handleLogout}>
                🚪 Logout
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "mobile-open" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="main-container">
        {/* Left Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? "mobile-open" : ""}`}>
          <div className="sidebar-section">
            <div className="group-code-pill">
              <div className="code">{group.code}</div>
            </div>
            <div className="members-count">
              Members: {group.members?.length || 1}/{group.maxMembers || 5}
            </div>
          </div>

          {/* Member Cards */}
          {group.members?.map((member) => (
            <div
              key={member.userId._id}
              className={`member-card ${
                member.userId._id === user?.id ? "current-user" : ""
              }`}
            >
              <div className="member-avatar">
                {member.userId.avatar || "👤"}
              </div>
              <div className="member-name">{member.userId.name}</div>
              {member.userId._id === group.representativeId && (
                <div style={{ textAlign: "center" }}>
                  <span className="member-badge">👑 Representative</span>
                </div>
              )}
              <div className="member-info">
                📱 {member.userId.phone || "No phone"}
              </div>
              <div className="member-desc">
                {member.userId.description || "No description"}
              </div>
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main className="content-area">
          <div className="content-header">
            <h2>Expenses</h2>
            {user?.role === "representative" && (
              <button
                className="add-expense-btn"
                onClick={() => setIsExpenseModalOpen(true)}
              >
                <span>➕</span>
                <span>Add Expense</span>
              </button>
            )}
          </div>

          {/* Expense Cards */}
          {expenses.length === 0 ? (
            <div className="no-expenses">
              <div className="no-expenses-icon">💸</div>
              <h3>No Expenses Yet</h3>
              <p>When expenses are created, they will appear here.</p>
              {user?.role === "representative" && (
                <button
                  className="add-expense-btn"
                  onClick={() => setIsExpenseModalOpen(true)}
                >
                  Create Your First Expense
                </button>
              )}
            </div>
          ) : (
            expenses.map((expense) => (
              <div key={expense._id} className="expense-card">
                <div className="expense-header">
                  <div className="expense-title-section">
                    <span className="expense-icon">
                      {expense.title.includes("Rent")
                        ? "🏠"
                        : expense.title.includes("Grocer")
                        ? "🛒"
                        : expense.title.includes("Food")
                        ? "🍕"
                        : expense.title.includes("Utility")
                        ? "⚡"
                        : "💰"}
                    </span>
                    <div>
                      <div className="expense-title">{expense.title}</div>
                      {expense.description && (
                        <div className="expense-description">
                          {expense.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="expense-amount">
                    <div className="total">
                      ₹{expense.totalAmount.toLocaleString()}
                    </div>
                    <div className="expense-date">
                      📅 {formatDate(expense.date)}
                    </div>
                  </div>
                </div>

                <div className="split-info">
                  Split Between {expense.members.length} Members — Each owes:{" "}
                  <strong>
                    ₹{expense.members[0]?.amount.toLocaleString()}
                  </strong>
                </div>

                {/* Member Rows */}
                {expense.members.map((member) => (
                  <div key={member.userId._id}>
                    <div
                      className={`member-row ${
                        member.userId._id === user?.id ? "current-user" : ""
                      }`}
                    >
                      <div className="member-row-left">
                        <div className="member-row-avatar">
                          {member.userId.avatar || "👤"}
                        </div>
                        <div>
                          <div className="member-row-name">
                            {member.userId.name}
                            {member.userId._id === user?.id && (
                              <span className="you-label">(You)</span>
                            )}
                            {member.userId._id === group.representativeId && (
                              <span className="role-label">👑</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="member-row-right">
                        <div className="amount-badge">
                          ₹{member.amount.toLocaleString()}
                        </div>
                        <div className="status-icons">
                          <div
                            className={`status-icon thumbs-up ${
                              member.status === "paid" ? "active" : ""
                            } ${
                              member.userId._id !== user?.id ? "disabled" : ""
                            }`}
                            onClick={() =>
                              member.userId._id === user?.id &&
                              handleThumbsUpClick(expense, member)
                            }
                            title={
                              member.paymentProof
                                ? "View Payment Proof"
                                : "Mark as Paid"
                            }
                          >
                            {member.paymentProof ? "📸" : "👍"}
                          </div>
                          <div
                            className={`status-icon thumbs-down ${
                              member.status === "pending" &&
                              member.userId._id === user?.id
                                ? ""
                                : "disabled"
                            }`}
                            onClick={() =>
                              member.userId._id === user?.id &&
                              handleStatusToggle(
                                expense._id,
                                member.userId._id,
                                "pending"
                              )
                            }
                          >
                            👎
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`status-text ${member.status === 'paid' ? 'paid' : 'pending'}`}>
  {member.status === 'paid' ? (
    <>
      ✅ Paid 
      {member.paidAt ? ` • ${formatDate(member.paidAt)}` : ''}
      {member.paymentProof && (
        <span 
          className="view-proof-link" 
          onClick={() => handleViewProof(member.paymentProof)}
          title="View Payment Proof"
        >
          • 📸 View Proof
        </span>
      )}
    </>
  ) : (
    '⏳ Pending'
  )}
</div>
                  </div>
                ))}

                <div className="expense-footer">
                  <div className="status-summary">
                    Status:{" "}
                    <span>
                      {getPaidCount(expense.members)}/{expense.members.length}{" "}
                      Paid
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onExpenseCreated={(newExpense) => {
          setExpenses((prev) => [newExpense, ...prev]);
        }}
        groupMembers={group?.members || []}
      />
      <PaymentProofModal
  isOpen={isPaymentModalOpen}
  onClose={() => {
    setIsPaymentModalOpen(false);
    setSelectedExpense(null);
    setSelectedMember(null);
  }}
  onProofUpload={handlePaymentProofUpload}
  expense={selectedExpense}
  currentUser={user}
/>
    </div>
  );
};

export default Dashboard;
