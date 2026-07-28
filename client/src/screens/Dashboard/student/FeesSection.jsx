"use client";

import { useEffect, useState } from "react";

import {
  Badge,
  Banner,
  Card,
  Cell,
  Loading,
  SectionHeader,
  StatCard,
  Table,
  errorMessage,
  formatDate,
  formatMoney,
  useStatus,
} from "@/components/portal/PortalUI";
import { studentService } from "@/services/studentService";

export function FeesSection() {
  const { status, announce } = useStatus();
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    studentService
      .getFees()
      .then((data) => {
        if (cancelled) return;
        setFees(data.fees || []);
        setSummary(data.summary || {});
      })
      .catch((err) => {
        if (!cancelled) announce("error", errorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [announce]);

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Fees"
        description="Invoices issued by the school administration."
      />

      <Banner status={status} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total billed" value={formatMoney(summary.billed)} />
        <StatCard label="Paid" value={formatMoney(summary.paid)} />
        <StatCard label="Outstanding balance" value={formatMoney(summary.balance)} />
      </div>

      <Card title="Fee statement">
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={["Invoice", "Term", "Amount", "Paid", "Balance", "Due", "Status"]}
            rows={fees}
            empty="No fees have been issued to you yet."
            renderRow={(fee) => (
              <tr key={fee.id}>
                <Cell className="font-medium text-[#111827]">{fee.title}</Cell>
                <Cell>{fee.term || "—"}</Cell>
                <Cell>{formatMoney(fee.amount)}</Cell>
                <Cell>{formatMoney(fee.amount_paid)}</Cell>
                <Cell>{formatMoney(fee.balance)}</Cell>
                <Cell>{formatDate(fee.due_date)}</Cell>
                <Cell>
                  <Badge value={fee.status} />
                </Cell>
              </tr>
            )}
          />
        )}
      </Card>
    </div>
  );
}

export const StudentFeesSection = FeesSection;

export default FeesSection;
