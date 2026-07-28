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

const EMPTY_TEACHER = {
  name: "",
  email: "",
  employee_id: "",
  department: "",
  subject: "",
  classes: "",
};

const EMPTY_SALARY = {
  teacher_id: "",
  period: "",
  gross_amount: "",
  deductions: "0",
  status: "pending",
  note: "",
};

export function AdminTeachersSection() {
  const { status, announce } = useStatus();
  const [teachers, setTeachers] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [salarySummary, setSalarySummary] = useState({});
  const [teacherForm, setTeacherForm] = useState(EMPTY_TEACHER);
  const [salaryForm, setSalaryForm] = useState(EMPTY_SALARY);
  const [loading, setLoading] = useState(true);
  const [savingTeacher, setSavingTeacher] = useState(false);
  const [savingSalary, setSavingSalary] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);
  const load = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      adminService.listTeachers(),
      adminService.listSalaries(),
    ])
      .then(([teacherData, salaryData]) => {
        if (cancelled) return;
        setTeachers(teacherData.teachers || []);
        setSalaries(salaryData.salaries || []);
        setSalarySummary(salaryData.summary || {});
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

  const updateTeacher = (field) => (event) =>
    setTeacherForm((current) => ({ ...current, [field]: event.target.value }));

  const updateSalary = (field) => (event) =>
    setSalaryForm((current) => ({ ...current, [field]: event.target.value }));

  const handleAddTeacher = async (event) => {
    event.preventDefault();

    if (!teacherForm.name.trim() || !teacherForm.email.trim()) {
      announce("error", "Name and email are required.");
      return;
    }
    if (!teacherForm.employee_id.trim()) {
      announce("error", "An employee ID is required.");
      return;
    }

    setSavingTeacher(true);
    try {
      await adminService.createTeacher({
        name: teacherForm.name.trim(),
        email: teacherForm.email.trim(),
        employee_id: teacherForm.employee_id.trim(),
        department: teacherForm.department.trim(),
        subject: teacherForm.subject.trim(),
        classes: teacherForm.classes
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean),
      });
      announce("success", "Teacher added and given portal access.");
      setTeacherForm(EMPTY_TEACHER);
      await load();
    } catch (err) {
      announce("error", errorMessage(err));
    } finally {
      setSavingTeacher(false);
    }
  };

  const handleAssignClasses = async (teacher, value) => {
    try {
      await adminService.updateTeacher(teacher.id, {
        classes: value
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean),
      });
      announce("success", `Classes updated for ${teacher.name}.`);
      await load();
    } catch (err) {
      announce("error", errorMessage(err));
    }
  };

  const handleIssueSalary = async (event) => {
    event.preventDefault();

    if (!salaryForm.teacher_id) {
      announce("error", "Select the teacher this payslip is for.");
      return;
    }
    if (!salaryForm.period.trim()) {
      announce("error", "Enter the pay period, for example 'July 2026'.");
      return;
    }
    const gross = Number(salaryForm.gross_amount);
    const deductions = Number(salaryForm.deductions) || 0;
    if (!Number.isFinite(gross) || gross <= 0) {
      announce("error", "Gross pay must be greater than zero.");
      return;
    }
    if (deductions > gross) {
      announce("error", "Deductions cannot exceed the gross amount.");
      return;
    }

    setSavingSalary(true);
    try {
      await adminService.createSalary({
        teacher_id: Number(salaryForm.teacher_id),
        period: salaryForm.period.trim(),
        gross_amount: gross,
        deductions,
        status: salaryForm.status,
        note: salaryForm.note.trim(),
      });
      announce("success", "Salary record issued — the teacher portal shows it now.");
      setSalaryForm(EMPTY_SALARY);
      await load();
    } catch (err) {
      announce("error", errorMessage(err));
    } finally {
      setSavingSalary(false);
    }
  };

  const markPaid = async (salary) => {
    try {
      await adminService.updateSalary(salary.id, { status: "paid" });
      announce("success", `${salary.teacher_name}'s payslip marked as paid.`);
      await load();
    } catch (err) {
      announce("error", errorMessage(err));
    }
  };

  const deleteSalary = async (salary) => {
    try {
      await adminService.deleteSalary(salary.id);
      announce("success", "Salary record deleted.");
      await load();
    } catch (err) {
      announce("error", errorMessage(err));
    }
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Teachers and payroll"
        description="Manage teaching staff, the classes they teach, and their salary records."
      />

      <Banner status={status} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Teachers" value={teachers.length} />
        <StatCard label="Payroll issued" value={formatMoney(salarySummary.net)} />
        <StatCard label="Pending payslips" value={salarySummary.pending ?? 0} />
      </div>

      <Card title="Add a teacher">
        <form onSubmit={handleAddTeacher} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Full name">
            <Input value={teacherForm.name} onChange={updateTeacher("name")} />
          </Field>
          <Field label="Email">
            <Input type="email" value={teacherForm.email} onChange={updateTeacher("email")} />
          </Field>
          <Field label="Employee ID">
            <Input
              value={teacherForm.employee_id}
              onChange={updateTeacher("employee_id")}
              placeholder="EMP-014"
            />
          </Field>
          <Field label="Department">
            <Input value={teacherForm.department} onChange={updateTeacher("department")} />
          </Field>
          <Field label="Subject">
            <Input value={teacherForm.subject} onChange={updateTeacher("subject")} />
          </Field>
          <Field label="Classes" hint="Comma separated, e.g. Grade 10A, Grade 11B">
            <Input value={teacherForm.classes} onChange={updateTeacher("classes")} />
          </Field>

          <div className="flex items-end sm:col-span-2 lg:col-span-3">
            <Button type="submit" disabled={savingTeacher}>
              {savingTeacher ? "Adding…" : "Add teacher"}
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Teaching staff">
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={["Teacher", "Employee ID", "Department", "Subject", "Classes"]}
            rows={teachers}
            empty="No teachers have been added yet."
            renderRow={(teacher) => (
              <tr key={teacher.id}>
                <Cell className="font-medium text-[#111827]">
                  {teacher.name}
                  <span className="block text-xs text-[#6b7280]">{teacher.email}</span>
                </Cell>
                <Cell>{teacher.employee_id}</Cell>
                <Cell>{teacher.department || "—"}</Cell>
                <Cell>{teacher.subject || "—"}</Cell>
                <Cell>
                  <Input
                    defaultValue={(teacher.classes || []).join(", ")}
                    placeholder="Grade 10A, Grade 11B"
                    onBlur={(event) => {
                      const next = event.target.value;
                      if (next !== (teacher.classes || []).join(", ")) {
                        handleAssignClasses(teacher, next);
                      }
                    }}
                  />
                </Cell>
              </tr>
            )}
          />
        )}
      </Card>

      <Card
        title="Issue a salary record"
        description="Payslips appear on the teacher's dashboard as soon as they are issued."
      >
        <form onSubmit={handleIssueSalary} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Teacher">
            <Select
              value={salaryForm.teacher_id}
              onChange={updateSalary("teacher_id")}
              placeholder="Select a teacher"
              options={teachers.map((teacher) => ({
                value: String(teacher.id),
                label: `${teacher.name} · ${teacher.employee_id}`,
              }))}
            />
          </Field>
          <Field label="Pay period">
            <Input
              value={salaryForm.period}
              onChange={updateSalary("period")}
              placeholder="July 2026"
            />
          </Field>
          <Field label="Gross pay">
            <Input
              type="number"
              min="1"
              value={salaryForm.gross_amount}
              onChange={updateSalary("gross_amount")}
            />
          </Field>
          <Field label="Deductions">
            <Input
              type="number"
              min="0"
              value={salaryForm.deductions}
              onChange={updateSalary("deductions")}
            />
          </Field>
          <Field label="Status">
            <Select
              value={salaryForm.status}
              onChange={updateSalary("status")}
              options={[
                { value: "pending", label: "Pending" },
                { value: "paid", label: "Paid" },
              ]}
            />
          </Field>
          <Field label="Note">
            <Input value={salaryForm.note} onChange={updateSalary("note")} />
          </Field>

          <div className="flex items-end sm:col-span-2 lg:col-span-3">
            <Button type="submit" disabled={savingSalary}>
              {savingSalary ? "Issuing…" : "Issue salary record"}
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Payroll records">
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={["Teacher", "Period", "Gross", "Net", "Status", "Paid on", ""]}
            rows={salaries}
            empty="No salary records have been issued yet."
            renderRow={(salary) => (
              <tr key={salary.id}>
                <Cell className="font-medium text-[#111827]">{salary.teacher_name}</Cell>
                <Cell>{salary.period}</Cell>
                <Cell>{formatMoney(salary.gross_amount)}</Cell>
                <Cell>{formatMoney(salary.net_amount)}</Cell>
                <Cell>
                  <Badge value={salary.status} />
                </Cell>
                <Cell>{formatDate(salary.paid_on)}</Cell>
                <Cell>
                  <div className="flex gap-2">
                    {salary.status !== "paid" ? (
                      <Button variant="secondary" onClick={() => markPaid(salary)}>
                        Mark paid
                      </Button>
                    ) : null}
                    <Button variant="danger" onClick={() => deleteSalary(salary)}>
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

export default AdminTeachersSection;
