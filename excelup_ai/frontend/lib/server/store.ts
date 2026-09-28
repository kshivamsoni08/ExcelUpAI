import {
  DAY0_DATA,
  OUTCOMES_DATA,
  EV_DETAIL_DATA,
  SOLAR_DETAIL_DATA,
  FOLLOWUPS_DATA,
  VALIDATIONS_DATA,
  PRIYA_OUTCOMES_DATA,
  COURSES_DATA,
  ROADMAPS_DATA,
  ITEMS_DATA,
  SKILLS_DATA,
} from "./seedData";

// Global singleton state across hot reloads in Next.js development
const globalForStore = globalThis as unknown as {
  excelUpStore: ExcelUpState | undefined;
};

export type Role = "trainee" | "trainer" | "employer" | "provider" | "officer" | "admin";

export type SessionUser = {
  id: number;
  role: Role;
  email: string;
  name: string;
  headline?: string;
  provider_id?: number | null;
  company_id?: number | null;
  provider?: { name: string; kind: string; city: string } | null;
  company?: { name: string; verified: boolean } | null;
  profile?: Record<string, unknown>;
};

export const DEMO_USERS: Record<string, { password: string; user: SessionUser }> = {
  "sunita.rao@skills.mahdemo.gov": {
    password: "demo1234",
    user: {
      id: 201,
      role: "officer",
      email: "sunita.rao@skills.mahdemo.gov",
      name: "Sunita Rao",
      headline: "Joint Director, Directorate of Vocational Education & Training (DVET)",
    },
  },
  "officer@dvet.gov.in": {
    password: "demo1234",
    user: {
      id: 201,
      role: "officer",
      email: "officer@dvet.gov.in",
      name: "Sunita Rao",
      headline: "Joint Director, Directorate of Vocational Education & Training (DVET)",
    },
  },
  "priya.patil@demo.trainee": {
    password: "demo1234",
    user: {
      id: 101,
      role: "trainee",
      email: "priya.patil@demo.trainee",
      name: "Priya Patil",
      headline: "Solar PV Installation Technician · ITI Pune",
      provider_id: 1,
    },
  },
  "rahul.jadhav@demo.trainee": {
    password: "demo1234",
    user: {
      id: 102,
      role: "trainee",
      email: "rahul.jadhav@demo.trainee",
      name: "Rahul Jadhav",
      headline: "EV Assembly Technician · ITI Nashik (Seeking placement)",
      provider_id: 2,
    },
  },
  "rahul.verma@demo.trainee": {
    password: "demo1234",
    user: {
      id: 102,
      role: "trainee",
      email: "rahul.verma@demo.trainee",
      name: "Rahul Verma",
      headline: "Solar Site Engineer · ITI Nashik",
      provider_id: 2,
    },
  },
  "hr@sunray.demo": {
    password: "demo1234",
    user: {
      id: 301,
      role: "employer",
      email: "hr@sunray.demo",
      name: "Ravi Deshpande",
      headline: "HR Head, SunRay Energy Pune",
      company_id: 1,
      company: { name: "SunRay Energy", verified: true },
    },
  },
  "ravi@sunrayenergy.demo": {
    password: "demo1234",
    user: {
      id: 301,
      role: "employer",
      email: "ravi@sunrayenergy.demo",
      name: "Ravi Deshpande",
      headline: "HR Head, SunRay Energy Pune",
      company_id: 1,
      company: { name: "SunRay Energy", verified: true },
    },
  },
  "principal@itipune.demo": {
    password: "demo1234",
    user: {
      id: 401,
      role: "provider",
      email: "principal@itipune.demo",
      name: "Principal S. Joshi",
      headline: "Government ITI Pune",
      provider_id: 1,
      provider: { name: "ITI Pune (Demo)", kind: "Government ITI", city: "Pune" },
    },
  },
  "principal@itinashik.demo": {
    password: "demo1234",
    user: {
      id: 402,
      role: "provider",
      email: "principal@itinashik.demo",
      name: "Principal R. Kulkarni",
      headline: "Government ITI Nashik",
      provider_id: 2,
      provider: { name: "ITI Nashik (Demo)", kind: "Government ITI", city: "Nashik" },
    },
  },
  "admin@excelupai.demo": {
    password: "demo1234",
    user: {
      id: 501,
      role: "admin",
      email: "admin@excelupai.demo",
      name: "System Admin",
      headline: "ExcelUp AI Governance Administrator",
    },
  },
  "admin@dvet.gov.in": {
    password: "demo1234",
    user: {
      id: 501,
      role: "admin",
      email: "admin@dvet.gov.in",
      name: "System Admin (DVET)",
      headline: "ExcelUp AI Governance Administrator",
    },
  },
  "trainer@demo.faculty": {
    password: "demo1234",
    user: {
      id: 601,
      role: "trainer",
      email: "trainer@demo.faculty",
      name: "Prof. Anant Kulkarni",
      headline: "Senior Vocational Trainer · Electrical & Solar Trades",
    },
  },
};

