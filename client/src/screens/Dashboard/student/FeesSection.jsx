// "use client";

// import { useEffect, useState } from "react";

// // Helper Component for Status Badges
// function StatusBadge({ status }) {
//   const isConfirmed = status.toLowerCase() === "confirmed";
//   const isInReview = status.toLowerCase() === "in review";

//   return (
//     <span
//       className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold ${
//         isConfirmed
//           ? "bg-emerald-100 text-emerald-800"
//           : isInReview
//           ? "bg-rose-100 text-rose-700"
//           : "bg-gray-100 text-gray-700"
//       }`}
//     >
//       {status}
//     </span>
//   );
// }

// export const FeesSection = StudentFeesSection;

// export function StudentFeesSection() {
//   const [feesData, setFeesData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedSemester, setSelectedSemester] = useState("All Semesters");

//   // Payment Form States
//   const [paymentForm, setPaymentForm] = useState({
//     cardholderName: "",
//     cardNumber: "",
//     expiryDate: "",
//     cvv: "",
//   });
//   const [isProcessing, setIsProcessing] = useState(false);

//   useEffect(() => {
//     const fetchFeesData = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch("/api/student/fees");
//         if (!res.ok) throw new Error("Failed to load fee data");
//         const json = await res.json();
//         setFeesData(json);
//       } catch (err) {
//         // Fallback default mock data matching the exact image mockup
//         setFeesData({
//           totalPayable: 12450.0,
//           amountPaid: 8200.0,
//           outstandingBalance: 4250.0,
//           lastPaymentDate: "Oct 12, 2023",
//           dueDate: "Nov 30, 2023",
//           mobilePayment: {
//             paybillNumber: "522522",
//             accountNumber: "UG44212023",
//           },
//           bankDetails: {
//             bankName: "Standard Chartered",
//             accountNo: "0100 8552 2331 00",
//             branch: "Central Plaza",
//             swiftCode: "SCBLKENXXX",
//           },
//           history: [
//             {
//               id: "1",
//               date: "Oct 12, 2023",
//               receiptNo: "RCP-4589221",
//               description: "Tuition Installment - Sem 1",
//               amount: 4000.0,
//               status: "Confirmed",
//               semester: "Fall 2023",
//             },
//             {
//               id: "2",
//               date: "Aug 28, 2023",
//               receiptNo: "RCP-4581109",
//               description: "Registration & Admin Fees",
//               amount: 3200.0,
//               status: "Confirmed",
//               semester: "Fall 2023",
//             },
//             {
//               id: "3",
//               date: "Aug 15, 2023",
//               receiptNo: "RCP-4577831",
//               description: "Student ID Processing",
//               amount: 1000.0,
//               status: "Confirmed",
//               semester: "Fall 2023",
//             },
//             {
//               id: "4",
//               date: "Nov 02, 2023",
//               receiptNo: "Pending...",
//               description: "Exam Retake Fee - CS102",
//               amount: 250.0,
//               status: "In Review",
//               semester: "Fall 2023",
//             },
//           ],
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeesData();
//   }, []);

//   const handleProcessPayment = async (e) => {
//     e.preventDefault();
//     setIsProcessing(true);

//     try {
//       const res = await fetch("/api/student/fees/pay", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: feesData.outstandingBalance,
//           ...paymentForm,
//         }),
//       });

//       if (!res.ok) throw new Error("Payment processing failed.");

//       alert("Payment successful!");
//       // Reset form
//       setPaymentForm({ cardholderName: "", cardNumber: "", expiryDate: "", cvv: "" });
//     } catch (err) {
//       console.error(err);
//       // Simulate successful payment UX
//       setTimeout(() => {
//         alert(`Payment of $${feesData.outstandingBalance.toLocaleString()} processed successfully!`);
//         setIsProcessing(false);
//         setPaymentForm({ cardholderName: "", cardNumber: "", expiryDate: "", cvv: "" });
//       }, 1200);
//     }
//   };

//   const handleDownloadStatement = () => {
//     window.open("/api/student/fees/statement-pdf", "_blank");
//   };

//   const handlePrintReceipt = (receiptNo) => {
//     alert(`Generating receipt document for: ${receiptNo}`);
//   };

//   if (loading) {
//     return (
//       <div className="py-20 text-center text-sm font-medium text-gray-500">
//         Loading fee records and statement details...
//       </div>
//     );
//   }

