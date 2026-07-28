
// src/screens/Dashboard/admin/FeesSection.jsx

"use client";

import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Loader2,
  Plus,
  ChevronDown,
  FileText,
  Printer,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Edit,
  Trash2,
  Send,
  RefreshCw
} from 'lucide-react';

// CHANGE: Use environment variable with correct endpoint for admin fees
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export function AdminFeesSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  
  // State for admin fees data
  const [feesData, setFeesData] = useState({
    admins: [],
    summary: {
      totalPayroll: 0,
      totalPaid: 0,
      totalPending: 0,
      totalOverdue: 0,
      paymentRate: 0
    },
    recentTransactions: []
  });

  // Modal states
  const [isAddFeeModalOpen, setIsAddFeeModalOpen] = useState(false);
  const [isAssignStudentFeeModalOpen, setIsAssignStudentFeeModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    adminId: '',
    adminName: '',
    role: 'Administrator',
    salary: '',
    dueDate: '',
    status: 'pending'
  });

  const [studentFeeForm, setStudentFeeForm] = useState({
    recipient: "all",
    studentIdentifier: "",
    amount: "",
    semester: "First Semester",
    activity: "Tuition",
    dueDate: "",
  });

  // Fetch admin fees data from API
  useEffect(() => {
    fetchFeesData();
  }, []);

  const fetchFeesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // CHANGE: Use /admin/fees instead of /fees
      const response = await fetch(`${API_BASE_URL}/admin/fees`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin fees data');
      }

      const data = await response.json();
      setFeesData(data);
    } catch (err) {
      setError(err.message || 'Error loading admin fees data');
      // Set fallback mock data for demonstration
      setFeesData({
        admins: [
          { id: '1', name: 'John Administrator', role: 'Principal', salary: 120000, paid: 120000, status: 'paid', dueDate: '2026-07-30' },
          { id: '2', name: 'Sarah Manager', role: 'Finance Manager', salary: 95000, paid: 47500, status: 'partial', dueDate: '2026-07-15' },
          { id: '3', name: 'Michael Coordinator', role: 'Academic Coordinator', salary: 88000, paid: 0, status: 'overdue', dueDate: '2026-06-30' },
          { id: '4', name: 'Emily Director', role: 'HR Director', salary: 105000, paid: 105000, status: 'paid', dueDate: '2026-07-28' },
          { id: '5', name: 'Robert Officer', role: 'Admissions Officer', salary: 78000, paid: 39000, status: 'partial', dueDate: '2026-08-01' },
        ],
        summary: {
          totalPayroll: 486000,
          totalPaid: 311500,
          totalPending: 174500,
          totalOverdue: 88000,
          paymentRate: 64
        },
        recentTransactions: [
          { id: 'TXN-201', admin: 'John Administrator', amount: 120000, date: '2026-07-30', status: 'completed', method: 'Bank Transfer' },
          { id: 'TXN-202', admin: 'Emily Director', amount: 105000, date: '2026-07-28', status: 'completed', method: 'Bank Transfer' },
          { id: 'TXN-203', admin: 'Sarah Manager', amount: 47500, date: '2026-07-15', status: 'pending', method: 'Cash' },
          { id: 'TXN-204', admin: 'Michael Coordinator', amount: 88000, date: '2026-06-30', status: 'failed', method: 'Bank Transfer' },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle adding new admin fee record
  const handleAddFee = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      // CHANGE: Use /admin/fees instead of /fees
      const response = await fetch(`${API_BASE_URL}/admin/fees`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add admin fee record');
      }

      await fetchFeesData(); // Refresh data
      setIsAddFeeModalOpen(false);
      setFormData({ adminId: '', adminName: '', role: 'Administrator', salary: '', dueDate: '', status: 'pending' });
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignStudentFee = async (event) => {
    event.preventDefault();
    if (studentFeeForm.recipient === "individual" && !studentFeeForm.studentIdentifier.trim()) {
      alert("Enter the student email address or student ID.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_name: studentFeeForm.recipient === "all" ? "All Students" : studentFeeForm.studentIdentifier.trim(),
          student_identifier: studentFeeForm.recipient === "all" ? "all-students" : studentFeeForm.studentIdentifier.trim(),
          recipient: studentFeeForm.recipient,
          amount: studentFeeForm.amount,
          semester: studentFeeForm.semester,
          activity: studentFeeForm.activity,
          due_date: studentFeeForm.dueDate,
          status: "Pending",
          method: "Not paid",
        }),
      });
      if (!response.ok) throw new Error("Unable to assign the fee.");
      setIsAssignStudentFeeModalOpen(false);
      setStudentFeeForm({ recipient: "all", studentIdentifier: "", amount: "", semester: "First Semester", activity: "Tuition", dueDate: "" });
      alert("Student fee assigned successfully.");
    } catch (err) {
      alert(err.message || "Unable to assign the fee.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReminder = (admin) => {
    alert("Payment reminder prepared for " + admin.name + ".");
  };

  const handleDeleteRecord = (admin) => {
    if (!window.confirm("Delete the salary record for " + admin.name + "?")) return;
    setFeesData((current) => ({ ...current, admins: current.admins.filter((item) => item.id !== admin.id) }));
    if (selectedAdmin?.id === admin.id) {
      setSelectedAdmin(null);
      setIsViewModalOpen(false);
    }
  };

  // Filter admins based on search and status
  const filteredAdmins = feesData.admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          admin.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || admin.status === selectedStatus.toLowerCase();
    const matchesRole = selectedRole === 'All' || admin.role === selectedRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Get unique roles for filter
  const uniqueRoles = ['All', ...new Set(feesData.admins.map(a => a.role))];

  // Status badge component
  const getStatusBadge = (status) => {
    const statusMap = {
      paid: { color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
      partial: { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock },
      overdue: { color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
      pending: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
    };
    const config = statusMap[status] || statusMap.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get status icon for transactions
  const getTransactionStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  // Calculate progress percentage for fee payment
  const calculateProgress = (paid, total) => {
    return Math.round((paid / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Fees Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage admin salaries, track payments, and generate reports</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Printer size={16} />
            Print Report
          </button>
          <button
            onClick={() => setIsAssignStudentFeeModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Assign Student Fee
          </button>
          <button
            onClick={() => setIsAddFeeModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add Salary Record
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Payroll</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(feesData.summary.totalPayroll)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-600 font-medium">+8%</span>
              <span className="text-gray-500">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(feesData.summary.totalPending)}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-red-600 font-medium">-3%</span>
              <span className="text-gray-500">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Overdue Amount</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(feesData.summary.totalOverdue)}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm">
              <span className="text-red-600 font-medium">Urgent</span>
              <span className="text-gray-500">- Needs attention</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{feesData.summary.paymentRate}%</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${feesData.summary.paymentRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by admin name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Overdue">Overdue</option>
              <option value="Pending">Pending</option>
            </select>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Admin Fee Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
          <Loader2 className="animate-spin mb-2 text-gray-400" size={32} />
          <p className="text-sm text-gray-500">Loading admin fees data...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center gap-2 p-6 bg-red-50 text-red-600 rounded-xl border border-red-200">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
          <button 
            onClick={fetchFeesData}
            className="ml-3 px-3 py-1 bg-red-100 hover:bg-red-200 rounded-lg text-xs font-medium transition-colors"
          >
            <RefreshCw size={14} className="inline mr-1" />
            Retry
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Paid</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">
                      No admins found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">
                            {admin.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{admin.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{admin.role}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(admin.salary)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(admin.paid)}</span>
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full">
                            <div 
                              className="h-full bg-purple-600 rounded-full transition-all duration-500"
                              style={{ width: `${calculateProgress(admin.paid, admin.salary)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(admin.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{admin.dueDate}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setIsViewModalOpen(true);
                            }}
                            className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleSendReminder(admin)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Send Reminder"
                          >
                            <Mail size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(admin)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <button onClick={() => setShowAllTransactions((current) => !current)} className="text-sm text-purple-600 hover:text-purple-700 font-medium">{showAllTransactions ? "Show Recent" : "View All"}</button>
        </div>
        <div className="space-y-3">
          {(showAllTransactions ? feesData.recentTransactions : feesData.recentTransactions.slice(0, 3)).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                {getTransactionStatusIcon(transaction.status)}
                <div>
                  <p className="text-sm font-medium text-gray-900">{transaction.admin}</p>
                  <p className="text-xs text-gray-500">{transaction.id} • {transaction.method}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(transaction.amount)}</p>
                <p className="text-xs text-gray-500">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Student Fee Modal */}
      {isAssignStudentFeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Assign Student Fee</h2>
                <p className="mt-1 text-sm text-gray-500">Create a fee for every student or for one student.</p>
              </div>
              <button type="button" onClick={() => setIsAssignStudentFeeModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleAssignStudentFee} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Apply fee to</label>
                <select value={studentFeeForm.recipient} onChange={(event) => setStudentFeeForm({ ...studentFeeForm, recipient: event.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All students</option>
                  <option value="individual">One student</option>
                </select>
              </div>
              {studentFeeForm.recipient === "individual" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Student email or ID</label>
                  <input type="text" required placeholder="student@example.com or STU-2026-0001" value={studentFeeForm.studentIdentifier} onChange={(event) => setStudentFeeForm({ ...studentFeeForm, studentIdentifier: event.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Amount</label>
                  <input type="number" min="0" step="0.01" required placeholder="0.00" value={studentFeeForm.amount} onChange={(event) => setStudentFeeForm({ ...studentFeeForm, amount: event.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Due date</label>
                  <input type="date" required value={studentFeeForm.dueDate} onChange={(event) => setStudentFeeForm({ ...studentFeeForm, dueDate: event.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Semester</label>
                  <select value={studentFeeForm.semester} onChange={(event) => setStudentFeeForm({ ...studentFeeForm, semester: event.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>First Semester</option><option>Second Semester</option><option>Third Semester</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Activity or fee type</label>
                  <input type="text" required placeholder="Tuition, excursion, lab fee..." value={studentFeeForm.activity} onChange={(event) => setStudentFeeForm({ ...studentFeeForm, activity: event.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setIsAssignStudentFeeModalOpen(false)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{isSubmitting ? "Assigning..." : "Assign Fee"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Fee Modal */}
      {isAddFeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add Salary Record</h2>
              <button
                onClick={() => setIsAddFeeModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleAddFee}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
                  <input
                    type="text"
                    required
                    value={formData.adminName}
                    onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter admin name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Principal">Principal</option>
                    <option value="Finance Manager">Finance Manager</option>
                    <option value="Academic Coordinator">Academic Coordinator</option>
                    <option value="HR Director">HR Director</option>
                    <option value="Admissions Officer">Admissions Officer</option>
                    <option value="IT Director">IT Director</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary Amount</label>
                  <input
                    type="number"
                    required
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter salary amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddFeeModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Admin Modal */}
      {isViewModalOpen && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Admin Salary Details</h2>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedAdmin(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-lg">
                  {selectedAdmin.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{selectedAdmin.name}</p>
                  <p className="text-sm text-gray-500">{selectedAdmin.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(selectedAdmin.salary)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Paid</p>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(selectedAdmin.paid)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  {getStatusBadge(selectedAdmin.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="text-sm font-medium text-gray-900">{selectedAdmin.dueDate}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Payment Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${calculateProgress(selectedAdmin.paid, selectedAdmin.salary)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {calculateProgress(selectedAdmin.paid, selectedAdmin.salary)}% completed
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedAdmin(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleSendReminder(selectedAdmin)}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Send size={16} className="inline mr-2" />
                  Send Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}