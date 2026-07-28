"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Banner,
  Card,
  Cell,
  Field,
  Loading,
  SectionHeader,
  Select,
  StatCard,
  Table,
  errorMessage,
  formatDate,
  useStatus,
} from "@/components/portal/PortalUI";
import { studentService } from "@/services/studentService";

export function ResultsSection() {
  const { status, announce } = useStatus();
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({});
  const [term, setTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    studentService
      .getResults()
      .then((data) => {
        if (cancelled) return;
        setResults(data.results || []);
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

  const terms = useMemo(
    () => [...new Set(results.map((result) => result.term).filter(Boolean))],
    [results]
  );

  const visible = term ? results.filter((result) => result.term === term) : results;

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Results"
        description="Published by your subject teachers."
      />

      <Banner status={status} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Results published" value={summary.exams ?? 0} />
        <StatCard label="Overall average" value={`${summary.average ?? 0}%`} />
        <StatCard label="Best subject" value={summary.best_subject || "—"} />
      </div>

      <Card
        title="Exam results"
        action={
          terms.length ? (
            <Field label="Term">
              <Select
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                options={terms}
                placeholder="All terms"
              />
            </Field>
          ) : null
        }
      >
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={["Exam", "Subject", "Term", "Marks", "Grade", "Recorded by"]}
            rows={visible}
            empty="No results have been published for you yet."
            renderRow={(result) => (
              <tr key={result.id}>
                <Cell className="font-medium text-[#111827]">
                  {result.exam_title || "—"}
                </Cell>
                <Cell>{result.subject}</Cell>
                <Cell>{result.term || "—"}</Cell>
                <Cell>
                  {result.marks_obtained}/{result.total_marks} ({result.percentage}%)
                </Cell>
                <Cell className="font-semibold text-[#111827]">{result.grade}</Cell>
                <Cell>
                  {result.recorded_by || "—"}
                  <span className="block text-xs text-[#6b7280]">
                    {formatDate(result.recorded_at)}
                  </span>
                </Cell>
              </tr>
            )}
          />
        )}
      </Card>
    </div>
  );
}

export const StudentResultsSection = ResultsSection;

export default ResultsSection;