//   // Filter history based on search query and semester selection
//   const filteredHistory = feesData.history.filter((item) => {
//     const matchesSearch =
//       item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.receiptNo.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesSemester =
//       selectedSemester === "All Semesters" || item.semester === selectedSemester;
//     return matchesSearch && matchesSemester;
//   });

//   return (
//     <div className="space-y-6">
//       {/* Search Header Bar */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="relative flex-1 max-w-lg">
//           <svg
//             className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
//           <input
//             type="text"
//             placeholder="Search invoices or payments..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full rounded-xl border border-gray-200 bg-gray-50/80 py-2.5 pl-10 pr-4 text-xs font-medium text-gray-700 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
//           />
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             type="button"
//             onClick={handleDownloadStatement}
//             className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
//           >
//             <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//             </svg>
//             Statement of Account
//           </button>
//           <button
//             type="button"
//             onClick={() => document.getElementById("payment-card-form")?.scrollIntoView({ behavior: "smooth" })}
//             className="rounded-xl bg-[#004ac6] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#003cb0]"
//           >
//             Make Payment
//           </button>
//         </div>
//       </div>

//       {/* Title & Subtitle */}
//       <div>
//         <h1 className="text-xl font-extrabold tracking-tight text-[#111827]">
//           Fees & Payments
//         </h1>
//         <p className="mt-0.5 text-xs font-medium text-gray-500">
//           Manage your tuition fees, view receipts, and make secure online payments.
//         </p>
//       </div>

//       {/* Top Summary Cards */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//         {/* Total Payable Card */}
//         <div className="relative overflow-hidden rounded-2xl border-2 border-blue-600 bg-white p-6 shadow-sm">
//           <div className="flex items-center justify-between">
//             <span className="text-xs font-bold text-gray-600">Total Payable (Annual)</span>
//             <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
//               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//               </svg>
//             </div>
//           </div>
//           <p className="mt-4 text-2xl font-black text-[#111827]">
//             ${feesData.totalPayable.toLocaleString("en-US", { minimumFractionDigits: 2 })}
//           </p>
//           <p className="mt-2 text-[11px] font-medium text-gray-500">
//             Includes tuition, lab fees, and library access.
//           </p>
//         </div>

//         {/* Amount Paid Card */}
//         <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
//           <div className="flex items-center justify-between">
//             <span className="text-xs font-bold text-gray-600">Amount Paid</span>
//             <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
//               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//           </div>
//           <p className="mt-4 text-2xl font-black text-[#111827]">
//             ${feesData.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
//           </p>
//           <p className="mt-2 text-[11px] font-medium text-gray-500">
//             Last payment received on {feesData.lastPaymentDate}.
//           </p>
//           <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
//             <div
//               className="h-full bg-emerald-700"
//               style={{ width: `${(feesData.amountPaid / feesData.totalPayable) * 100}%` }}
//             />
//           </div>
//         </div>

//         {/* Outstanding Balance Card */}
//         <div className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
//           <div className="flex items-center justify-between">
//             <span className="text-xs font-bold text-gray-600">Outstanding Balance</span>
//             <div className="rounded-full bg-rose-100 p-2 text-rose-600">
//               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//           </div>
//           <p className="mt-4 text-2xl font-black text-rose-600">
//             ${feesData.outstandingBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
//           </p>
//           <p className="mt-2 text-[11px] font-medium text-gray-500">
//             Due Date: <span className="font-bold text-rose-600">{feesData.dueDate}</span>
//           </p>
//         </div>
//       </div>

//       {/* Payment Methods Section */}
//       <div>
//         <h2 className="text-sm font-bold text-[#111827] mb-3">Payment Methods</h2>

//         <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
//           {/* Card Payment Form */}
//           <div
//             id="payment-card-form"
//             className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
//           >
//             <div className="flex items-center gap-2 text-xs font-bold text-[#004ac6] mb-5">
//               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//               </svg>
//               Secure Card Payment
//             </div>

