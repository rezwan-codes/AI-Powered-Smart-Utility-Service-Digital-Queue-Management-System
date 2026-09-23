import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  Eye,
  EyeOff,
  IdCard,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShieldCheck,
  User,
  UserPlus,
  Wrench,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Zap,
  ClipboardList,
  Ticket,
  Navigation,
} from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

type Role = "user" | "technician" | "admin";
type Mode = "login" | "register";
type RegistrationStep = "basic" | "details" | "security";

const roleContent: Record<
  Role,
  {
    title: string;
    subtitle: string;
    dashboardPath: string;
    icon: typeof User;
    accent: string;
    demoEmail: string;
    demoPassword: string;
  }
> = {
  user: {
    title: "User",
    subtitle: "Submit complaints and track your digital queue token.",
    dashboardPath: "/dashboard",
    icon: User,
    accent: "bg-sky-600 hover:bg-sky-700",
    demoEmail: "citizen@smartutility.local",
    demoPassword: "password123",
  },
  technician: {
    title: "Technician",
    subtitle: "View assigned jobs, ETA, and emergency service requests.",
    dashboardPath: "/technician/dashboard",
    icon: Wrench,
    accent: "bg-emerald-600 hover:bg-emerald-700",
    demoEmail: "aminul@smartutility.local",
    demoPassword: "password123",
  },
  admin: {
    title: "Admin",
    subtitle: "Monitor complaints, technicians, alerts, and service performance.",
    dashboardPath: "/admin/dashboard",
    icon: Building2,
    accent: "bg-slate-950 hover:bg-slate-800",
    demoEmail: "admin@smartutility.local",
    demoPassword: "password123",
  },
};

const roleToStorage: Record<Role, string> = {
  user: "citizen",
  technician: "technician",
  admin: "admin",
};

function normalizeRole(role?: string): Role {
  if (role === "technician" || role === "admin") {
    return role;
  }
  return "user";
}

function normalizeMode(mode?: string): Mode {
  return mode === "register" ? "register" : "login";
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  nid?: string;
  area?: string;
  skill?: string;
  experience?: string;
  password?: string;
  confirmPassword?: string;
}

interface FormTouched {
  name?: boolean;
  email?: boolean;
  phone?: boolean;
  nid?: boolean;
  area?: boolean;
  skill?: boolean;
  experience?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "bg-slate-200" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score === 2) return { score, label: "Fair", color: "bg-orange-500" };
  if (score === 3) return { score, label: "Good", color: "bg-yellow-500" };
  if (score === 4) return { score, label: "Strong", color: "bg-sky-500" };
  return { score, label: "Excellent", color: "bg-emerald-500" };
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^\+?[\d\s-]{10,}$/.test(phone);
}