export class ExcelUpState {
  waves: any[];
  nonResponders: any[];
  cohorts: any[];
  validations: any[];
  priyaOutcomes: any;
  consents: any[];
  auditLogs: any[];
  notifications: any[];
  submissions: any[];
  applications: any[];
  enrollments: any[];
  assessSessions: Record<number, any>;
  sessionCounter: number;
  priyaWageConsented: boolean;

  constructor() {
    this.waves = JSON.parse(JSON.stringify(FOLLOWUPS_DATA.waves || []));
    this.nonResponders = JSON.parse(JSON.stringify(FOLLOWUPS_DATA.non_responders || []));
    this.cohorts = JSON.parse(JSON.stringify(FOLLOWUPS_DATA.cohorts || []));
    this.validations = JSON.parse(JSON.stringify(VALIDATIONS_DATA || []));
    this.priyaOutcomes = JSON.parse(JSON.stringify(PRIYA_OUTCOMES_DATA || {}));
    this.priyaWageConsented = true;

    this.consents = [
      {
        id: 1,
        grantee_type: "department",
        grantee_id: null,
        scopes: ["outcomes", "wage", "demographics", "skills"],
        purpose: "Department outcome registry (Govt. of Maharashtra)",
        granted_at: new Date(Date.now() - 60 * 86400000).toISOString(),
        expires_at: null,
        revoked: false,
        revoked_at: null,
      },
      {
        id: 2,
        grantee_type: "provider",
        grantee_id: 1,
        scopes: ["outcomes", "skills"],
        purpose: "Institutional curriculum improvement & alumni support",
        granted_at: new Date(Date.now() - 60 * 86400000).toISOString(),
        expires_at: null,
        revoked: false,
        revoked_at: null,
      },
    ];

    this.auditLogs = [
      {
        id: 1,
        officer_id: 201,
        officer_name: "Sunita Rao",
        trainee_id: 1702,
        context: "assisted follow-up review for batch SOLAR-2025-B1",
        ts: new Date(Date.now() - 3600000).toISOString(),
      },
    ];

    this.notifications = [
      {
        id: 1,
        type: "decay_alert",
        payload: {
          skill: "Battery Diagnostics",
          floor: 2.1,
          required_by: "EV Service Technician",
          min_level: 3.5,
          date: new Date().toISOString().slice(0, 10),
        },
        read: false,
      },
    ];

    this.submissions = [
      {
        id: 1,
        opp_id: 1,
        title: "Solar PV Site Safety Challenge",
        gauntlet_title: "Solar PV Site Safety Challenge",
        company: "SunRay Energy",
        candidate_ref: "TRN-02080",
        candidate_user_id: 101,
        status: "approved",
        submission_url: "https://drive.demo/priya-solar-safety",
        writeup: "Site safety protocol with hazard matrix, PPE plan and earthing checklist for 5 kW rooftop.",
        reviewed_at: new Date(Date.now() - 24 * 86400000).toISOString(),
      },
      {
        id: 2,
        opp_id: 2,
        title: "EV Battery Diagnostics Challenge",
        gauntlet_title: "EV Battery Diagnostics Challenge",
        company: "EV Motors Maharashtra",
        candidate_ref: "TRN-01115",
        candidate_user_id: 102,
        status: "submitted",
        submission_url: "https://drive.demo/trainee2-battery-diag",
        writeup: "Battery pack test log analysis with SoC curve.",
        reviewed_at: null,
      },
    ];

    this.applications = [
      {
        id: 1,
        opp_id: 101,
        status: "applied",
        score: 88,
        title: "Solar PV O&M Technician",
        opp_title: "Solar PV O&M Technician",
        company: "SunRay Energy",
        candidate_ref: "TRN-02080",
        candidate_name: "Priya Patil",
        kind: "job",
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        opportunity: {
          id: 101,
          title: "Solar PV O&M Technician",
          company: "SunRay Energy",
          kind: "job",
          location: "Pune",
        },
        events: [
          { type: "applied", ts: new Date(Date.now() - 3 * 86400000).toISOString() },
          { type: "viewed", ts: new Date(Date.now() - 2 * 86400000).toISOString() },
        ],
        feedback: null,
      },
      {
        id: 2,
        opp_id: 102,
        status: "shortlisted",
        score: 72,
        title: "EV Service Technician",
        opp_title: "EV Service Technician",
        company: "EV Motors Maharashtra",
        candidate_ref: "TRN-01115",
        candidate_name: "Rahul Jadhav",
        kind: "internship",
        created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
        opportunity: {
          id: 102,
          title: "EV Service Technician",
          company: "EV Motors Maharashtra",
          kind: "internship",
          location: "Nashik",
        },
        events: [
          { type: "applied", ts: new Date(Date.now() - 7 * 86400000).toISOString() },
          { type: "viewed", ts: new Date(Date.now() - 5 * 86400000).toISOString() },
          { type: "shortlisted", ts: new Date(Date.now() - 2 * 86400000).toISOString() },
        ],
        feedback: null,
      },
    ];

    this.enrollments = [
      {
        id: 1,
        course_id: 3,
        title: "Solar PV Installation Hands-On",
        provider: "ExcelUp AI Academy (internal)",
        url: "https://excelupai.demo/courses/solar-pv-installation",
        progress: 100,
        status: "completed",
        skills: ["Solar PV Installation", "Solar Site Survey", "Solar Inverter Basics"],
      },
      {
        id: 2,
        course_id: 4,
        title: "Rooftop PV Design & Net Metering",
        provider: "ExcelUp AI Academy (internal)",
        url: "https://excelupai.demo/courses/pv-design-net-metering",
        progress: 45,
        status: "in_progress",
        skills: ["PV System Design", "Net Metering Compliance", "Energy Auditing"],
      },
    ];

    this.assessSessions = {};
    this.sessionCounter = 100;
  }

