
"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  BuildingIcon,
  CheckCircle,
  LogoMark,
  Presentation,
  ShieldKeyIcon,
} from "@/components/icons";
import { authService, ApiError } from "@/services/authService";

const ROLES = [
  {
    id: "student",
    label: "Student",
    description: "Access classes, assignments, grades, and attendance.",
    Icon: BookOpen,
  },
  {
    id: "teacher",
    label: "Teacher",
    description: "Manage classes, take attendance, and grade assignments.",
    Icon: Presentation,
  },
  {
    id: "administrator",
    label: "Administrator",
    description: "Oversee operations, admissions, fees, and staff.",
    Icon: BuildingIcon,
  },
];

const STEP_LABELS = {
  role: "Select Role",
  credentials: "Credentials",
  verify: "Verify Email",
};

export default function LoginScreen({ initialTab = "login" }) {
  const router = useRouter();
  const [step, setStep] = useState("role");
  const [role, setRole] = useState(null);
  const [mode, setMode] = useState(initialTab === "register" ? "register" : "login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);

  const orderedSteps = useMemo(() => ["role", "credentials", "verify"], []);
  const currentIndex = step === "done" ? 3 : orderedSteps.indexOf(step);

  // Countdown timer
  useEffect(() => {
    if (remainingTime <= 0) return;
    const timer = setTimeout(() => setRemainingTime(remainingTime - 1), 1000);
    return () => clearTimeout(timer);
  }, [remainingTime]);

  const goToDashboard = (userRole) => {
    router.replace(`/dashboard/${userRole}`);
  };

  const handleRoleNext = () => {
    if (!role) {
      setError("Please select a role to continue.");
      return;
    }
    setError(null);
    setStep("credentials");
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (mode === "register") {
      if (!firstName.trim() || !lastName.trim()) {
        setError("Please enter your first and last name.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (!agree) {
        setError("You must agree to the Terms of Service and Privacy Policy.");
        return;
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setError("Please enter your email and password.");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "register") {
        await authService.register({
          name: `${firstName} ${lastName}`,
          email,
          password,
          role,
        });
      } else {
        await authService.login({
          email,
          password,
          role,
        });
      }

      setStep("verify");
      setInfo("A 6-digit verification code has been sent to your email.");
      setRemainingTime(20);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleCodeBackspace = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handleVerifyCode = async (e) => {
    e?.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authService.verifyCode({
        email,
        code: fullCode,
      });

      const userRole = response.user?.role || role;
      goToDashboard(userRole);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.resendCode(email);
      setInfo("A new verification code has been sent to your email.");
      setCode(["", "", "", "", "", ""]);
      setRemainingTime(20);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to resend code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setCode(["", "", "", "", "", ""]);
    setError(null);
    setInfo(null);
    setStep("role");
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f7f9fb] px-5 py-8 sm:px-8">
      <div
        className="pointer-events-none absolute inset-0 [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,74,198,0.08)_0%,rgba(247,249,251,0)_60%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-[1100px] flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:gap-12">
        {/* Left panel */}
        <section className="hidden flex-1 flex-col justify-between gap-10 lg:flex">
          <Link href="/" className="inline-flex items-center gap-2">
            <LogoMark className="h-9 w-9 shrink-0" />
            <span className="[font-family:'Inter',Helvetica] text-2xl font-bold tracking-[-0.60px] text-[#191c1e]">
              CampusHub
            </span>
          </Link>
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-[#191c1e]">
              Secure access to your portal
            </h1>
            <p className="max-w-md [font-family:'Inter',Helvetica] text-base font-normal leading-[28.8px] text-[#434655]">
              Choose your role, enter your credentials, and verify your identity with email verification to reach your CampusHub dashboard.
            </p>
          </div>
          <ul className="flex flex-col gap-4">
            {[
              "Role-based access for students, teachers, and admins",
              "Password-protected accounts with email verification",
              "Secure access for staff, students, and parents",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#006c491a]">
                  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-[#006c49]" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p className="[font-family:'Inter',Helvetica] text-base font-normal leading-6 text-[#434655]">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Card */}
        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-[#e6e8ea] bg-white p-6 shadow-[0px_8px_10px_-6px_#0000001a,0px_20px_25px_-5px_#0000001a] sm:p-8">
            <div className="flex flex-col gap-6">
              <header className="flex flex-col items-center gap-3 text-center">
                <Link href="/" className="inline-flex items-center gap-2 lg:hidden">
                  <LogoMark className="h-9 w-9 shrink-0" />
                  <span className="[font-family:'Inter',Helvetica] text-2xl font-bold tracking-[-0.60px] text-[#191c1e]">
                    CampusHub
                  </span>
                </Link>
                <h2 className="text-2xl font-bold leading-8 tracking-[-0.02em] text-[#191c1e]">
                  {step === "role" && "Who are you logging in as?"}
                  {step === "credentials" && (mode === "login" ? "Enter your credentials" : "Create your account")}
                  {step === "verify" && "Verify Your Email"}
                  {step === "done" && "Login successful"}
                </h2>
                <p className="[font-family:'Inter',Helvetica] text-sm font-normal leading-[21px] text-[#434655]">
                  {step === "role" && "Select your role to access the right portal."}
                  {step === "credentials" && (mode === "login" ? "Enter your email and password to continue." : "Sign up to start managing your institution.")}
                  {step === "verify" && `We sent a 6-digit code to ${email || "your email"}.`}
                  {step === "done" && "Redirecting you to your dashboard..."}
                </p>
              </header>

              {/* Step indicator */}
              <ol className="flex items-center justify-center gap-2">
                {orderedSteps.map((s, i) => {
                  const active = step === s || (step === "done" && s === "verify");
                  const complete = currentIndex > i || step === "done";
                  return (
                    <li key={s} className="flex items-center gap-2">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                          complete
                            ? "bg-[#006c49] text-white"
                            : active
                              ? "bg-[#004ac6] text-white"
                              : "bg-[#f7f9fb] text-[#434655]"
                        }`}
                      >
                        {complete ? (
                          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          i + 1
                        )}
                      </span>
                      <span
                        className={`hidden text-xs font-medium sm:inline ${
                          active || complete ? "text-[#191c1e]" : "text-[#434655]"
                        }`}
                      >
                        {STEP_LABELS[s]}
                      </span>
                      {i < orderedSteps.length - 1 && (
                        <span className={`h-px w-6 ${complete ? "bg-[#006c49]" : "bg-[#c3c6d7]"}`} aria-hidden="true" />
                      )}
                    </li>
                  );
                })}
              </ol>

              {/* STEP: role */}
              {step === "role" && (
                <div className="flex flex-col gap-3">
                  {ROLES.map(({ id, label, description, Icon }) => {
                    const selected = role === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setRole(id);
                          setError(null);
                        }}
                        aria-pressed={selected}
                        className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                          selected
                            ? "border-[#004ac6] bg-[#004ac60d] ring-2 ring-[#004ac6]/20"
                            : "border-[#e6e8ea] bg-white hover:border-[#c3c6d7] hover:bg-[#f7f9fb]"
                        }`}
                      >
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-[#004ac6] text-white" : "bg-[#f7f9fb] text-[#004ac6]"}`}>
                          <Icon className="h-6 w-6" />
                        </span>
                        <span className="flex flex-1 flex-col gap-0.5">
                          <span className="text-base font-semibold leading-6 text-[#191c1e]">{label}</span>
                          <span className="[font-family:'Inter',Helvetica] text-sm font-normal leading-5 text-[#434655]">{description}</span>
                        </span>
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[#004ac6] bg-[#004ac6]" : "border-[#c3c6d7]"}`}>
                          {selected && (
                            <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 text-white" aria-hidden="true">
                              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                      </button>
                    );
                  })}

                  {error && (
                    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleRoleNext}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-base font-medium text-white shadow-[0px_2px_4px_-2px_#0000001a,0px_4px_6px_-1px_#0000001a] hover:bg-blue-700 transition-colors"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </button>
                </div>
              )}

              {/* STEP: credentials */}
              {step === "credentials" && (
                <>
                  <div className="grid grid-cols-2 gap-1 rounded-lg bg-[#f7f9fb] p-1">
                    {["login", "register"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleToggleMode()}
                        className={`rounded-md py-2 text-sm font-medium transition-colors ${
                          mode === m
                            ? "bg-white text-[#004ac6] shadow-[0px_1px_2px_#0000000d]"
                            : "text-[#434655] hover:text-[#191c1e]"
                        }`}
                      >
                        {m === "login" ? "Login" : "Register"}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4" noValidate>
                    {mode === "register" && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="firstName" className="[font-family:'Inter',Helvetica] text-sm font-medium leading-5 text-[#191c1e]">
                            First name
                          </label>
                          <input
                            id="firstName"
                            type="text"
                            autoComplete="given-name"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="John"
                            className="w-full rounded-lg border border-[#c3c6d7] bg-white px-4 py-3 text-base text-[#191c1e] placeholder:text-[#434655]/50 focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="lastName" className="[font-family:'Inter',Helvetica] text-sm font-medium leading-5 text-[#191c1e]">
                            Last name
                          </label>
                          <input
                            id="lastName"
                            type="text"
                            autoComplete="family-name"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Doe"
                            className="w-full rounded-lg border border-[#c3c6d7] bg-white px-4 py-3 text-base text-[#191c1e] placeholder:text-[#434655]/50 focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="[font-family:'Inter',Helvetica] text-sm font-medium leading-5 text-[#191c1e]">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@school.edu"
                        className="w-full rounded-lg border border-[#c3c6d7] bg-white px-4 py-3 text-base text-[#191c1e] placeholder:text-[#434655]/50 focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="password" className="[font-family:'Inter',Helvetica] text-sm font-medium leading-5 text-[#191c1e]">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete={mode === "login" ? "current-password" : "new-password"}
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-lg border border-[#c3c6d7] bg-white px-4 py-3 pr-12 text-base text-[#191c1e] placeholder:text-[#434655]/50 focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#434655] hover:text-[#191c1e]"
                        >
                          {showPassword ? (
                            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                              <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 4.2A9.5 9.5 0 0112 4c5 0 9 4.5 9 8a8.6 8.6 0 01-2.2 3.2M6.1 6.1C3.7 7.5 2 10 2 12c0 3.5 4 8 10 8 1.7 0 3.3-.4 4.7-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {mode === "register" && (
                      <>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="confirmPassword" className="[font-family:'Inter',Helvetica] text-sm font-medium leading-5 text-[#191c1e]">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                              id="confirmPassword"
                              type={showPassword ? "text" : "password"}
                              required
                              minLength={6}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full rounded-lg border border-[#c3c6d7] bg-white px-4 py-3 text-base text-[#191c1e] placeholder:text-[#434655]/50 focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
                            />
                          </div>
                        </div>

                        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#e6e8ea] bg-[#f7f9fb] px-4 py-3">
                          <input
                            type="checkbox"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6]"
                          />
                          <span className="[font-family:'Inter',Helvetica] text-sm font-normal leading-[21px] text-[#434655]">
                            I agree to the{" "}
                            <Link href="/terms" target="_blank" className="font-medium text-[#004ac6] hover:underline">
                              Terms of Service
                            </Link>
                            {" "}and{" "}
                            <Link href="/privacy" target="_blank" className="font-medium text-[#004ac6] hover:underline">
                              Privacy Policy
                            </Link>
                            .
                          </span>
                        </label>
                      </>
                    )}

                    {error && (
                      <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                      </div>
                    )}
                    {info && (
                      <div role="status" className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                        {info}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-base font-medium text-white shadow-[0px_2px_4px_-2px_#0000001a,0px_4px_6px_-1px_#0000001a] hover:bg-blue-700 disabled:opacity-60 transition-colors"
                    >
                      {loading ? "Processing..." : mode === "login" ? "Sign in" : "Create account"}
                      {!loading && <ArrowRight className="h-4 w-4 shrink-0" />}
                    </button>
                  </form>

                  <button
                    type="button"
                    onClick={() => {
                      setStep("role");
                      setError(null);
                      setInfo(null);
                    }}
                    className="self-center text-sm font-medium text-[#434655] hover:text-[#191c1e]"
                  >
                    Back to role selection
                  </button>
                </>
              )}

              {/* STEP: verify */}
              {step === "verify" && (
                <form onSubmit={handleVerifyCode} className="flex flex-col gap-5" noValidate>
                  <div className="flex justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#004ac60d]">
                      <ShieldKeyIcon className="h-7 w-7 text-[#004ac6]" />
                    </span>
                  </div>

                  {info && (
                    <div role="status" className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-center text-sm text-blue-700">
                      {info}
                    </div>
                  )}

                  <div className="flex justify-center gap-2 sm:gap-3">
                    {code.map((d, i) => (
                      <input
                        key={i}
                        id={`code-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={(e) => handleCodeChange(i, e.target.value)}
                        onKeyDown={(e) => handleCodeBackspace(i, e)}
                        aria-label={`Digit ${i + 1}`}
                        className="h-12 w-10 rounded-lg border border-[#c3c6d7] bg-white text-center text-xl font-semibold text-[#191c1e] focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20 sm:h-14 sm:w-12"
                      />
                    ))}
                  </div>

                  {error && (
                    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || code.join("").length !== 6}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-base font-medium text-white shadow-[0px_2px_4px_-2px_#0000001a,0px_4px_6px_-1px_#0000001a] hover:bg-blue-700 disabled:opacity-60 transition-colors"
                  >
                    {loading ? "Verifying..." : "Verify & sign in"}
                    {!loading && <ArrowRight className="h-4 w-4 shrink-0" />}
                  </button>

                  <div className="flex flex-col items-center gap-2 text-center">
                    <p className="[font-family:'Inter',Helvetica] text-sm font-normal leading-[21px] text-[#434655]">
                      Code expires in {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, "0")}
                    </p>
                    <p className="[font-family:'Inter',Helvetica] text-sm font-normal leading-[21px] text-[#434655]">
                      Didn&apos;t receive a code?{" "}
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={loading || remainingTime > 0}
                        className="font-medium text-[#004ac6] hover:underline disabled:opacity-60"
                      >
                        Resend code
                      </button>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setStep("credentials");
                        setError(null);
                        setInfo(null);
                      }}
                      className="text-sm font-medium text-[#434655] hover:text-[#191c1e]"
                    >
                      Back to credentials
                    </button>
                  </div>
                </form>
              )}

              {/* STEP: done */}
              {step === "done" && (
                <div className="flex flex-col items-center gap-5 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#006c491a]">
                    <CheckCircle className="h-9 w-9 text-[#006c49]" />
                  </span>
                  <p className="[font-family:'Inter',Helvetica] text-sm font-normal leading-[21px] text-[#434655]">
                    Redirecting you to your dashboard...
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