export default function AuthPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { setSession } = useAuth();
  const role = normalizeRole(params.role);
  const mode = normalizeMode(params.mode);
  const content = roleContent[role];
  const RoleIcon = content.icon;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<FormTouched>({});
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>("basic");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nid: "",
    area: "",
    skill: "electricity",
    experience: "",
    password: "",
    confirmPassword: "",
  });

  const isRegister = mode === "register";

  const passwordStrength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password]
  );

  const errors: FormErrors = useMemo(() => {
    const errs: FormErrors = {};

    if (touched.name && isRegister && !formData.name.trim()) {
      errs.name = "Full name is required";
    }

    if (touched.email) {
      if (!formData.email.trim()) {
        errs.email = "Email is required";
      } else if (!validateEmail(formData.email)) {
        errs.email = "Please enter a valid email address";
      }
    }

    if (isRegister && touched.phone) {
      if (!formData.phone.trim()) {
        errs.phone = "Phone number is required";
      } else if (!validatePhone(formData.phone)) {
        errs.phone = "Please enter a valid phone number";
      }
    }

    if (isRegister && touched.nid && !formData.nid.trim()) {
      errs.nid = role === "user" ? "NID is required" : "Official ID is required";
    }

    if (isRegister && touched.area && !formData.area.trim()) {
      errs.area = "Service area is required";
    }

    if (isRegister && role === "technician" && touched.skill && !formData.skill) {
      errs.skill = "Please select a specialization";
    }

    if (isRegister && role === "technician" && touched.experience && !formData.experience.trim()) {
      errs.experience = "Experience is required";
    }

    if (touched.password) {
      if (!formData.password) {
        errs.password = "Password is required";
      } else if (formData.password.length < 6) {
        errs.password = "Password must be at least 6 characters";
      }
    }

    if (isRegister && touched.confirmPassword) {
      if (!formData.confirmPassword) {
        errs.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        errs.confirmPassword = "Passwords do not match";
      }
    }

    return errs;
  }, [touched, formData, isRegister, role]);

  const isStepValid = useCallback(
    (step: RegistrationStep): boolean => {
      if (!isRegister) return true;

      switch (step) {
        case "basic":
          return !!(
            formData.name.trim() &&
            formData.email.trim() &&
            validateEmail(formData.email)
          );
        case "details":
          if (role === "technician") {
            return !!(formData.phone.trim() && formData.nid.trim() && formData.area.trim());
          }
          return !!(formData.phone.trim() && formData.nid.trim() && formData.area.trim());
        case "security":
          return !!(
            formData.password &&
            formData.password.length >= 6 &&
            formData.confirmPassword &&
            formData.password === formData.confirmPassword
          );
        default:
          return false;
      }
    },
    [formData, isRegister, role]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setTouched((prev) => ({ ...prev, [name]: true }));
      setError("");
    },
    []
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
    },
    []
  );

  const handleNextStep = useCallback(() => {
    setTouched((prev) => ({ ...prev, ...getCurrentStepFields(registrationStep) }));
    if (isStepValid(registrationStep)) {
      const nextStep: RegistrationStep =
        registrationStep === "basic"
          ? "details"
          : registrationStep === "details"
            ? "security"
            : "security";
      setRegistrationStep(nextStep);
    }
  }, [registrationStep, isStepValid]);

  const handlePrevStep = useCallback(() => {
    const prevStep: RegistrationStep =
      registrationStep === "security"
        ? "details"
        : registrationStep === "details"
          ? "basic"
          : "basic";
    setRegistrationStep(prevStep);
  }, [registrationStep]);

  const handleDemoLogin = useCallback(async () => {
    setError("");
    setIsSubmitting(true);
    try {
      const data = await authService.login({
        email: content.demoEmail,
        password: content.demoPassword,
        role: roleToStorage[role],
      });
      setSession(data.user, data.token);
      localStorage.setItem("role", roleToStorage[role]);
      navigate(content.dashboardPath);
    } catch (requestError) {
      const errorResponse = requestError as {
        response?: { data?: { message?: string } };
      };
      setError(
        errorResponse.response?.data?.message ??
          "Demo login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [content, role, navigate]);

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const allTouched: FormTouched = {
      name: true,
      email: true,
      phone: true,
      nid: true,
      area: true,
      skill: true,
      experience: true,
      password: true,
      confirmPassword: true,
    };
    setTouched(allTouched);

    try {
      if (isRegister) {
        if (formData.password !== formData.confirmPassword) {
          setError("Password and confirm password do not match.");
          return;
        }

        const data = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: roleToStorage[role] as "citizen" | "technician" | "admin",
          skill: formData.skill as "water" | "gas" | "electricity",
          area: formData.area,
        });

        if (data.requiresVerification) {
          const accountPayload = {
            name: formData.name,
            email: data.email ?? formData.email,
            phone: formData.phone,
            role: roleToStorage[role],
            nid: formData.nid,
            area: formData.area,
            skill: formData.skill,
            experience: formData.experience,
          };
          const securityPayload = {
            password: formData.password,
            passwordStrength: passwordStrength.label,
          };
          localStorage.setItem("registrationAccount", JSON.stringify(accountPayload));
          localStorage.setItem("registrationSecurity", JSON.stringify(securityPayload));
          navigate(`/otp-verify?email=${encodeURIComponent(data.email ?? formData.email)}`);
          return;
        }

        if (data.token) {
          localStorage.setItem("smartUtilityToken", data.token);
        }
      } else {
        const data = await authService.login({
          email: formData.email,
          password: formData.password,
          role: roleToStorage[role],
        });
        setSession(data.user, data.token);
      }

      localStorage.setItem("role", roleToStorage[role]);
      navigate(content.dashboardPath);
    } catch (requestError) {
      const errorResponse = requestError as {
        response?: { data?: { message?: string } };
      };
      setError(
        errorResponse.response?.data?.message ??
          "Could not connect to the backend. Please make sure the API is running."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const registrationSteps: { key: RegistrationStep; label: string; description: string }[] = [
    { key: "basic", label: "Account", description: "Basic information" },
    { key: "details", label: "Details", description: "Contact & location" },
    { key: "security", label: "Security", description: "Password setup" },
  ];

  const currentStepIndex = registrationSteps.findIndex((s) => s.key === registrationStep);

  const leftContent = (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative flex h-full flex-col justify-between rounded-3xl bg-gradient-to-br from-[#061A40] via-[#0B1F5E] to-[#061A40] p-8 text-white lg:rounded-l-3xl lg:rounded-r-none lg:p-10"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{ backgroundImage: "url('/images/login page.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#061A40]/30 via-[#0B1F5E]/30 to-[#061A40]/30" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="Smart Utility"
            className="h-12 w-12 rounded-xl object-cover shadow-lg shadow-blue-500/30 ring-2 ring-white"
          />
          <div>
            <p className="text-lg font-bold text-white">Smart Utility</p>
            <p className="text-xs text-slate-300">Digital Queue System</p>
          </div>
        </div>
      </div>

      <div className="relative mt-10">
        <h2 className="text-3xl font-bold leading-tight lg:text-4xl">
          <span className="block bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Welcome Back
          </span>
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-200 lg:text-base">
          Continue managing your utility services with one secure account. Submit complaints, receive digital queue tokens, track progress in real time, and stay connected with your assigned technician—all from one modern platform.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-1 lg:grid-cols-1">
          {[
            { title: "Digital Queue", copy: "Receive instant digital tokens.", Icon: Ticket },
            { title: "Live Tracking", copy: "Track complaint progress anytime.", Icon: Navigation },
            { title: "Fast & Secure", copy: "Reliable and secure platform for every citizen.", Icon: Shield },
          ].map(({ title, copy, Icon }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Icon size={20} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-slate-300">{copy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Trusted by Citizens Across Bangladesh
        </div>
      </div>
    </motion.div>
  );

  const rightContent = (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
      className="flex items-center justify-center rounded-3xl bg-white p-6 sm:p-8 lg:rounded-r-3xl lg:rounded-l-none lg:p-10"
    >
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
            {content.title} access
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {isRegister ? "Create your account" : "Sign In"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {isRegister
              ? "Complete the steps to register your account."
              : "Sign in to access your Smart Utility account."}
          </p>
        </div>

        <form onSubmit={submitForm} className="space-y-5">
          {isRegister && registrationStep === "basic" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Your full name"
                    className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
                  />
                </div>
                {touched.name && errors.name && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <XCircle size={14} /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    name="email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="name@example.com"
                    className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <XCircle size={14} /> {errors.email}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={!isStepValid("basic")}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 disabled:opacity-50"
              >
                Continue
                <ArrowLeft size={18} className="rotate-180" />
              </button>
            </>
          )}

          {isRegister && registrationStep === "details" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Phone Number</label>
                <div className="relative mt-2">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="+880 17XX-XXXXXX"
                    className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
                  />
                </div>
                {touched.phone && errors.phone && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <XCircle size={14} /> {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  {role === "technician" ? "Technician ID" : role === "admin" ? "Authority ID" : "NID"}
                </label>
                <div className="relative mt-2">
                  <IdCard className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    name="nid"
                    required
                    value={formData.nid}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder={role === "user" ? "National ID" : "Official ID"}
                    className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
                  />
                </div>
                {touched.nid && errors.nid && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <XCircle size={14} /> {errors.nid}
                  </p>
                )}
              </div>

              {role === "technician" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Specialization</label>
                    <select
                      name="skill"
                      required
                      value={formData.skill}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className="mt-2 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
                    >
                      <option value="electricity">Electricity</option>
                      <option value="water">Water</option>
                      <option value="gas">Gas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Experience</label>
                    <div className="relative mt-2">
                      <BriefcaseBusiness className="absolute left-3 top-3 text-slate-400" size={20} />
                      <input
                        name="experience"
                        required
                        value={formData.experience}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="3 years"
                        className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700">Service Area</label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    name="area"
                    required
                    value={formData.area}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Dhanmondi, Mirpur, Uttara"
                    className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
                  />
                </div>
                {touched.area && errors.area && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <XCircle size={14} /> {errors.area}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!isStepValid("details")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:shadow-xl disabled:opacity-50"
                >
                  Continue
                  <ArrowLeft size={18} className="rotate-180" />
                </button>
              </div>
            </>
          )}

          {isRegister && registrationStep === "security" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    name="password"
                    required
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Create a strong password"
                    className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-3 text-slate-500 transition hover:text-slate-800"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full transition-all ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs font-semibold text-slate-600">{passwordStrength.label}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">Confirm Password</label>
                <div className="relative mt-2">
                  <ShieldCheck className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    name="confirmPassword"
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Confirm your password"
                    className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    className="absolute right-3 top-3 text-slate-500 transition hover:text-slate-800"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isStepValid("security")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold text-white shadow-lg transition ${content.accent} disabled:opacity-50`}
                >
                  {isSubmitting ? "Please wait..." : <>Complete Registration</>}
                </button>
              </div>
            </>
          )}

          {!isRegister && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    name="email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="name@example.com"
                    className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <XCircle size={14} /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    name="password"
                    required
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter password"
                    className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-3 text-slate-500 transition hover:text-slate-800"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-semibold text-white shadow-lg transition hover:shadow-xl hover:-translate-y-0.5 ${content.accent} disabled:opacity-50`}
              >
                {isSubmitting ? "Signing in..." : <>Sign In</>}
              </button>
            </>
          )}

          {isRegister && (
            <>
              {error && (
                <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}
              {!isSubmitting && !error && Object.keys(errors).length > 0 && (
                <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                  Please fix the errors above before continuing.
                </div>
              )}
            </>
          )}
        </form>

        {!isRegister && (
          <div className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              to={`/${role}/register`}
              className="font-semibold text-sky-700 transition hover:text-sky-800"
            >
              Create an Account
            </Link>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { title: "Secure Login", Icon: ShieldCheck, copy: "Your account is protected." },
            { title: "Real-Time Updates", Icon: CheckCircle2, copy: "Track complaints instantly." },
            { title: "Trusted Platform", Icon: ClipboardList, copy: "Reliable digital public service." },
          ].map(({ title, Icon, copy }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center transition hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                <Icon size={20} />
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-900">{title}</p>
              <p className="text-xs text-slate-500">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-screen flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="order-2 lg:order-1 lg:w-[45%]">{leftContent}</div>
          <div className="order-1 lg:order-2 lg:w-[55%]">{rightContent}</div>
        </div>
      </div>
    </main>
  );
}

function getCurrentStepFields(step: RegistrationStep): FormTouched {
  switch (step) {
    case "basic":
      return { name: true, email: true };
    case "details":
      return { phone: true, nid: true, area: true, skill: true, experience: true };
    case "security":
      return { password: true, confirmPassword: true };
    default:
      return {};
  }
}
