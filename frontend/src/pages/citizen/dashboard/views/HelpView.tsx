import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ClipboardList,
  Clock3,
  Headphones,
  HelpCircle,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Star,
  User,
  WalletCards,
  Wifi,
  Wrench,
  X,
} from "lucide-react";

type SupportMode = "contact" | "issue" | "feedback" | null;

type SupportForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const supportPhone = "01761112352";
const supportEmail = "support@dqss.com";

const faqs = [
  {
    question: "How do I submit a new complaint?",
    answer: "Go to New Complaint, choose the utility type, add your location and details, then submit. You will receive a digital token right away.",
    category: "Complaints",
  },
  {
    question: "How can I check my complaint status?",
    answer: "Open My Complaints from the sidebar. Each complaint shows its status, priority, queue position, and assigned technician when available.",
    category: "Complaints",
  },
  {
    question: "What is a digital token and how does it work?",
    answer: "A digital token is your complaint tracking number. Use it to identify your request and follow updates without calling support.",
    category: "Technical Issues",
  },
  {
    question: "How is a technician assigned to my complaint?",
    answer: "The system and admin team match your complaint type, area, priority, and technician availability before assignment.",
    category: "Technician & Service",
  },
  {
    question: "How can I track the technician on the map?",
    answer: "Open Live Map after a technician is assigned. If live location is available, you will see the complaint and technician markers.",
    category: "Technician & Service",
  },
  {
    question: "What should I do in an emergency?",
    answer: `For urgent safety hazards, call ${supportPhone} immediately and also submit an Emergency priority complaint so the team can track it.`,
    category: "Others",
  },
];

const categories = [
  { label: "Account & Profile", note: "Login, profile, settings", icon: User, bg: "bg-blue-50", color: "text-blue-700" },
  { label: "Complaints", note: "Submit, update, track", icon: ClipboardList, bg: "bg-emerald-50", color: "text-emerald-700" },
  { label: "Technician & Service", note: "Assignment, ETA, visit", icon: Wrench, bg: "bg-violet-50", color: "text-violet-700" },
  { label: "Payments", note: "Billing, receipts, refunds", icon: WalletCards, bg: "bg-blue-50", color: "text-blue-700" },
  { label: "Technical Issues", note: "App, errors, bugs", icon: Wifi, bg: "bg-purple-50", color: "text-purple-700" },
  { label: "Others", note: "General questions", icon: MoreHorizontal, bg: "bg-slate-50", color: "text-slate-700" },
];