  // --- ACTIONS ---

  triggerWave(cohortId: number, officerId: number = 201) {
    const waveId = 155 + this.waves.length;
    const cohort = this.cohorts.find((c) => c.id === cohortId) || {
      batch_code: `BATCH-${cohortId}`,
      programme: "Vocational Programme",
    };

    const newWave = {
      id: waveId,
      cohort_id: cohortId,
      batch_code: cohort.batch_code,
      milestone_months: 0,
      kind: "adhoc",
      status: "active",
      due_on: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      wave_id: waveId,
      issued: 47,
      responded: 0,
      response_rate: 0.0,
    };

    this.waves.unshift(newWave);

    // Notify trainees and trigger check-in card for Priya
    this.priyaOutcomes.next_followup = {
      attempt_id: 4862,
      wave_id: waveId,
      kind: "adhoc",
      milestone_months: 0,
    };

    this.notifications.unshift({
      id: Date.now(),
      type: "wave_alert",
      payload: {
        wave_id: waveId,
        message: `New follow-up wave active for ${cohort.batch_code}. Please submit your status!`,
      },
      read: false,
    });

    return { wave_id: waveId, status: "active" };
  }

  respondFollowup(waveId: number, response: string, bandIdx: number, roleTitle: string) {
    const wave = this.waves.find((w) => w.id === waveId || w.wave_id === waveId);
    if (wave) {
      wave.responded = (wave.responded || 0) + 1;
      wave.response_rate = wave.responded / Math.max(wave.issued || 1, 1);
    }

    // Clear next follow-up check-in card
    this.priyaOutcomes.next_followup = null;

    const BANDS = [10000, 12500, 17500, 25000, 35000];
    const wage = BANDS[bandIdx] ?? 17500;

    const newEpisode = {
      id: 200 + (this.priyaOutcomes.episodes?.length || 0),
      employment_type: response,
      role_title: roleTitle || "Solar PV Installation Technician",
      company: "SunRay Energy",
      district: "Pune",
      start_date: new Date().toISOString().slice(0, 10),
      end_date: null,
      status: "active",
      source: "self_report",
      validation_status: "pending",
      monthly_wage_start: wage,
      monthly_wage_current: wage,
      wage_series: [{ month_index: 0, monthly_wage: wage }],
    };

    if (!this.priyaOutcomes.episodes) this.priyaOutcomes.episodes = [];
    this.priyaOutcomes.episodes.unshift(newEpisode);

    // Add to employer validation queue for SunRay Energy
    this.validations.unshift({
      episode_id: newEpisode.id,
      trainee_ref: "TRN-02080",
      identity_revealed: false,
      trainee_name: "Priya Patil",
      role_title: newEpisode.role_title,
      start_date: newEpisode.start_date,
      district_id: 1,
      source: "self_report",
      validation_status: "pending",
      cohort_id: 1,
      created_at: new Date().toISOString(),
    });

    return { success: true, episode_id: newEpisode.id };
  }

