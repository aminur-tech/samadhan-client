"use client";

import {
    useGetExpertsQuery,
    useRegisterExpertMutation,
    useGetConsultationsQuery,
    useCreateConsultationMutation,
    useUpdateConsultationStatusMutation,
} from "@/store/api/expertsApi";
import React, { useState, useMemo } from "react";


// Types
interface Expert {
    id: string;
    name?: string;
    email?: string;
    specialty: string;
    avatarUrl?: string;
    rating?: number;
    consultationFee?: number;
    bio?: string;
}

interface Consultation {
    id: string;
    expertId: string;
    scheduledAt: string;
    sessionType: string;
    status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
    expertName?: string;
}

const SPECIALTIES = [
    "All",
    "Engineering",
    "Product Design",
    "Marketing",
    "Data Science",
    "Business Strategy",
    "Legal",
];

export default function ExpertsPage() {
    // RTK Query Hooks
    const { data: experts = [], isLoading: isLoadingExperts, isError: isExpertsError } = useGetExpertsQuery({});
    const { data: consultations = [], isLoading: isLoadingConsultations } = useGetConsultationsQuery({});

    const [registerExpert, { isLoading: isRegistering }] = useRegisterExpertMutation();
    const [createConsultation, { isLoading: isBooking }] = useCreateConsultationMutation();
    const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateConsultationStatusMutation();

    // Local State
    const [activeTab, setActiveTab] = useState<"directory" | "consultations">("directory");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("All");

    // Modal States
    const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
    const [bookingDate, setBookingDate] = useState("");
    const [bookingType, setBookingType] = useState("VIDEO");

    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [regSpecialty, setRegSpecialty] = useState("");

    const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const notify = (msg: string, type: "success" | "error" = "success") => {
        setNotification({ type, msg });
        setTimeout(() => setNotification(null), 4000);
    };

    // Filtered Experts
    const filteredExperts = useMemo(() => {
        return (experts as Expert[]).filter((expert) => {
            const matchesSearch =
                expert.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                expert.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSpecialty =
                selectedSpecialty === "All" || expert.specialty?.toLowerCase() === selectedSpecialty.toLowerCase();
            return matchesSearch && matchesSpecialty;
        });
    }, [experts, searchTerm, selectedSpecialty]);

    // Handlers
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!regSpecialty.trim()) return;
        try {
            await registerExpert({ specialty: regSpecialty }).unwrap();
            notify("Successfully registered as an expert!");
            setRegSpecialty("");
            setShowRegisterModal(false);
        } catch (err) {
            notify("Failed to register. Please try again.", "error");
        }
    };

    const handleBookConsultation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedExpert || !bookingDate) return;
        try {
            await createConsultation({
                expertId: selectedExpert.id,
                scheduledAt: new Date(bookingDate).toISOString(),
                sessionType: bookingType,
            }).unwrap();
            notify("Consultation scheduled successfully!");
            setSelectedExpert(null);
            setBookingDate("");
        } catch (err) {
            notify("Failed to book consultation.", "error");
        }
    };

    const handleStatusChange = async (id: string, status: "CONFIRMED" | "COMPLETED" | "CANCELLED") => {
        try {
            await updateStatus({ id, status }).unwrap();
            notify(`Consultation marked as ${status.toLowerCase()}`);
        } catch (err) {
            notify("Failed to update status.", "error");
        }
    };

    return (
        <div className="section-shell py-10 space-y-8">
            {/* Toast Notification */}
            {notification && (
                <div
                    className={`fixed top-6 right-6 z-50 rounded-xl px-4 py-3 shadow-lg border backdrop-blur-md transition-all ${notification.type === "success"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-destructive/10 border-destructive/30 text-destructive"
                        }`}
                >
                    {notification.msg}
                </div>
            )}

            {/* Hero / Header */}
            <header className="surface-card p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                    <span className="chip">Expert Network</span>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                        Connect with Industry Champions
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base">
                        Book 1-on-1 sessions with verified experts or apply to join our roster of industry leaders.
                    </p>
                </div>
                <button
                    onClick={() => setShowRegisterModal(true)}
                    className="focus-ring bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-primary/20 shrink-0"
                >
                    Become an Expert
                </button>
            </header>

            {/* Navigation & Controls Section */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Tab Switcher */}
                <div className="panel-soft p-1.5 flex items-center gap-1 self-start">
                    <button
                        onClick={() => setActiveTab("directory")}
                        className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === "directory"
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Find Experts
                    </button>
                    <button
                        onClick={() => setActiveTab("consultations")}
                        className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === "consultations"
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        My Consultations
                    </button>
                </div>

                {/* Directory Filters */}
                {activeTab === "directory" && (
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search by name or skill..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="focus-ring bg-card border border-border/80 rounded-xl px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground min-w-[240px]"
                        />
                        <select
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            className="focus-ring bg-card border border-border/80 rounded-xl px-4 py-2 text-sm text-foreground cursor-pointer"
                        >
                            {SPECIALTIES.map((spec) => (
                                <option key={spec} value={spec} className="bg-card text-foreground">
                                    {spec}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            {activeTab === "directory" ? (
                <section>
                    {isLoadingExperts ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="surface-card p-6 space-y-4 animate-pulse">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-muted" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 bg-muted rounded w-3/4" />
                                            <div className="h-3 bg-muted rounded w-1/2" />
                                        </div>
                                    </div>
                                    <div className="h-16 bg-muted rounded" />
                                    <div className="h-10 bg-muted rounded" />
                                </div>
                            ))}
                        </div>
                    ) : isExpertsError ? (
                        <div className="surface-card p-12 text-center text-destructive">
                            Failed to load experts. Please check your network connection.
                        </div>
                    ) : filteredExperts.length === 0 ? (
                        <div className="surface-card p-12 text-center text-muted-foreground space-y-2">
                            <p className="text-lg font-medium">No experts found matching your criteria.</p>
                            <p className="text-sm">Try tweaking your search terms or filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredExperts.map((expert) => (
                                <article
                                    key={expert.id}
                                    className="surface-card p-6 flex flex-col justify-between space-y-6 group hover:border-primary/50 transition-colors"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-accent-foreground/20 flex items-center justify-center text-lg font-bold text-primary-foreground shrink-0 overflow-hidden border border-border">
                                                {expert.avatarUrl ? (
                                                    <img src={expert.avatarUrl} alt={expert.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    (expert.name || expert.specialty || "E").slice(0, 2).toUpperCase()
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                                    {expert.name || "Anonymous Expert"}
                                                </h3>
                                                <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-md bg-accent text-accent-foreground border border-border/50">
                                                    {expert.specialty}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {expert.bio || "Available for strategic consultations, code reviews, and career mentoring."}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                                        <div>
                                            <span className="text-xs text-muted-foreground block">Session Rate</span>
                                            <span className="text-sm font-bold text-foreground">
                                                ${expert.consultationFee || 120} <span className="text-xs font-normal text-muted-foreground">/ hr</span>
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setSelectedExpert(expert)}
                                            className="focus-ring px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
                                        >
                                            Book Session
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            ) : (
                /* Consultations View */
                <section>
                    {isLoadingConsultations ? (
                        <div className="surface-card p-8 text-center text-muted-foreground">Loading consultations...</div>
                    ) : (consultations as Consultation[]).length === 0 ? (
                        <div className="surface-card p-12 text-center text-muted-foreground space-y-2">
                            <p className="text-lg font-medium">No consultations found.</p>
                            <p className="text-sm">Book a session with an expert from the directory to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(consultations as Consultation[]).map((consultation) => (
                                <div
                                    key={consultation.id}
                                    className="surface-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-foreground">
                                                {consultation.expertName || `Expert #${consultation.expertId.slice(0, 6)}`}
                                            </span>
                                            <span
                                                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${consultation.status === "CONFIRMED"
                                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                        : consultation.status === "COMPLETED"
                                                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                            : "bg-destructive/10 text-destructive border-destructive/20"
                                                    }`}
                                            >
                                                {consultation.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Scheduled for: {new Date(consultation.scheduledAt).toLocaleString()} • ({consultation.sessionType})
                                        </p>
                                    </div>

                                    {consultation.status === "CONFIRMED" && (
                                        <div className="flex items-center gap-2 w-full md:w-auto">
                                            <button
                                                disabled={isUpdatingStatus}
                                                onClick={() => handleStatusChange(consultation.id, "COMPLETED")}
                                                className="focus-ring flex-1 md:flex-none text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
                                            >
                                                Complete
                                            </button>
                                            <button
                                                disabled={isUpdatingStatus}
                                                onClick={() => handleStatusChange(consultation.id, "CANCELLED")}
                                                className="focus-ring flex-1 md:flex-none text-xs font-semibold px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Booking Modal */}
            {selectedExpert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="surface-card w-full max-w-md p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-foreground">Schedule Consultation</h3>
                            <button
                                onClick={() => setSelectedExpert(null)}
                                className="text-muted-foreground hover:text-foreground transition-colors text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleBookConsultation} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                                    Expert
                                </label>
                                <div className="panel-soft p-3 text-sm text-foreground font-medium">
                                    {selectedExpert.name || "Anonymous Expert"} ({selectedExpert.specialty})
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                                    Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                    className="focus-ring w-full bg-card border border-border/80 rounded-xl p-3 text-sm text-foreground"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                                    Session Type
                                </label>
                                <select
                                    value={bookingType}
                                    onChange={(e) => setBookingType(e.target.value)}
                                    className="focus-ring w-full bg-card border border-border/80 rounded-xl p-3 text-sm text-foreground"
                                >
                                    <option value="VIDEO">Video Call (1-on-1)</option>
                                    <option value="AUDIO">Audio Call</option>
                                    <option value="ASYNC">Async Code / Portfolio Review</option>
                                </select>
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedExpert(null)}
                                    className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isBooking}
                                    className="focus-ring bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                                >
                                    {isBooking ? "Confirming..." : "Confirm Booking"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Registration Modal */}
            {showRegisterModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="surface-card w-full max-w-md p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-foreground">Become an Expert</h3>
                            <button
                                onClick={() => setShowRegisterModal(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                                    Primary Specialty
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Senior Frontend Architect"
                                    value={regSpecialty}
                                    onChange={(e) => setRegSpecialty(e.target.value)}
                                    className="focus-ring w-full bg-card border border-border/80 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground"
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowRegisterModal(false)}
                                    className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isRegistering}
                                    className="focus-ring bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                                >
                                    {isRegistering ? "Submitting..." : "Submit Application"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}