const emptyForm: SupportForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function storeSupportRequest(type: Exclude<SupportMode, null>, form: SupportForm) {
  const key = "smartUtilitySupportRequests";
  const previous = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(
    key,
    JSON.stringify([
      {
        id: crypto.randomUUID(),
        type,
        ...form,
        createdAt: new Date().toISOString(),
      },
      ...previous,
    ]),
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-950">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function HelpView() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState(faqs[0].question);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [activeModal, setActiveModal] = useState<SupportMode>(null);
  const [form, setForm] = useState(emptyForm);
  const [formMessage, setFormMessage] = useState("");

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchesCategory = !selectedCategory || faq.category === selectedCategory;
      const matchesSearch =
        !query ||
        [faq.question, faq.answer, faq.category].join(" ").toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const visibleFaqs = showAllFaqs ? filteredFaqs : filteredFaqs.slice(0, 6);

  const openSupportModal = (mode: Exclude<SupportMode, null>) => {
    setForm(emptyForm);
    setFormMessage("");
    setActiveModal(mode);
  };

  const submitSupportForm = (event: FormEvent) => {
    event.preventDefault();
    if (!activeModal) return;

    storeSupportRequest(activeModal, form);
    setFormMessage(
      activeModal === "feedback"
        ? "Thanks for your feedback. We saved it for the support team."
        : "Your request has been saved. Support will follow up soon.",
    );
    setForm(emptyForm);
  };

  const modalTitle =
    activeModal === "issue"
      ? "Report an Issue"
      : activeModal === "feedback"
        ? "Send Feedback"
        : "Contact Support Team";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <Headphones size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950">Help & Support</h1>
            <p className="mt-1 text-slate-500">We're here to help you. Find answers or get in touch.</p>
          </div>
        </div>
        <div className="flex w-full items-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm lg:w-80">
          <Search size={20} className="text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search for help..."
            className="w-full px-3 py-4 text-sm font-semibold outline-none"
          />
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/60 to-blue-100/70 shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_260px] lg:p-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-950">How can we help you today?</h2>
            <p className="mt-2 text-slate-600">Choose a support option below or search for answers.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <a
                href="/dashboard/messages"
                onClick={(event) => {
                  event.preventDefault();
                  navigate("/dashboard/messages");
                }}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <MessageCircle size={24} />
                  </span>
                  <div>
                    <p className="font-extrabold text-slate-950">Live Chat</p>
                    <p className="mt-1 text-sm text-slate-500">Chat with our team</p>
                  </div>
                </div>
              </a>
              <a
                href={`tel:${supportPhone}`}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Phone size={24} />
                  </span>
                  <div>
                    <p className="font-extrabold text-slate-950">Call Support</p>
                    <p className="mt-1 text-sm text-slate-500">{supportPhone}</p>
                  </div>
                </div>
              </a>
              <a
                href={`mailto:${supportEmail}?subject=Smart Utility Support Request`}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
                    <Mail size={24} />
                  </span>
                  <div>
                    <p className="font-extrabold text-slate-950">Email Support</p>
                    <p className="mt-1 text-sm text-slate-500">{supportEmail}</p>
                  </div>
                </div>
              </a>
              <button
                type="button"
                onClick={() => openSupportModal("contact")}
                className="rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                    <Clock3 size={24} />
                  </span>
                  <div>
                    <p className="font-extrabold text-slate-950">Support Hours</p>
                    <p className="mt-1 text-sm text-slate-500">8 AM - 10 PM</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="hidden items-end justify-center lg:flex">
            <div className="relative h-44 w-52">
              <div className="absolute bottom-0 left-5 h-24 w-40 rounded-t-[3rem] bg-blue-100" />
              <div className="absolute left-16 top-2 h-16 w-16 rounded-full bg-[#ffd0b0]" />
              <div className="absolute left-14 top-0 h-10 w-20 rounded-t-[2rem] bg-slate-800" />
              <div className="absolute left-22 top-23 h-16 w-24 rounded-t-3xl bg-blue-600" />
              <div className="absolute left-28 top-10 h-8 w-12 rounded-r-full border-4 border-blue-700 border-l-0" />
              <div className="absolute left-12 top-24 h-20 w-32 rounded-t-2xl bg-slate-400 shadow-lg" />
              <div className="absolute right-0 top-8 rounded-2xl bg-blue-500 px-4 py-2 text-white shadow-md">
                <span className="text-lg font-bold">...</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.95fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-950">Frequently Asked Questions</h2>
            <button
              type="button"
              onClick={() => setShowAllFaqs((current) => !current)}
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
            >
              {showAllFaqs ? "Show less" : "View all FAQs"}
              <ArrowRight size={15} />
            </button>
          </div>
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
            {visibleFaqs.map((faq) => {
              const isOpen = openFaq === faq.question;
              return (
                <div key={faq.question} className="border-b border-slate-200 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? "" : faq.question)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left font-bold text-slate-800 transition hover:bg-slate-50"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={18} className={`shrink-0 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && <p className="px-4 pb-4 text-sm leading-6 text-slate-600">{faq.answer}</p>}
                </div>
              );
            })}
          </div>
          {!visibleFaqs.length && (
            <div className="mt-5 rounded-xl bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
              No help articles match your search.
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-950">Support Categories</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {categories.map(({ label, note, icon: Icon, bg, color }) => {
              const selected = selectedCategory === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(selected ? null : label);
                    setShowAllFaqs(true);
                  }}
                  className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                    selected ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}>
                      <Icon size={23} className={color} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-slate-950">{label}</p>
                      <p className="mt-1 text-sm text-slate-500">{note}</p>
                    </div>
                    <ArrowRight size={16} className={selected ? "text-blue-700" : "text-slate-400"} />
                  </div>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(null);
              setSearch("");
              setShowAllFaqs(true);
            }}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 py-3 text-sm font-extrabold text-blue-700 transition hover:bg-blue-50"
          >
            Browse all categories
            <ArrowRight size={16} />
          </button>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck size={24} />
                </span>
                <h3 className="text-lg font-extrabold text-emerald-800">Need Immediate Assistance?</h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">For urgent issues like outage, leakage, or safety hazards, contact our 24/7 helpline.</p>
              <a
                href={`tel:${supportPhone}`}
                className="mt-5 inline-flex items-center gap-3 rounded-xl bg-white px-4 py-3 font-extrabold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
              >
                <Phone size={18} />
                {supportPhone}
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">24/7 Available</span>
              </a>
            </div>
            <div className="hidden h-24 w-20 items-center justify-center rounded-[2rem] bg-emerald-600 text-xl font-extrabold text-white shadow-lg sm:flex">
              24/7
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-violet-100 bg-violet-50 p-6 shadow-sm">
          <div className="flex h-full flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <AlertTriangle size={24} />
                </span>
                <h3 className="text-lg font-extrabold text-violet-800">Report an Issue</h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">Facing a problem with the app or service? Report it to us.</p>
            </div>
            <button
              type="button"
              onClick={() => openSupportModal("issue")}
              className="flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-3 font-extrabold text-violet-700 transition hover:bg-violet-100"
            >
              Report Now
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-6 shadow-sm">
          <div className="flex h-full flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <Star size={24} />
                </span>
                <h3 className="text-lg font-extrabold text-orange-800">Provide Feedback</h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">Help us improve. Share your feedback and suggestions.</p>
            </div>
            <button
              type="button"
              onClick={() => openSupportModal("feedback")}
              className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-3 font-extrabold text-orange-700 transition hover:bg-orange-100"
            >
              Send Feedback
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <HelpCircle size={24} />
            </span>
            <div>
              <h3 className="text-lg font-extrabold text-slate-950">Still Need Help?</h3>
              <p className="mt-1 text-sm text-slate-500">Our support team is ready to assist you. Reach out and we'll get back to you as soon as possible.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openSupportModal("contact")}
            className="inline-flex items-center justify-center gap-3 rounded-xl bg-blue-700 px-8 py-4 font-extrabold text-white shadow-sm transition hover:bg-blue-800"
          >
            Contact Support Team
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {activeModal && (
        <Modal title={modalTitle} onClose={() => setActiveModal(null)}>
          <form onSubmit={submitSupportForm} className="space-y-4 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-bold text-slate-700">
                Name
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  required
                />
              </label>
              <label className="block text-sm font-bold text-slate-700">
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  required
                />
              </label>
            </div>
            <label className="block text-sm font-bold text-slate-700">
              Subject
              <input
                value={form.subject}
                onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              Message
              <textarea
                value={form.message}
                onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />
            </label>
            {formMessage && <p className="rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{formMessage}</p>}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-bold text-white transition hover:bg-blue-800"
              >
                <Send size={17} />
                Submit
              </button>
              <a
                href={`mailto:${supportEmail}?subject=${encodeURIComponent(form.subject || modalTitle)}&body=${encodeURIComponent(form.message)}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <Mail size={17} />
                Email Instead
              </a>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