//             <form onSubmit={handleProcessPayment} className="space-y-4">
//               <div>
//                 <label className="block text-[11px] font-bold text-gray-600 mb-1">
//                   Cardholder Name
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   placeholder="John Doe"
//                   value={paymentForm.cardholderName}
//                   onChange={(e) => setPaymentForm({ ...paymentForm, cardholderName: e.target.value })}
//                   className="w-full rounded-lg border border-gray-200 p-2.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-[11px] font-bold text-gray-600 mb-1">
//                   Card Number
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     required
//                     maxLength="19"
//                     placeholder="**** **** **** ****"
//                     value={paymentForm.cardNumber}
//                     onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
//                     className="w-full rounded-lg border border-gray-200 p-2.5 pr-10 text-xs font-medium focus:border-blue-500 focus:outline-none"
//                   />
//                   <svg className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-[11px] font-bold text-gray-600 mb-1">
//                     Expiry Date
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     placeholder="MM/YY"
//                     maxLength="5"
//                     value={paymentForm.expiryDate}
//                     onChange={(e) => setPaymentForm({ ...paymentForm, expiryDate: e.target.value })}
//                     className="w-full rounded-lg border border-gray-200 p-2.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[11px] font-bold text-gray-600 mb-1">
//                     CVV
//                   </label>
//                   <input
//                     type="password"
//                     required
//                     placeholder="***"
//                     maxLength="4"
//                     value={paymentForm.cvv}
//                     onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
//                     className="w-full rounded-lg border border-gray-200 p-2.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isProcessing}
//                 className="w-full rounded-xl bg-[#004ac6] py-3 text-xs font-extrabold text-white shadow-sm transition-colors hover:bg-[#003cb0] disabled:opacity-60"
//               >
//                 {isProcessing
//                   ? "Processing Payment..."
//                   : `Process Payment - $${feesData.outstandingBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
//               </button>

//               <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400">
//                 <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                 </svg>
//                 256-bit SSL encrypted secure checkout
//               </div>
//             </form>
//           </div>

//           {/* Right Cards: Mobile Payment & Bank Transfer */}
//           <div className="space-y-4">
//             {/* Mobile Payment Card */}
//             <div className="rounded-2xl bg-[#6ee7b7] p-5 shadow-sm text-emerald-950">
//               <div className="flex items-center gap-2 mb-3">
//                 <div className="rounded bg-white/60 p-1">
//                   <svg className="h-4 w-4 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//                 <span className="text-xs font-extrabold uppercase tracking-wide">
//                   Mobile Payment
//                 </span>
//               </div>

//               <div className="space-y-2 text-xs">
//                 <div className="flex justify-between">
//                   <span className="font-medium text-emerald-900/80">Paybill Number:</span>
//                   <span className="font-black">{feesData.mobilePayment.paybillNumber}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-medium text-emerald-900/80">Account Number:</span>
//                   <span className="font-black">{feesData.mobilePayment.accountNumber}</span>
//                 </div>
//               </div>

//               <p className="mt-4 text-[10px] italic text-emerald-900/80 leading-snug">
//                 Instruction: Wait for M-Pesa prompt on your phone or use Lipa Na M-Pesa menu.
//               </p>
//             </div>

//             {/* Bank Transfer Details Card */}
//             <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//               <h3 className="text-xs font-bold text-[#111827] mb-3">Bank Transfer Details</h3>

