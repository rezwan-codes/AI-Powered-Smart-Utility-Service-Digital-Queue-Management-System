import { useEffect, useMemo, useState, type DragEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleHelp,
  CloudUpload,
  Droplets,
  FileText,
  Flame,
  Gauge,
  Lightbulb,
  Loader,
  LocateFixed,
  Lock,
  MapPin,
  MoreHorizontal,
  Navigation,
  PhoneCall,
  Save,
  Send,
  ShieldCheck,
  Trash2,
  UserCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { complaintService } from "../../../../services/complaintService";
import { locationService } from "../../../../services/locationService";
import { technicianService } from "../../../../services/technicianService";
import type { Complaint, ComplaintPriority, Technician, UtilityType } from "../../../../types/utility";
import { formatDistance, formatEta } from "../../../../utils/utilityDisplay";
import MapTracker from "../../../../components/map/MapTracker";

type FormStep = "details" | "location" | "priority" | "review";

type ComplaintForm = {
  type: UtilityType;
  priority: ComplaintPriority;
  subject: string;
  area: string;
  address: string;
  description: string;
  photo: File | null;
};

type ServiceOption = {
  type: UtilityType;
  label: string;
  Icon: LucideIcon;
  iconClass: string;
  iconBg: string;
};

const initialForm: ComplaintForm = {
  type: "Electricity",
  priority: "Normal",
  subject: "",
  area: "",
  address: "",
  description: "",
  photo: null,
};

const serviceOptions: ServiceOption[] = [
  { type: "Electricity", label: "Electricity", Icon: Zap, iconClass: "text-blue-600", iconBg: "bg-blue-100" },
  { type: "Water", label: "Water", Icon: Droplets, iconClass: "text-sky-600", iconBg: "bg-sky-100" },
  { type: "Gas", label: "Gas", Icon: Flame, iconClass: "text-orange-600", iconBg: "bg-orange-100" },
  { type: "Waste", label: "Waste", Icon: Trash2, iconClass: "text-emerald-600", iconBg: "bg-emerald-100" },
  { type: "Streetlight", label: "Streetlight", Icon: Lightbulb, iconClass: "text-violet-600", iconBg: "bg-violet-100" },
  { type: "Others", label: "Others", Icon: MoreHorizontal, iconClass: "text-slate-600", iconBg: "bg-slate-100" },
];

const progressSteps: Array<{ key: FormStep; title: string; description: string }> = [
  { key: "details", title: "Details", description: "Provide complaint details" },
  { key: "location", title: "Location", description: "Set exact location on map" },
  { key: "priority", title: "Priority", description: "Select issue priority level" },
  { key: "review", title: "Review", description: "Review and confirm" },
];

const priorityConfig: Record<ComplaintPriority, { label: string; helper: string; className: string }> = {
  Normal: {
    label: "Normal",
    helper: "Standard response",
    className: "border-slate-200 bg-white text-slate-700",
  },
  High: {
    label: "High",
    helper: "Affects multiple users",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  Emergency: {
    label: "Emergency",
    helper: "Critical safety hazard",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

function getStepIndex(step: FormStep) {
  return progressSteps.findIndex((item) => item.key === step);
}

function getNextStep(step: FormStep): FormStep {
  return progressSteps[Math.min(getStepIndex(step) + 1, progressSteps.length - 1)].key;
}

function FieldIcon({ children }: { children: ReactNode }) {
  return <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">{children}</span>;
}

export default function NewComplaintView() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<FormStep>("details");
  const [form, setForm] = useState<ComplaintForm>(initialForm);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    technicianService
      .list()
      .then((data) => setTechnicians(data.technicians))
      .catch(() => setTechnicians([]));
  }, []);

  const selectedService = serviceOptions.find((item) => item.type === form.type) ?? serviceOptions[0];
  const currentStepNumber = getStepIndex(currentStep) + 1;
  const descriptionCount = form.description.length;
  const isDetailsValid =
    form.subject.trim().length > 0 && form.area.trim().length > 0 && form.description.trim().length >= 10;

  const assignedTechnician = useMemo(
    () => technicians.find((technician) => technician.skill === form.type && technician.status === "Active"),
    [form.type, technicians],
  );

  const updateField = <Key extends keyof ComplaintForm>(field: Key, value: ComplaintForm[Key]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const applySelectedLocation = async (coords: { lat: number; lng: number }, updateArea = false) => {
    setSelectedLocation(coords);
    setCurrentStep("location");

    const resolvedAddress = await locationService.reverseGeocode(coords.lat, coords.lng);
    updateField("address", resolvedAddress);

    if (updateArea && !form.area.trim()) {
      updateField("area", resolvedAddress.split(",")[0] || "Current Location");
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG, or MP4 file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be 10MB or less.");
      return;
    }

    updateField("photo", file);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragOver(false);
    handleFileUpload(event.dataTransfer.files);
  };

  const handleGetCurrentLocation = async () => {
    setIsLocating(true);
    setLocationError("");

    try {
      const coords = await locationService.getCurrentLocation();
      await applySelectedLocation(coords, true);
    } catch (locationIssue) {
      setLocationError(locationIssue instanceof Error ? locationIssue.message : "Could not get your current location.");
    } finally {
      setIsLocating(false);
    }
  };

  const saveDraft = () => {
    setIsSavingDraft(true);
    localStorage.setItem("complaintDraft", JSON.stringify({ ...form, photo: null, selectedLocation }));
    window.setTimeout(() => setIsSavingDraft(false), 800);
  };

  const advanceStep = () => {
    if (currentStep === "details" && !isDetailsValid) {
      setError("Please add a subject, area, and at least 10 characters of description.");
      return;
    }

    if (currentStep === "review") {
      void submitComplaint();
      return;
    }

    setCurrentStep(getNextStep(currentStep));
  };

  const submitComplaint = async () => {
    if (!isDetailsValid) {
      setError("Please fill in all required fields before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const data = await complaintService.create({
        title: form.subject,
        description: form.description,
        type: form.type,
        area: form.area,
        address: form.address,
        latitude: selectedLocation?.lat,
        longitude: selectedLocation?.lng,
        priority: form.priority,
        photo: form.photo,
      });
      setSubmittedComplaint(data.complaint);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Could not submit the complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedComplaint) {
    return (
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
          <div className="bg-emerald-600 px-8 py-10 text-center text-white">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-3xl font-bold">Complaint Submitted!</h1>
            <p className="mt-2 text-emerald-50">Your complaint has been queued and technicians will be notified.</p>
          </div>
          <div className="p-8">
            <div className="mx-auto max-w-sm rounded-xl bg-slate-950 p-6 text-center text-white shadow-lg">
              <p className="text-sm text-slate-300">Your Digital Token</p>
              <p className="mt-2 text-5xl font-bold tracking-wider">{submittedComplaint.token}</p>
              <p className="mt-2 text-xs text-slate-400">Save this token to track your complaint</p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500">Queue Position</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">#{submittedComplaint.position}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500">Status</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">{submittedComplaint.status}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500">Technician ETA</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">{formatEta(submittedComplaint.technician?.etaMinutes)}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/complaints/${submittedComplaint.id}`)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Open Job Details
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 text-slate-950">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-200">
            <FileText size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-normal text-slate-950">New Complaint</h1>
            <p className="mt-1 text-slate-600">Submit a new utility service request.</p>
          </div>
        </div>
        <button
          onClick={() => navigate("../help")}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50"
        >
          <CircleHelp size={18} />
          Need Help?
        </button>
      </motion.header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-7">
            <div>
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  1
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Select Service Type</h2>
                  <p className="mt-1 text-sm text-slate-500">Choose the category of your issue</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
                {serviceOptions.map(({ type, label, Icon, iconBg, iconClass }) => {
                  const isSelected = form.type === type;

                  return (
                    <button
                      type="button"
                      key={type}
                      onClick={() => updateField("type", type)}
                      className={`relative flex min-h-24 flex-col items-center justify-center rounded-lg border bg-white px-4 py-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 ${
                        isSelected ? "border-blue-500 bg-blue-50/40 ring-1 ring-blue-500" : "border-slate-200"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                          <Check size={16} />
                        </span>
                      )}
                      <span className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
                        <Icon size={23} className={iconClass} />
                      </span>
                      <span className={`mt-3 text-sm font-bold ${isSelected ? "text-blue-700" : "text-slate-900"}`}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  2
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Complaint Details</h2>
                  <p className="mt-1 text-sm text-slate-500">Tell us more about the issue</p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold text-slate-950">Subject</span>
                  <div className="relative mt-3">
                    <FieldIcon>
                      <FileText size={18} />
                    </FieldIcon>
                    <input
                      value={form.subject}
                      onChange={(event) => updateField("subject", event.target.value)}
                      placeholder="e.g., Transformer failure in Block C"
                      className="h-14 w-full rounded-lg border border-slate-300 bg-white pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-slate-950">Area / Location</span>
                  <div className="relative mt-3 flex">
                    <FieldIcon>
                      <MapPin size={18} />
                    </FieldIcon>
                    <input
                      value={form.area}
                      onChange={(event) => updateField("area", event.target.value)}
                      placeholder="Dhanmondi, Mirpur, Uttara"
                      className="h-14 min-w-0 flex-1 rounded-l-lg border border-r-0 border-slate-300 bg-white pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={handleGetCurrentLocation}
                      disabled={isLocating}
                      className="flex h-14 w-14 items-center justify-center rounded-r-lg border border-slate-300 bg-white text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 disabled:opacity-60"
                      aria-label="Use current location"
                    >
                      {isLocating ? <Loader size={18} className="animate-spin" /> : <LocateFixed size={19} />}
                    </button>
                  </div>
                </label>
              </div>

              <label className="mt-6 block">
                <span className="text-sm font-bold text-slate-950">Detailed Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value.slice(0, 500))}
                  placeholder="Explain what happened, when it started, and any other useful details..."
                  rows={5}
                  className="mt-3 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <span className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>Minimum 10 characters</span>
                  <span>{descriptionCount}/500</span>
                </span>
              </label>

              <div className="mt-6">
                <p className="text-sm font-bold text-slate-950">Add Photos / Videos (Optional)</p>
                <p className="mt-1 text-sm text-slate-500">Upload images or videos that help us understand the issue better</p>
                <label
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`mt-4 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-5 text-center transition ${
                    dragOver ? "border-blue-500 bg-blue-50" : "border-blue-300 bg-white hover:bg-blue-50/50"
                  }`}
                >
                  <CloudUpload size={32} className="text-blue-600" />
                  <span className="mt-2 text-sm text-slate-600">
                    Drag & drop files here or <span className="font-semibold text-blue-600">click to browse</span>
                  </span>
                  <span className="mt-1 text-xs text-slate-500">Supports: JPG, PNG, MP4 (Max 10MB each)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,video/mp4"
                    className="hidden"
                    onChange={(event) => handleFileUpload(event.target.files)}
                  />
                </label>
                {form.photo && (
                  <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                    <span className="truncate font-semibold text-slate-700">{form.photo.name}</span>
                    <button type="button" onClick={() => updateField("photo", null)} className="text-slate-500 hover:text-red-600">
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Lock size={14} />
                Your file is safe and secure. It will only be used to resolve your complaint.
              </div>
            </div>

            {(currentStep === "priority" || currentStep === "review") && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="font-bold text-slate-950">Priority</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {(Object.keys(priorityConfig) as ComplaintPriority[]).map((priority) => {
                    const config = priorityConfig[priority];
                    const selected = form.priority === priority;

                    return (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => updateField("priority", priority)}
                        className={`rounded-lg border p-4 text-left transition ${
                          selected ? `${config.className} ring-2 ring-blue-500` : "border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        <span className="font-bold">{config.label}</span>
                        <span className="mt-1 block text-xs text-slate-500">{config.helper}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStep === "review" && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                <h3 className="font-bold text-blue-950">Review</h3>
                <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                  <p><span className="font-semibold">Service:</span> {selectedService.label}</p>
                  <p><span className="font-semibold">Priority:</span> {form.priority}</p>
                  <p><span className="font-semibold">Area:</span> {form.area || "Not provided"}</p>
                  <p><span className="font-semibold">Location:</span> {form.address || (selectedLocation ? `${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)}` : "Not pinned")}</p>
                </div>
              </div>
            )}

            {(error || locationError) && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <span>{error || locationError}</span>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={saveDraft}
                disabled={isSavingDraft}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:opacity-60"
              >
                <Save size={18} />
                {isSavingDraft ? "Saving..." : "Save as Draft"}
              </button>
              <button
                type="button"
                onClick={advanceStep}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-3 rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : currentStep === "review" ? (
                  <>
                    Submit Complaint
                    <Send size={18} />
                  </>
                ) : (
                  <>
                    Next: {progressSteps[getStepIndex(getNextStep(currentStep))].title}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.section>

        <aside className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h3 className="font-bold text-slate-950">Submission Progress</h3>
            <div className="mt-5 space-y-1">
              {progressSteps.map((step, index) => {
                const active = step.key === currentStep;
                const complete = index < currentStepNumber - 1;

                return (
                  <button
                    key={step.key}
                    type="button"
                    onClick={() => {
                      if (index === 0 || isDetailsValid) setCurrentStep(step.key);
                    }}
                    className={`relative flex w-full items-start gap-4 rounded-lg p-3 text-left transition ${
                      active ? "bg-blue-50" : "hover:bg-slate-50"
                    }`}
                  >
                    {index < progressSteps.length - 1 && (
                      <span className="absolute left-[27px] top-11 h-9 w-px bg-slate-200" />
                    )}
                    <span
                      className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        active || complete ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {complete ? <Check size={15} /> : index + 1}
                    </span>
                    <span>
                      <span className="block font-bold text-slate-950">{step.title}</span>
                      <span className="mt-1 block text-sm text-slate-500">{step.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h3 className="font-bold text-slate-950">Select on Map (Optional)</h3>
            <p className="mt-1 text-sm text-slate-500">Pinpoint the exact location of the issue</p>
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
              <MapTracker
                height="170px"
                zoom={13}
                initialLocation={selectedLocation ?? { lat: 23.8103, lng: 90.4125 }}
                userLocation={selectedLocation}
                onLocationSelect={(location) => void applySelectedLocation(location, false)}
              />
            </div>
            {form.address ? (
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                {form.address}
              </p>
            ) : selectedLocation ? (
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-500">
                {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
              </p>
            ) : null}
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isLocating}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50 disabled:opacity-60"
            >
              {isLocating ? <Loader size={18} className="animate-spin" /> : <Navigation size={18} />}
              Use My Current Location
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 shadow-sm"
          >
            <div className="relative p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-white">
                  <Lightbulb size={19} />
                </span>
                <h3 className="text-lg font-bold text-blue-900">Quick Tips</h3>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {[
                  "Provide accurate details for faster resolution",
                  "Attach clear photos of the issue",
                  "Use exact location for precise assistance",
                  "Our team will contact you shortly",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <Check size={16} className="mt-0.5 shrink-0 text-blue-700" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
              <div className="pointer-events-none absolute bottom-0 right-0 hidden h-28 w-28 rounded-tl-full bg-blue-200/50 sm:block" />
              <PhoneCall className="pointer-events-none absolute bottom-5 right-6 hidden text-blue-700 sm:block" size={42} />
            </div>
          </motion.div>

          {assignedTechnician && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <UserCheck size={20} />
                </span>
                <div>
                  <h3 className="font-bold text-slate-950">Suggested Technician</h3>
                  <p className="text-sm text-slate-500">{assignedTechnician.name}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Distance</p>
                  <p className="font-bold text-slate-950">{formatDistance(assignedTechnician.distanceKm)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">ETA</p>
                  <p className="font-bold text-slate-950">{formatEta(assignedTechnician.etaMinutes)}</p>
                </div>
              </div>
            </motion.div>
          )}
        </aside>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { Icon: Gauge, title: "Fast Response", desc: "Our team responds quickly", bg: "bg-blue-100", color: "text-blue-700" },
          { Icon: ShieldCheck, title: "Real-time Tracking", desc: "Track your complaint live", bg: "bg-emerald-100", color: "text-emerald-700" },
          { Icon: PhoneCall, title: "24/7 Support", desc: "We're here to help anytime", bg: "bg-teal-100", color: "text-teal-700" },
        ].map(({ Icon, title, desc, bg, color }) => (
          <div key={title} className="flex items-center gap-4 rounded-xl bg-white/60 p-4">
            <span className={`flex h-11 w-11 items-center justify-center rounded-full ${bg}`}>
              <Icon size={21} className={color} />
            </span>
            <div>
              <h3 className="font-bold text-slate-950">{title}</h3>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