  confirmValidation(episodeId: number, wageBand: number) {
    const v = this.validations.find((x) => x.episode_id === episodeId);
    if (v) {
      v.validation_status = "validated";
    }
    if (this.priyaOutcomes.episodes) {
      const ep = this.priyaOutcomes.episodes.find((x: any) => x.id === episodeId);
      if (ep) {
        ep.validation_status = "validated";
      }
    }
    return { success: true };
  }

  disputeValidation(episodeId: number, note: string) {
    const v = this.validations.find((x) => x.episode_id === episodeId);
    if (v) {
      v.validation_status = "disputed";
      v.notes = note;
    }
    return { success: true };
  }

  revokeConsent(consentId: number) {
    const c = this.consents.find((x) => x.id === consentId);
    if (c) {
      c.revoked = true;
      c.revoked_at = new Date().toISOString();
      c.scopes = c.scopes.filter((s: string) => s !== "wage");
    }
    this.priyaWageConsented = false;
    return { success: true };
  }

  recordAssistedAttempt(attemptId: number, body: any, officerUser: SessionUser) {
    this.logPiiView(
      officerUser.id,
      officerUser.name,
      attemptId,
      `assisted follow-up attempt #${attemptId} recorded: ${body.response}`
    );

    this.nonResponders = this.nonResponders.filter((nr) => nr.attempt_id !== attemptId);

    return {
      attempt_id: attemptId,
      response: body.response,
      episode_id: 999,
    };
  }

  logPiiView(officerId: number, officerName: string, traineeId: number, context: string) {
    this.auditLogs.unshift({
      id: this.auditLogs.length + 1,
      officer_id: officerId,
      officer_name: officerName,
      trainee_id: traineeId,
      context,
      ts: new Date().toISOString(),
    });
  }