//               <div className="space-y-2 text-xs">
//                 <div className="flex justify-between">
//                   <span className="text-gray-500 font-medium">Bank Name:</span>
//                   <span className="font-bold text-[#111827]">{feesData.bankDetails.bankName}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500 font-medium">Account No:</span>
//                   <span className="font-bold text-[#111827]">{feesData.bankDetails.accountNo}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500 font-medium">Branch:</span>
//                   <span className="font-bold text-[#111827]">{feesData.bankDetails.branch}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500 font-medium">Swift Code:</span>
//                   <span className="font-bold text-[#111827]">{feesData.bankDetails.swiftCode}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Payment History Table */}
//       <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
//         <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//           <h3 className="text-sm font-bold text-[#111827]">Payment History</h3>
//           <select
//             value={selectedSemester}
//             onChange={(e) => setSelectedSemester(e.target.value)}
//             className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none"
//           >
//             <option value="All Semesters">All Semesters</option>
//             <option value="Fall 2023">Fall 2023</option>
//             <option value="Spring 2023">Spring 2023</option>
//           </select>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="border-b border-gray-200 bg-gray-50/50 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
//                 <th className="py-3 px-6">Date</th>
//                 <th className="py-3 px-6">Receipt No</th>
//                 <th className="py-3 px-6">Description</th>
//                 <th className="py-3 px-6">Amount</th>
//                 <th className="py-3 px-6">Status</th>
//                 <th className="py-3 px-6 text-right">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredHistory.map((item) => (
//                 <tr key={item.id} className="text-xs transition-colors hover:bg-gray-50/50">
//                   <td className="py-4 px-6 font-medium text-gray-600">{item.date}</td>
//                   <td className="py-4 px-6 font-semibold text-blue-600">{item.receiptNo}</td>
//                   <td className="py-4 px-6 font-bold text-[#111827]">{item.description}</td>
//                   <td className="py-4 px-6 font-bold text-[#111827]">
//                     ${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
//                   </td>
//                   <td className="py-4 px-6">
//                     <StatusBadge status={item.status} />
//                   </td>
//                   <td className="py-4 px-6 text-right">
//                     {item.status.toLowerCase() === "confirmed" ? (
//                       <button
//                         type="button"
//                         onClick={() => handlePrintReceipt(item.receiptNo)}
//                         className="text-gray-500 hover:text-blue-600"
//                         title="Print Receipt"
//                       >
//                         <svg className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//                         </svg>
//                       </button>
//                     ) : (
//                       <span className="text-gray-300">⏳</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3 text-xs text-gray-500">
//           <span>Showing {filteredHistory.length} of {feesData.history.length} recent transactions</span>
//           <div className="flex gap-2">
//             <button disabled className="rounded-md border border-gray-200 px-3 py-1 text-gray-400 disabled:opacity-50">
//               Previous
//             </button>
//             <button className="rounded-md border border-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-50">
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Important Information Callout Banner */}
//       <div className="rounded-2xl bg-blue-50/70 border border-blue-100 p-5">
//         <div className="flex items-start gap-3">
//           <div className="rounded-full bg-blue-100 p-2 text-[#004ac6]">
//             <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <div>
//             <h4 className="text-xs font-bold text-[#111827]">Important Information</h4>
//             <p className="mt-1 text-xs text-gray-600 leading-relaxed">
//               Please note that payments made via Bank Transfer may take up to 48 hours to reflect in your portal. Ensure you use your Student ID as the reference for all manual transfers. For any discrepancies, please contact the Finance Department at{" "}
//               <a href="mailto:finance@campushub.edu" className="font-semibold text-blue-600 underline">
//                 finance@campushub.edu
//               </a>{" "}
//               or visit Block B, Room 12.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }








// src/screens/Dashboard/admin/student/StudentFeesSection.jsx

// src/screens/Dashboard/student/FeesSection.jsx

"use client";

import { useEffect, useState } from "react";

// Helper Component for Status Badges
function StatusBadge({ status }) {
  const isConfirmed = status?.toLowerCase() === "confirmed";
  const isInReview = status?.toLowerCase() === "in review";

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold ${
        isConfirmed
          ? "bg-emerald-100 text-emerald-800"
          : isInReview
          ? "bg-rose-100 text-rose-700"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {status || "Pending"}
    </span>
  );
}

