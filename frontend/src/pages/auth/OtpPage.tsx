import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  User,
  Phone,
  IdCard,
  MapPin,
  Lock,
  ShieldCheck,
  Wrench,
  BriefcaseBusiness,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { authService } from "../../services/authService";

type OtpStatus = "idle" | "success" | "error";

export default function OtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<OtpStatus>("idle");
  const [message, setMessage] = useState("");
  const [accountDetails, setAccountDetails] = useState<Record<string, string>>({});
  const [securityDetails, setSecurityDetails] = useState<Record<string, string>>({});
  const [registrationRole, setRegistrationRole] = useState<string>("citizen");

  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }

    const storedAccount = localStorage.getItem("registrationAccount");
    const storedSecurity = localStorage.getItem("registrationSecurity");

    if (storedAccount) {
      try {
        const parsed = JSON.parse(storedAccount);
        setAccountDetails(parsed);
        if (parsed.role) {
          setRegistrationRole(parsed.role.toLowerCase());
        }
      } catch {
        setAccountDetails({ email });
      }
    } else {
      setAccountDetails({ email });
    }

    if (storedSecurity) {
      try {
        setSecurityDetails(JSON.parse(storedSecurity));
      } catch {
        setSecurityDetails({});
      }
    }
  }, [email, navigate]);

  useEffect(() => {
    if (status === "success" && accountDetails.role) {
      const role = accountDetails.role.toLowerCase();
      const dashboard =
        role === "technician"
          ? "/technician/dashboard"
          : role === "admin"
            ? "/admin/dashboard"
            : "/dashboard";

      const timer = setTimeout(() => navigate(dashboard), 1500);
      return () => clearTimeout(timer);
    }
  }, [status, accountDetails.role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setStatus("idle");
    setIsSubmitting(true);

    try {
      const data = await authService.verifyEmail(email, code, registrationRole);
      setStatus("success");
      setMessage(data.message);
      localStorage.removeItem("registrationAccount");
      localStorage.removeItem("registrationSecurity");
    } catch (err) {
      setStatus("error");
      const error = err as { response?: { data?: { message?: string } } };
      setMessage(error.response?.data?.message ?? "Wrong OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setMessage("");
    setStatus("idle");
    setIsSubmitting(true);
    try {
      await authService.resendVerification(email, registrationRole);
      setMessage("A new verification code has been sent to your email.");
    } catch {
      setMessage("Could not resend code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const InfoRow = ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value: string;
    icon: typeof User;
  }) => (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-slate-700 shadow-sm">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <p className="mt-0.5 truncate text-sm font-bold text-slate-950">{value || "—"}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 rounded-md px-3 py-2 font-semibold text-slate-700 transition hover:bg-white"
        >
          <ArrowLeft size={18} />
          Home
        </button>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <section className="space-y-4">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <User size={20} className="text-sky-600" />
                <h2 className="text-lg font-bold text-slate-950">Account</h2>
              </div>
              <div className="grid gap-3">
                <InfoRow label="Full Name" value={accountDetails.name || ""} icon={User} />
                <InfoRow label="Email" value={accountDetails.email || email} icon={Mail} />
                <InfoRow label="Phone" value={accountDetails.phone || ""} icon={Phone} />
                <InfoRow label="Role" value={accountDetails.role || ""} icon={BriefcaseBusiness} />
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-950">Details</h2>
              </div>
              <div className="grid gap-3">
                <InfoRow
                  label={accountDetails.role === "technician" ? "Official ID" : "NID"}
                  value={accountDetails.nid || ""}
                  icon={IdCard}
                />
                <InfoRow label="Service Area" value={accountDetails.area || ""} icon={MapPin} />
                {accountDetails.role === "technician" && (
                  <>
                    <InfoRow label="Specialization" value={accountDetails.skill || ""} icon={Wrench} />
                    <InfoRow label="Experience" value={accountDetails.experience || ""} icon={BriefcaseBusiness} />
                  </>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Lock size={20} className="text-amber-600" />
                <h2 className="text-lg font-bold text-slate-950">Security</h2>
              </div>
              <div className="grid gap-3">
                <InfoRow label="Password" value={securityDetails.password ? "••••••••" : ""} icon={ShieldCheck} />
                <InfoRow
                  label="Password Strength"
                  value={securityDetails.passwordStrength || ""}
                  icon={Lock}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm lg:p-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100">
                <Mail className="text-sky-600" size={24} />
              </div>
              <h1 className="text-2xl font-bold">Verify Your Email</h1>
              <p className="mt-2 text-slate-600">
                Enter the 6-digit verification code sent to <span className="font-semibold text-slate-950">{email}</span>.
              </p>
            </div>

            {status === "success" && (
              <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  {message}
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  Redirecting to your dashboard...
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">
                <div className="flex items-center gap-2">
                  <XCircle size={18} />
                  {message}
                </div>
              </div>
            )}

            {message && status !== "error" && status !== "success" && (
              <div className="mt-6 rounded-lg bg-sky-50 p-4 text-sm font-semibold text-sky-700">
                {message}
              </div>
            )}

            {status !== "success" && (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Verification Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    pattern="\d{6}"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-2xl font-bold tracking-widest outline-none focus:border-sky-500"
                  />
                  <p className="mt-1 text-xs text-slate-500">Enter the 6-digit code from your email</p>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || code.length !== 6}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Verifying..." : "Verify Code"}
                </button>
              </form>
            )}

            <div className="mt-6 flex items-center justify-between text-center text-sm text-slate-600">
              <p>
                Didn't receive the code?{" "}
                <button
                  onClick={handleResend}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1 font-semibold text-sky-700 hover:text-sky-900 disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isSubmitting ? "animate-spin" : ""} />
                  Resend
                </button>
              </p>
              <Link to="/user/login" className="font-semibold text-sky-700 hover:text-sky-900">
                Back to Login
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