  getProgrammeDetail(id: number) {
    if (id === 2) {
      return JSON.parse(JSON.stringify(EV_DETAIL_DATA));
    }
    if (id === 1) {
      const data = JSON.parse(JSON.stringify(SOLAR_DETAIL_DATA));
      // Live consent coverage reflect
      if (!this.priyaWageConsented) {
        data.consent.wage_consented = 43;
        data.consent.wage_coverage_pct = 91.5;
        data.wage_n = 37;
      }
      return data;
    }
    // Generic fallback for any other programme
    const row = (DAY0_DATA.rows || []).find((r: any) => r.programme_id === id);
    if (!row) return null;
    return {
      programme: {
        id: row.programme_id,
        title: row.title,
        sector: row.sector,
        provider: row.provider,
        nsqf_level: row.nsqf_level,
        duration_months: 6,
      },
      cohorts: [{ id: row.programme_id * 10, batch_code: `BATCH-${row.programme_id}`, end_date: "2025-06-30" }],
      completions: row.completions,
      placement_0: row.placement_0,
      placement_12: row.placement_12,
      retention_12: row.retention_12,
      wage_growth_12: row.wage_growth_12,
      wage_n: row.wage_n,
      validation_rate: row.validation_rate,
      followup_rate: row.followup_rate,
      oqi: row.oqi,
      oqi_components: row.oqi_components,
      oqi_formula: DAY0_DATA.oqi_formula,
      flags: row.flags || [],
      decay_curve: [
        { m: 0, rate: row.placement_0, n: row.completions },
        { m: 3, rate: row.placement_0 * 0.98, n: row.completions },
        { m: 6, rate: row.placement_12 * 1.05, n: row.completions },
        { m: 12, rate: row.placement_12, n: row.completions },
        { m: 24, rate: row.placement_12 * 0.95, n: row.completions },
      ],
      wage_curve: [
        { m: 0, median: 14000, n: row.wage_n },
        { m: 6, median: 15500, n: row.wage_n },
        { m: 12, median: 17500, n: row.wage_n },
      ],
      attrition_pareto: [
        { code: "wage_below_expectations", label: "Wage below expectations", count: 20, share: 0.4 },
        { code: "skill_mismatch", label: "Skill mismatch", count: 15, share: 0.3 },
        { code: "other", label: "Other", count: 15, share: 0.3 },
      ],
      demographics: {
        by_gender: [
          { value: "female", n: Math.floor(row.completions * 0.4), suppressed: false, rate: row.placement_12 },
          { value: "male", n: Math.ceil(row.completions * 0.6), suppressed: false, rate: row.placement_12 },
        ],
        by_category: [
          { value: "gen", n: Math.floor(row.completions * 0.5), suppressed: false, rate: row.placement_12 },
          { value: "obc", n: Math.floor(row.completions * 0.35), suppressed: false, rate: row.placement_12 },
          { value: "sc", n: Math.floor(row.completions * 0.12), suppressed: false, rate: row.placement_12 },
          { value: "st", n: 3, suppressed: true, rate: null },
        ],
      },
      skill_gaps: {
        non_placed: Math.round(row.completions * (1 - row.placement_12)),
        completers: row.completions,
        top_missing: [{ skill: "Advanced Operations", trainees_missing: 4, impact: 50 }],
        curriculum_updates: [{ skill: "Advanced Operations", suggestion: "Add practical training module" }],
      },
      consent: row.consent,
    };
  }

  getProgrammesTable(view: string) {
    if (view === "outcomes") {
      const copy = JSON.parse(JSON.stringify(OUTCOMES_DATA));
      if (!this.priyaWageConsented) {
        const solar = copy.rows.find((r: any) => r.programme_id === 1);
        if (solar) {
          solar.wage_n = 38;
        }
      }
      return copy;
    }
    return JSON.parse(JSON.stringify(DAY0_DATA));
  }

  getOfficerDashboard() {
    const validatedCount = this.validations.filter((v) => v.validation_status === "validated").length;
    const validationRate = this.validations.length ? validatedCount / this.validations.length : 0.768;

    return {
      overall: {
        completers: 2000,
        placement_0: 0.528,
        placement_12: 0.495,
        retention_12: 0.612,
        validation_rate: Number(validationRate.toFixed(3)),
        followup_rate: 0.982,
      },
      wage_curve_overall: null,
      followups: {
        waves: this.waves.length,
        attempts: 4861 + this.waves.length * 40,
        responded: 4210 + this.waves.reduce((sum, w) => sum + (w.responded || 0), 0),
      },
      consent_coverage: {
        trainees: 2000,
        consented: this.priyaWageConsented ? 1820 : 1819,
      },
      flagged_programmes: [
        { programme_id: 2, title: "EV Assembly Technician", flags: ["vanity_metric"] },
        { programme_id: 3, title: "Textile Machine Operator", flags: ["vanity_metric", "oversupplied", "obsolete"] },
        { programme_id: 5, title: "Welder (SMAW/MIG)", flags: ["vanity_metric"] },
        { programme_id: 10, title: "Garment Stitching Operator", flags: ["obsolete"] },
        { programme_id: 11, title: "Fabric Quality Checker", flags: ["obsolete"] },
        { programme_id: 26, title: "Textile Design Assistant", flags: ["obsolete"] },
      ],
      oqi_formula: DAY0_DATA.oqi_formula,
    };
  }