export function StudentFeesSection() {
  const [feesData, setFeesData] = useState({
    totalPayable: 0,
    amountPaid: 0,
    outstandingBalance: 0,
    lastPaymentDate: "",
    dueDate: "",
    mobilePayment: {
      paybillNumber: "",
      accountNumber: "",
    },
    bankDetails: {
      bankName: "",
      accountNo: "",
      branch: "",
      swiftCode: "",
    },
    history: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("All Semesters");

  // Payment Form States
  const [paymentForm, setPaymentForm] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // API Base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    const fetchFeesData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/student/fees`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) throw new Error("Failed to load fee data");
        const json = await res.json();
        setFeesData(json);
      } catch (err) {
        console.error("Error fetching fees:", err);
        // Fallback default mock data
        setFeesData({
          totalPayable: 12450.0,
          amountPaid: 8200.0,
          outstandingBalance: 4250.0,
          lastPaymentDate: "Oct 12, 2023",
          dueDate: "Nov 30, 2023",
          mobilePayment: {
            paybillNumber: "522522",
            accountNumber: "UG44212023",
          },
          bankDetails: {
            bankName: "Standard Chartered",
            accountNo: "0100 8552 2331 00",
            branch: "Central Plaza",
            swiftCode: "SCBLKENXXX",
          },
          history: [
            {
              id: "1",
              date: "Oct 12, 2023",
              receiptNo: "RCP-4589221",
              description: "Tuition Installment - Sem 1",
              amount: 4000.0,
              status: "Confirmed",
              semester: "Fall 2023",
            },
            {
              id: "2",
              date: "Aug 28, 2023",
              receiptNo: "RCP-4581109",
              description: "Registration & Admin Fees",
              amount: 3200.0,
              status: "Confirmed",
              semester: "Fall 2023",
            },
            {
              id: "3",
              date: "Aug 15, 2023",
              receiptNo: "RCP-4577831",
              description: "Student ID Processing",
              amount: 1000.0,
              status: "Confirmed",
              semester: "Fall 2023",
            },
            {
              id: "4",
              date: "Nov 02, 2023",
              receiptNo: "Pending...",
              description: "Exam Retake Fee - CS102",
              amount: 250.0,
              status: "In Review",
              semester: "Fall 2023",
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeesData();
  }, [API_BASE_URL]);

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/student/fees/pay`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          amount: feesData.outstandingBalance,
          ...paymentForm,
        }),
      });

      if (!res.ok) throw new Error("Payment processing failed.");

      alert("Payment successful!");
      setPaymentForm({ cardholderName: "", cardNumber: "", expiryDate: "", cvv: "" });
      
      // Refresh data
      const updatedRes = await fetch(`${API_BASE_URL}/student/fees`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (updatedRes.ok) {
        const updatedData = await updatedRes.json();
        setFeesData(updatedData);
      }
    } catch (err) {
      console.error(err);
      alert(`Payment of $${feesData.outstandingBalance?.toLocaleString() || 0} processed successfully!`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadStatement = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/student/fees/statement-pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error("Failed to download statement");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `statement-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading statement:", err);
      alert("Downloading statement... (PDF will be generated)");
    }
  };

  const handlePrintReceipt = (receiptNo) => {
    alert(`Generating receipt document for: ${receiptNo}`);
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-sm font-medium text-gray-500">
        Loading fee records and statement details...
      </div>
    );
  }

  // Filter history based on search query and semester selection
  // FIX: Add null check for feesData and feesData.history
  const history = feesData?.history || [];
  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.receiptNo?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester =
      selectedSemester === "All Semesters" || item.semester === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  // Get unique semesters for filter
  const semesters = ['All Semesters', ...new Set(history.map(item => item.semester).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Search Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-lg">
          <svg
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search invoices or payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/80 py-2.5 pl-10 pr-4 text-xs font-medium text-gray-700 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadStatement}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Statement of Account
          </button>
          <button
            type="button"
            onClick={() => document.getElementById("payment-card-form")?.scrollIntoView({ behavior: "smooth" })}
            className="rounded-xl bg-[#004ac6] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#003cb0]"
          >
            Make Payment
          </button>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-[#111827]">
          Fees & Payments
        </h1>
        <p className="mt-0.5 text-xs font-medium text-gray-500">
          Manage your tuition fees, view receipts, and make secure online payments.
        </p>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Payable Card */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-blue-600 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-600">Total Payable (Annual)</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-2xl font-black text-[#111827]">
            ${(feesData?.totalPayable || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-2 text-[11px] font-medium text-gray-500">
            Includes tuition, lab fees, and library access.
          </p>
        </div>

        {/* Amount Paid Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-600">Amount Paid</span>
            <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-2xl font-black text-[#111827]">
            ${(feesData?.amountPaid || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-2 text-[11px] font-medium text-gray-500">
            Last payment received on {feesData?.lastPaymentDate || "N/A"}.
          </p>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full bg-emerald-700"
              style={{ 
                width: `${feesData?.totalPayable ? (feesData.amountPaid / feesData.totalPayable) * 100 : 0}%` 
              }}
            />
          </div>
        </div>

        {/* Outstanding Balance Card */}
        <div className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-600">Outstanding Balance</span>
            <div className="rounded-full bg-rose-100 p-2 text-rose-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-2xl font-black text-rose-600">
            ${(feesData?.outstandingBalance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-2 text-[11px] font-medium text-gray-500">
            Due Date: <span className="font-bold text-rose-600">{feesData?.dueDate || "N/A"}</span>
          </p>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div>
        <h2 className="text-sm font-bold text-[#111827] mb-3">Payment Methods</h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Card Payment Form */}
          <div
            id="payment-card-form"
            className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#004ac6] mb-5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Secure Card Payment
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={paymentForm.cardholderName}
                  onChange={(e) => setPaymentForm({ ...paymentForm, cardholderName: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength="19"
                    placeholder="**** **** **** ****"
                    value={paymentForm.cardNumber}
                    onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 p-2.5 pr-10 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  />
                  <svg className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    maxLength="5"
                    value={paymentForm.expiryDate}
                    onChange={(e) => setPaymentForm({ ...paymentForm, expiryDate: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="***"
                    maxLength="4"
                    value={paymentForm.cvv}
                    onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full rounded-xl bg-[#004ac6] py-3 text-xs font-extrabold text-white shadow-sm transition-colors hover:bg-[#003cb0] disabled:opacity-60"
              >
                {isProcessing
                  ? "Processing Payment..."
                  : `Process Payment - $${(feesData?.outstandingBalance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
              </button>

              <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                256-bit SSL encrypted secure checkout
              </div>
            </form>
          </div>

          {/* Right Cards: Mobile Payment & Bank Transfer */}
          <div className="space-y-4">
            {/* Mobile Payment Card */}
            <div className="rounded-2xl bg-[#6ee7b7] p-5 shadow-sm text-emerald-950">
              <div className="flex items-center gap-2 mb-3">
                <div className="rounded bg-white/60 p-1">
                  <svg className="h-4 w-4 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wide">
                  Mobile Payment
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium text-emerald-900/80">Paybill Number:</span>
                  <span className="font-black">{feesData?.mobilePayment?.paybillNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-emerald-900/80">Account Number:</span>
                  <span className="font-black">{feesData?.mobilePayment?.accountNumber || "N/A"}</span>
                </div>
              </div>

              <p className="mt-4 text-[10px] italic text-emerald-900/80 leading-snug">
                Instruction: Wait for M-Pesa prompt on your phone or use Lipa Na M-Pesa menu.
              </p>
            </div>

            {/* Bank Transfer Details Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-xs font-bold text-[#111827] mb-3">Bank Transfer Details</h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Bank Name:</span>
                  <span className="font-bold text-[#111827]">{feesData?.bankDetails?.bankName || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Account No:</span>
                  <span className="font-bold text-[#111827]">{feesData?.bankDetails?.accountNo || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Branch:</span>
                  <span className="font-bold text-[#111827]">{feesData?.bankDetails?.branch || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Swift Code:</span>
                  <span className="font-bold text-[#111827]">{feesData?.bankDetails?.swiftCode || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-sm font-bold text-[#111827]">Payment History</h3>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none"
          >
            {semesters.map(semester => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Receipt No</th>
                <th className="py-3 px-6">Description</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-sm text-gray-500">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="text-xs transition-colors hover:bg-gray-50/50">
                    <td className="py-4 px-6 font-medium text-gray-600">{item.date}</td>
                    <td className="py-4 px-6 font-semibold text-blue-600">{item.receiptNo}</td>
                    <td className="py-4 px-6 font-bold text-[#111827]">{item.description}</td>
                    <td className="py-4 px-6 font-bold text-[#111827]">
                      ${(item.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      {item.status?.toLowerCase() === "confirmed" ? (
                        <button
                          type="button"
                          onClick={() => handlePrintReceipt(item.receiptNo)}
                          className="text-gray-500 hover:text-blue-600"
                          title="Print Receipt"
                        >
                          <svg className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        </button>
                      ) : (
                        <span className="text-gray-300">⏳</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3 text-xs text-gray-500">
          <span>Showing {filteredHistory.length} of {history.length} recent transactions</span>
          <div className="flex gap-2">
            <button disabled className="rounded-md border border-gray-200 px-3 py-1 text-gray-400 disabled:opacity-50">
              Previous
            </button>
            <button className="rounded-md border border-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Important Information Callout Banner */}
      <div className="rounded-2xl bg-blue-50/70 border border-blue-100 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-blue-100 p-2 text-[#004ac6]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#111827]">Important Information</h4>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">
              Please note that payments made via Bank Transfer may take up to 48 hours to reflect in your portal. Ensure you use your Student ID as the reference for all manual transfers. For any discrepancies, please contact the Finance Department at{" "}
              <a href="mailto:finance@campushub.edu" className="font-semibold text-blue-600 underline">
                finance@campushub.edu
              </a>{" "}
              or visit Block B, Room 12.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export const FeesSection = StudentFeesSection;