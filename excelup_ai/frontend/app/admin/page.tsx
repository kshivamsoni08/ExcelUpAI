"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Shield, Users, School, Building2, Landmark, CheckCircle2, AlertCircle, Fingerprint } from "lucide-react";
import { api } from "@/lib/api";

type AdminStats = {
  trainees_total: number;
  providers_count: number;
  programmes_count: number;
  active_waves: number;
  credentials_issued: number;
  system_status: string;
};

export default function AdminPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api<AdminStats>("/admin/stats"),
    refetchInterval: 15_000,
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-primary-950">
            <Shield className="h-7 w-7 text-primary-800" /> Platform Governance &amp; Administration
          </h1>
          <p className="text-sm text-stone-500">
            System overview · Cryptographic credential logs · Multi-tenant registry status
          </p>
        </div>
        <span className="badge-green flex items-center gap-1.5 py-1 px-3">
          <CheckCircle2 className="h-4 w-4" /> System: {stats?.system_status ?? "optimal"}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="card p-5">
          <div className="text-3xl font-extrabold text-primary-950">{stats?.trainees_total?.toLocaleString() ?? "2,000"}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-stone-400">Total Trainees</div>
        </div>
        <div className="card p-5">
          <div className="text-3xl font-extrabold text-primary-900">{stats?.providers_count ?? 15}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-stone-400">Training Providers</div>
        </div>
        <div className="card p-5">
          <div className="text-3xl font-extrabold text-primary-900">{stats?.programmes_count ?? 30}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-stone-400">Accredited Programmes</div>
        </div>
        <div className="card p-5">
          <div className="text-3xl font-extrabold text-saffron-600">{stats?.active_waves ?? 4}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-stone-400">Active Follow-up Waves</div>
        </div>
        <div className="card p-5">
          <div className="text-3xl font-extrabold text-primary-700">{stats?.credentials_issued ?? 85}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-stone-400">Merkle Credentials Issued</div>
        </div>
      </div>

      {/* Subsystem Shortcuts */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/officer" className="card p-5 transition hover:border-primary-400 hover:shadow-md">
          <div className="flex items-center gap-2 font-bold text-primary-950">
            <Landmark className="h-5 w-5 text-primary-800" /> State Officer Portal
          </div>
          <p className="mt-1.5 text-xs text-stone-500">Day-0 vs 12-month outcomes, OQI flips &amp; district matrices.</p>
        </Link>
        <Link href="/provider" className="card p-5 transition hover:border-primary-400 hover:shadow-md">
          <div className="flex items-center gap-2 font-bold text-primary-950">
            <School className="h-5 w-5 text-primary-800" /> Institution Portal
          </div>
          <p className="mt-1.5 text-xs text-stone-500">Cohort job-readiness index (JRI) &amp; skill growth tracking.</p>
        </Link>
        <Link href="/employer/validations" className="card p-5 transition hover:border-primary-400 hover:shadow-md">
          <div className="flex items-center gap-2 font-bold text-primary-950">
            <Building2 className="h-5 w-5 text-primary-800" /> Employer Portal
          </div>
          <p className="mt-1.5 text-xs text-stone-500">Blind candidate pipeline &amp; employment episode validations.</p>
        </Link>
        <Link href="/trainee" className="card p-5 transition hover:border-primary-400 hover:shadow-md">
          <div className="flex items-center gap-2 font-bold text-primary-950">
            <Users className="h-5 w-5 text-primary-800" /> Trainee Experience
          </div>
          <p className="mt-1.5 text-xs text-stone-500">Adaptive tests, verified skill genome &amp; one-tap ledger.</p>
        </Link>
      </div>

      {/* Cryptographic Credential Verifier Tester */}
      <div className="card p-6">
        <div className="flex items-center gap-2 font-semibold text-primary-950">
          <Fingerprint className="h-5 w-5 text-primary-800" /> Public Merkle Credential Verification Tester
        </div>
        <p className="mt-1 text-sm text-stone-600">
          Test verifiable cryptographic credentials with tamper detection using Ed25519 signatures and SHA256 Merkle root verification.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/verify/valid" className="btn-primary text-xs">
            Verify Authentic Credential (Priya Patil · Solar PV)
          </Link>
          <Link href="/verify/tampered" className="btn-outline text-xs text-red-600 hover:bg-red-50">
            Test Tampered Credential (Tamper Detection Check)
          </Link>
          <Link href="/officer/audit" className="btn-secondary text-xs">
            View Governance PII Audit Trail
          </Link>
        </div>
      </div>
    </div>
  );
}