  getSkillGap(role: string, userEmail: string = "priya.patil@demo.trainee") {
    const isRahul = userEmail.includes("rahul");
    if (isRahul || role.includes("EV") || role.includes("Pharma")) {
      return {
        role,
        requirements: [
          {
            skill: "Battery Diagnostics",
            required: 3.5,
            user_level: 2.1,
            user_ceiling: 2.5,
            essential: true,
            gap: 1.4,
            verified: true,
            bridge_courses: ["Battery Diagnostics Bootcamp", "Two-Wheeler EV Servicing"],
          },
          {
            skill: "EV Powertrain",
            required: 4.0,
            user_level: 3.8,
            user_ceiling: 4.2,
            essential: true,
            gap: 0.2,
            verified: true,
            bridge_courses: ["EV Powertrain Fundamentals"],
          },
          {
            skill: "Automotive Electricals",
            required: 3.0,
            user_level: 3.2,
            user_ceiling: 3.5,
            essential: true,
            gap: 0,
            verified: true,
            bridge_courses: [],
          },
          {
            skill: "Safety in EV Workshops",
            required: 4.0,
            user_level: 4.0,
            user_ceiling: 4.5,
            essential: false,
            gap: 0,
            verified: true,
            bridge_courses: [],
          },
        ],
      };
    }

    // Default for Priya (Solar)
    return {
      role: role || "Solar PV Installation Technician",
      requirements: [
        {
          skill: "Solar PV Installation",
          required: 4.0,
          user_level: 4.0,
          user_ceiling: 4.5,
          essential: true,
          gap: 0,
          verified: true,
          bridge_courses: [],
        },
        {
          skill: "PV System Design",
          required: 3.5,
          user_level: 3.0,
          user_ceiling: 3.5,
          essential: true,
          gap: 0.5,
          verified: false,
          bridge_courses: ["Rooftop PV Design & Net Metering"],
        },
        {
          skill: "Net Metering Compliance",
          required: 3.0,
          user_level: 2.5,
          user_ceiling: 3.0,
          essential: false,
          gap: 0.5,
          verified: false,
          bridge_courses: ["Rooftop PV Design & Net Metering"],
        },
      ],
    };
  }

