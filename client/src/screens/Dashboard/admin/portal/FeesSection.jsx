"use client";

import { useEffect, useState } from "react";

import {
  Badge,
  Banner,
  Button,
  Card,
  Cell,
  Field,
  Input,
  Loading,
  SectionHeader,
  Select,
  StatCard,
  Table,
  errorMessage,
  formatDate,
  formatMoney,
  useStatus,
} from "@/components/portal/PortalUI";
import { adminService } from "@/services/adminService";

const EMPTY_FORM = {
  student_id: "",
  title: "School fees",
  term: "Term 1",
  amount: "",
  amount_paid: "0",
  due_date: "",
};

export function AdminFeesSection() {
  const { status, announce } = useStatus();
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({});
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [payment, setPayment] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);
  const load = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      adminService.listFees(),
      adminService.listStudents(),
    ])
      .then(([feeData, studentData]) => {
        if (cancelled) return;
        setFees(feeData.fees || []);
        setSummary(feeData.summary || {});
        setStudents(studentData.students || []);
      })
      .catch((err) => {
        if (cancelled) return;
        announce("error", errorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [announce, refreshKey]);

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.student_id) {
      announce("error", "Select the student this invoice is for.");
      return;
    }
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      announce("error", "Enter a fee amount greater than zero.");
      return;
    }

    setSaving(true);
    try {
      await adminService.createFee({
        student_id: Number(form.student_id),
        title: form.title.trim() || "School fees",
        term: form.term,
        amount,
        amount_paid: Number(form.amount_paid) || 0,
        due_date: form.due_date || undefined,
      });
      announce("success", "Fee issued — it now shows in the student's portal.");
      setForm(EMPTY_FORM);
      await load();
    } catch (err) {
      announce("error", errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const recordPayment = async (fee) => {
    const value = Number(payment[fee.id]);
    if (!Number.isFinite(value) || value <= 0) {
      announce("error", "Enter the amount received before recording a payment.");
      return;
    }

    try {
      await adminService.updateFee(fee.id, {
        amount_paid: (fee.amount_paid || 0) + value,
      });
      announce("success", `Payment recorded for ${fee.student_name}.`);
      setPayment((current) => ({ ...current, [fee.id]: "" }));
      await load();
    } catch (err) {
      announce("error", errorMessage(err));
    }
  };

  const handleDelete = async (fee) => {
    try {
      await adminService.deleteFee(fee.id);
      announce("success", "Fee record deleted.");
      await load();
    } catch (err) {
      announce("error", errorMessage(err));
    }
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Fees"
        description="Issue invoices to students and record payments. Students see their statement instantly."
      />

      <Banner status={status} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total billed" value={formatMoney(summary.billed)} />
        <StatCard label="Collected" value={formatMoney(summary.paid)} />
        <StatCard label="Outstanding" value={formatMoney(summary.balance)} />
      </div>

      <Card title="Issue a fee">
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Student">
            <Select
              value={form.student_id}
              onChange={update("student_id")}
              placeholder="Select a student"
              options={students.map((student) => ({
                value: String(student.id),
                label: `${student.name} · ${student.class_name || "No class"}`,
              }))}
            />
          </Field>
          <Field label="Description">
            <Input value={form.title} onChange={update("title")} />
          </Field>
          <Field label="Term">
            <Select
              value={form.term}
              onChange={update("term")}
              options={["Term 1", "Term 2", "Term 3"]}
            />
          </Field>
          <Field label="Amount">
            <Input type="number" min="1" value={form.amount} onChange={update("amount")} />
          </Field>
          <Field label="Already paid">
            <Input
              type="number"
              min="0"
              value={form.amount_paid}
              onChange={update("amount_paid")}
            />
          </Field>
          <Field label="Due date">
            <Input type="date" value={form.due_date} onChange={update("due_date")} />
          </Field>

          <div className="flex items-end sm:col-span-2 lg:col-span-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Issuing…" : "Issue fee"}
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Fee records">
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={[
              "Student",
              "Invoice",
              "Amount",
              "Balance",
              "Due",
              "Status",
              "Record payment",
            ]}
            rows={fees}
            empty="No fees have been issued yet."
            renderRow={(fee) => (
              <tr key={fee.id}>
                <Cell className="font-medium text-[#111827]">
                  {fee.student_name}
                  <span className="block text-xs text-[#6b7280]">{fee.class_name}</span>
                </Cell>
                <Cell>
                  {fee.title}
                  <span className="block text-xs text-[#6b7280]">{fee.term}</span>
                </Cell>
                <Cell>{formatMoney(fee.amount)}</Cell>
                <Cell>{formatMoney(fee.balance)}</Cell>
                <Cell>{formatDate(fee.due_date)}</Cell>
                <Cell>
                  <Badge value={fee.status} />
                </Cell>
                <Cell>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      className="w-28"
                      placeholder="Amount"
                      value={payment[fee.id] || ""}
                      onChange={(event) =>
                        setPayment((current) => ({
                          ...current,
                          [fee.id]: event.target.value,
                        }))
                      }
                    />
                    <Button variant="secondary" onClick={() => recordPayment(fee)}>
                      Record
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(fee)}>
                      Delete
                    </Button>
                  </div>
                </Cell>
              </tr>
            )}
          />
        )}
      </Card>
    </div>
  );
}

export default AdminFeesSection;