  getGenome(userEmail: string = "priya.patil@demo.trainee") {
    const isRahul = userEmail.includes("rahul");
    if (isRahul) {
      return {
        skills: [
          {
            skill_id: 4,
            name: "Battery Diagnostics",
            skill: "Battery Diagnostics",
            domain: "Auto & EV",
            mu_effective: 2.1,
            verified_floor: 2.1,
            potential_ceiling: 2.8,
            source: "assessment",
            is_verified: true,
            months_stale: 3.0,
            faded: true,
            last_evidence_at: "2025-06-26",
            decay_status: "decaying",
          },
          {
            skill_id: 3,
            name: "EV Powertrain",
            skill: "EV Powertrain",
            domain: "Auto & EV",
            mu_effective: 3.8,
            verified_floor: 3.8,
            potential_ceiling: 4.2,
            source: "course",
            is_verified: true,
            months_stale: 0.5,
            faded: false,
            last_evidence_at: "2025-06-26",
            decay_status: "fresh",
          },
          {
            skill_id: 10,
            name: "Automotive Electricals",
            skill: "Automotive Electricals",
            domain: "Auto & EV",
            mu_effective: 3.2,
            verified_floor: 3.2,
            potential_ceiling: 3.5,
            source: "gauntlet",
            is_verified: true,
            months_stale: 0.8,
            faded: false,
            last_evidence_at: "2025-06-26",
            decay_status: "fresh",
          },
          {
            skill_id: 11,
            name: "Assembly Line Operations",
            skill: "Assembly Line Operations",
            domain: "Manufacturing",
            mu_effective: 3.0,
            verified_floor: 3.0,
            potential_ceiling: 3.5,
            source: "vouch",
            is_verified: true,
            months_stale: 1.2,
            faded: false,
            last_evidence_at: "2025-06-26",
            decay_status: "stable",
          },
        ],
      };
    }

    return {
      skills: [
        {
          skill_id: 15,
          name: "Solar PV Installation",
          skill: "Solar PV Installation",
          domain: "Solar & Renewables",
          mu_effective: 4.1,
          verified_floor: 4.0,
          potential_ceiling: 4.6,
          source: "gauntlet",
          is_verified: true,
          months_stale: 0.2,
          faded: false,
          last_evidence_at: "2025-08-07",
          decay_status: "fresh",
        },
        {
          skill_id: 16,
          name: "Solar Site Survey",
          skill: "Solar Site Survey",
          domain: "Solar & Renewables",
          mu_effective: 3.8,
          verified_floor: 3.8,
          potential_ceiling: 4.2,
          source: "course",
          is_verified: true,
          months_stale: 0.4,
          faded: false,
          last_evidence_at: "2025-08-07",
          decay_status: "fresh",
        },
        {
          skill_id: 17,
          name: "Solar Inverter Basics",
          skill: "Solar Inverter Basics",
          domain: "Solar & Renewables",
          mu_effective: 3.6,
          verified_floor: 3.5,
          potential_ceiling: 4.0,
          source: "assessment",
          is_verified: true,
          months_stale: 0.5,
          faded: false,
          last_evidence_at: "2025-08-07",
          decay_status: "fresh",
        },
        {
          skill_id: 22,
          name: "Workplace Communication",
          skill: "Workplace Communication",
          domain: "Cross-Cutting",
          mu_effective: 3.3,
          verified_floor: 3.2,
          potential_ceiling: 3.8,
          source: "vouch",
          is_verified: true,
          months_stale: 1.1,
          faded: false,
          last_evidence_at: "2025-07-26",
          decay_status: "stable",
        },
      ],
    };
  }

  getVerifyCredential(id: string) {
    if (id === "tampered" || id === "invalid") {
      return {
        found: true,
        authentic: false,
        signature_valid: false,
        merkle_proof_valid: false,
        merkle_root: "0xdeadbeef12345678",
        status: "tampered",
        issued_at: new Date(Date.now() - 25 * 86400000).toISOString(),
        payload: {
          trainee: "Priya Patil",
          issuer: "SunRay Energy",
          skill: "Solar PV Installation",
          level: 4.0,
          challenge: "Solar PV Site Safety Challenge",
        },
      };
    }

    return {
      found: true,
      authentic: true,
      signature_valid: true,
      merkle_proof_valid: true,
      merkle_root: "0x7a3f4e91b2c8d5069f1a23c4e567890abcdef1234567890abcdef1234567890a",
      status: "verified",
      issued_at: new Date(Date.now() - 24 * 86400000).toISOString(),
      payload: {
        trainee: "Priya Patil",
        trainee_ref: "TRN-02080",
        issuer: "SunRay Energy (Pune)",
        skill: "Solar PV Installation",
        level: 4.0,
        challenge: "Solar PV Site Safety Challenge",
        score: 96,
        assessed_by: "Ravi Deshpande, Head of Operations",
        algorithm: "Ed25519 + SHA256 Merkle Tree",
      },
    };
  }
}

export function getStore(): ExcelUpState {
  if (!globalForStore.excelUpStore) {
    globalForStore.excelUpStore = new ExcelUpState();
  }
  return globalForStore.excelUpStore;
}
