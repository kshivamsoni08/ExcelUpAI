import { NextRequest, NextResponse } from "next/server";
import { getStore, DEMO_USERS, SessionUser } from "@/lib/server/store";
import {
  COURSES_DATA,
  ROADMAPS_DATA,
  ITEMS_DATA,
  SKILLS_DATA,
} from "@/lib/server/seedData";

// Helper to extract session user from Bearer header or fallback
function getUserFromReq(req: NextRequest): SessionUser {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "").trim();
  if (token && token.startsWith("user_")) {
    const email = Buffer.from(token.replace("user_", ""), "base64").toString("utf-8");
    if (DEMO_USERS[email]) return DEMO_USERS[email].user;
    const low = email.toLowerCase();
    for (const [k, v] of Object.entries(DEMO_USERS)) {
      if (k.toLowerCase() === low) return v.user;
    }
  }
  // Default fallback user is Priya (Trainee) or appropriate role by path
  const url = req.nextUrl.pathname;
  if (url.includes("/officer")) return DEMO_USERS["sunita.rao@skills.mahdemo.gov"].user;
  if (url.includes("/employer") || url.includes("/company")) return DEMO_USERS["hr@sunray.demo"].user;
  if (url.includes("/provider")) return DEMO_USERS["principal@itipune.demo"].user;
  if (url.includes("/faculty")) return DEMO_USERS["trainer@demo.faculty"].user;
  if (url.includes("/admin")) return DEMO_USERS["admin@excelupai.demo"].user;
  return DEMO_USERS["priya.patil@demo.trainee"].user;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  const slug = params.slug || [];
  const path = slug.join("/");
  const store = getStore();
  const user = getUserFromReq(req);
  const searchParams = req.nextUrl.searchParams;

  // --- HEALTH CHECK ---
  if (path === "health" || path === "") {
    return NextResponse.json({
      ok: true,
      status: "online",
      name: "ExcelUp AI Next.js Full-Stack API",
      platform: "Vercel / Next.js App Router",
      tagline: "Skilling outcomes, measured honestly.",
    });
  }

  // --- AUTH ---
  if (path === "auth/me") {
    return NextResponse.json(user);
  }

  // --- OFFICER ---
  if (path === "officer/dashboard") {
    return NextResponse.json(store.getOfficerDashboard());
  }

  if (path === "officer/programmes") {
    const view = searchParams.get("view") || "day0";
    return NextResponse.json(store.getProgrammesTable(view));
  }

  if (slug[0] === "officer" && slug[1] === "programmes" && slug[2]) {
    const id = Number(slug[2]);
    const detail = store.getProgrammeDetail(id);
    if (!detail) return NextResponse.json({ detail: "Programme not found" }, { status: 404 });
    return NextResponse.json(detail);
  }

  if (path === "officer/districts") {
    return NextResponse.json({
      cells: [
        { district: "Pune", sector: "Solar & Renewables", oqi: 92.9, episodes: 47, active: 44 },
        { district: "Nashik", sector: "Auto & EV", oqi: 59.4, episodes: 85, active: 51 },
        { district: "Kolhapur", sector: "Manufacturing", oqi: 53.6, episodes: 111, active: 60 },
        { district: "Solapur", sector: "Textiles", oqi: 25.6, episodes: 220, active: 56 },
        { district: "Sambhajinagar", sector: "Manufacturing", oqi: 40.6, episodes: 86, active: 35 },
        { district: "Mumbai Suburban", sector: "IT-ITeS", oqi: 55.5, episodes: 82, active: 46 },
        { district: "Thane", sector: "Textiles", oqi: 34.1, episodes: 75, active: 26 },
        { district: "Nagpur", sector: "Electrical", oqi: 51.4, episodes: 133, active: 68 },
        { district: "Raigad", sector: "Retail", oqi: 51.6, episodes: 77, active: 40 },
      ],
      note: "Districts with n < 5 suppressed per k-anonymity protocol.",
    });
  }

  if (path === "officer/demographics") {
    return NextResponse.json({
      by_gender: [
        { value: "female", rate: 0.81, n: 840, suppressed: false },
        { value: "male", rate: 0.88, n: 1160, suppressed: false },
      ],
      by_category: [
        { value: "gen", rate: 0.84, n: 920, suppressed: false },
        { value: "obc", rate: 0.79, n: 610, suppressed: false },
        { value: "sc", rate: 0.82, n: 310, suppressed: false },
        { value: "nt", rate: 0.89, n: 120, suppressed: false },
        { value: "st", rate: null, n: 4, suppressed: true },
      ],
    });
  }

  if (path === "officer/followups") {
    return NextResponse.json({
      waves: store.waves,
      non_responders: store.nonResponders,
      cohorts: store.cohorts,
    });
  }

  if (path === "officer/audit") {
    return NextResponse.json({ entries: store.auditLogs });
  }

  // --- TRAINEE OUTCOMES & CONSENTS ---
  if (path === "me/outcomes") {
    if (user.email.includes("rahul")) {
      return NextResponse.json({
        episodes: [
          {
            id: 88,
            employment_type: "unemployed",
            role_title: "EV Assembly Technician (Candidate)",
            company: null,
            district: "Nashik",
            start_date: "2025-06-26",
            end_date: null,
            status: "active",
            source: "assisted_outreach",
            validation_status: "unvalidated",
            monthly_wage_start: null,
            monthly_wage_current: null,
            wage_series: [],
            reason_codes: ["skill_mismatch", "wage_below_expectations"],
          },
        ],
        programmes: [
          {
            cohort_id: 2,
            batch_code: "EV-2025-B1",
            programme: "EV Assembly Technician",
            sector: "Auto & EV",
            status: "completed",
            completed_at: "2025-06-26",
          },
        ],
        next_followup: null,
      });
    }
    return NextResponse.json(store.priyaOutcomes);
  }

  if (path === "me/consents") {
    return NextResponse.json(store.consents);
  }

  if (slug[0] === "me" && slug[1] === "skill-gap") {
    const role = decodeURIComponent(slug.slice(2).join("/") || "Pharma QC Analyst");
    return NextResponse.json(store.getSkillGap(role, user.email));
  }

  if (path === "me/genome") {
    return NextResponse.json(store.getGenome(user.email));
  }

  if (path === "me/applications") {
    return NextResponse.json(store.applications);
  }

  if (path === "me/enrollments") {
    return NextResponse.json(store.enrollments);
  }

  if (path === "me/gauntlet-submissions") {
    return NextResponse.json(store.submissions);
  }

  // --- EMPLOYER VALIDATIONS ---
  if (path === "employer/validations") {
    return NextResponse.json(store.validations);
  }

  // --- PROVIDER ---
  if (path === "provider/dashboard") {
    return NextResponse.json({
      trainees: 47,
      placements: 41,
      pri_mean: 78.4,
      participation: { trainees_assessed: 47, active_cohorts: 1 },
      top_skills: [
        { skill: "Solar PV Installation", count: 47 },
        { skill: "Solar Site Survey", count: 44 },
        { skill: "Solar Inverter Basics", count: 41 },
        { skill: "PV System Design", count: 32 },
        { skill: "Workplace Communication", count: 45 },
      ],
      top_gaps: [
        { skill: "Net Metering Compliance", count: 18 },
        { skill: "Battery Storage Setup", count: 14 },
      ],
      at_risk: [
        { id: 105, name: "Suresh P.", pri: 42.1, target_role: "Solar PV Installer" },
        { id: 108, name: "Kavita M.", pri: 48.0, target_role: "Solar Technician" },
      ],
      pri_histogram: [
        { bin: "0-40", count: 2 },
        { bin: "40-60", count: 6 },
        { bin: "60-80", count: 18 },
        { bin: "80-100", count: 21 },
      ],
      pri_formula: "PRI = 0.40 x SkillFloor + 0.30 x GauntletProof + 0.30 x Attendance",
    });
  }

  if (path === "provider/growth") {
    return NextResponse.json({
      formula: "Cohort mean proficiency μ per month across verified skill rubrics (append-only history).",
      series: {
        "Solar PV Installation": { "2025-10": 2.1, "2025-11": 2.7, "2025-12": 3.2, "2026-01": 3.7, "2026-02": 4.1 },
        "Solar Site Survey": { "2025-10": 1.9, "2025-11": 2.4, "2025-12": 3.0, "2026-01": 3.5, "2026-02": 4.0 },
        "Solar Inverter Basics": { "2025-10": 1.7, "2025-11": 2.2, "2025-12": 2.8, "2026-01": 3.3, "2026-02": 3.8 },
        "PV System Design": { "2025-10": 1.4, "2025-11": 1.9, "2025-12": 2.5, "2026-01": 3.0, "2026-02": 3.4 },
        "Workplace Communication": { "2025-10": 3.0, "2025-11": 3.3, "2025-12": 3.6, "2026-01": 3.9, "2026-02": 4.2 },
        "Battery Diagnostics": { "2025-10": 1.2, "2025-11": 1.6, "2025-12": 2.1, "2026-01": 2.6, "2026-02": 3.1 },
      },
      months: ["2025-10", "2025-11", "2025-12", "2026-01", "2026-02"],
      placement_rate: [72, 74, 76, 79, 82, 84, 85, 87, 87.2],
      median_wage: [14000, 14200, 14500, 15000, 15400, 16000, 16500, 17200, 17900],
    });
  }

  if (path === "provider/pri") {
    return NextResponse.json({
      formula: "JRI = 0.35×essential_coverage + 0.25×portfolio_depth + 0.15×freshness + 0.15×SJT + 0.10×interview_readiness",
      histogram: [
        { bin: "0-40", count: 2 },
        { bin: "40-60", count: 6 },
        { bin: "60-80", count: 18 },
        { bin: "80-100", count: 21 },
      ],
      trainees: [
        {
          id: 101,
          name: "Priya Patil",
          pri: 92.4,
          target_role: "Solar PV Installation Technician",
          status: "ready",
          components: { coverage: 95, portfolio_depth: 92, freshness: 96, sjt: 88, interview_readiness: 90 },
        },
        {
          id: 102,
          name: "Rahul Verma",
          pri: 88.5,
          target_role: "Solar Site Engineer",
          status: "ready",
          components: { coverage: 90, portfolio_depth: 88, freshness: 92, sjt: 85, interview_readiness: 86 },
        },
        {
          id: 103,
          name: "Amit Shinde",
          pri: 84.1,
          target_role: "Solar Inverter Technician",
          status: "ready",
          components: { coverage: 85, portfolio_depth: 82, freshness: 90, sjt: 82, interview_readiness: 80 },
        },
        {
          id: 104,
          name: "Sneha Pawar",
          pri: 79.5,
          target_role: "PV System Designer",
          status: "ready",
          components: { coverage: 82, portfolio_depth: 78, freshness: 85, sjt: 76, interview_readiness: 74 },
        },
        {
          id: 105,
          name: "Suresh P.",
          pri: 42.1,
          target_role: "Solar PV Installer",
          status: "needs_support",
          components: { coverage: 45, portfolio_depth: 40, freshness: 50, sjt: 38, interview_readiness: 35 },
        },
        {
          id: 106,
          name: "Anil Jadhav",
          pri: 71.0,
          target_role: "Renewable Energy Technician",
          status: "in_training",
          components: { coverage: 72, portfolio_depth: 70, freshness: 75, sjt: 68, interview_readiness: 70 },
        },
        {
          id: 107,
          name: "Pooja Deshmukh",
          pri: 68.4,
          target_role: "Grid Synchronization Assistant",
          status: "in_training",
          components: { coverage: 70, portfolio_depth: 66, freshness: 72, sjt: 65, interview_readiness: 68 },
        },
        {
          id: 108,
          name: "Kavita M.",
          pri: 48.0,
          target_role: "Solar Technician",
          status: "needs_support",
          components: { coverage: 50, portfolio_depth: 46, freshness: 55, sjt: 44, interview_readiness: 42 },
        },
        {
          id: 109,
          name: "Vikas Kadam",
          pri: 82.3,
          target_role: "Solar PV Installation Technician",
          status: "ready",
          components: { coverage: 84, portfolio_depth: 80, freshness: 88, sjt: 80, interview_readiness: 78 },
        },
        {
          id: 110,
          name: "Manisha Rane",
          pri: 76.8,
          target_role: "PV System Designer",
          status: "ready",
          components: { coverage: 78, portfolio_depth: 75, freshness: 80, sjt: 74, interview_readiness: 75 },
        },
      ],
    });
  }

  // --- CATALOG / SKILLS / COURSES / ROADMAPS ---
  if (path === "skills") {
    const limit = Number(searchParams.get("limit")) || 250;
    return NextResponse.json(SKILLS_DATA.slice(0, limit));
  }

  if (path === "courses") {
    return NextResponse.json(COURSES_DATA);
  }

  if (path === "roadmaps") {
    return NextResponse.json(ROADMAPS_DATA);
  }

  if (path === "gauntlets") {
    return NextResponse.json([
      {
        id: 1,
        title: "Solar PV Site Safety Challenge",
        company: "SunRay Energy",
        duration: "2 weeks",
        description: "Submit a site-safety protocol for a 5 kW rooftop install: hazard assessment, PPE plan, lockout steps, earthing checks.",
        rubric: { criteria: [{ name: "Safety Protocol", weight: 0.5 }, { name: "Earthing Audit", weight: 0.5 }] },
        skills: [{ skill: "Solar PV Installation", min_level: 4.0 }],
      },
      {
        id: 2,
        title: "EV Battery Diagnostics Challenge",
        company: "EV Motors Maharashtra",
        duration: "2 weeks",
        description: "Analyze the provided battery pack test log: identify faulty module with SoC/SoH math, propose remediation plan.",
        rubric: { criteria: [{ name: "Fault Identification", weight: 0.5 }, { name: "SoC Analysis", weight: 0.5 }] },
        skills: [{ skill: "Battery Diagnostics", min_level: 3.5 }],
      },
    ]);
  }

  // --- OPPORTUNITIES / FEED ---
  if (path === "opportunities" || path === "feed") {
    const kind = searchParams.get("kind");
    const opps = [
      {
        id: 101,
        kind: "job",
        title: "Solar PV O&M Technician",
        company: "SunRay Energy",
        location: "Pune",
        stipend: "₹18,000/month",
        duration: "Full-time",
        description: "SunRay Energy field O&M role: rooftop PV servicing, inverter troubleshooting, net-metering compliance checks.",
        match: {
          score: 88,
          eligible: true,
          explanation: {
            score: 88,
            status: "eligible",
            matching_skills: ["Solar PV Installation", "Solar Inverter Basics"],
            missing_skills: [],
          },
        },
        requirements: [
          { skill: "Solar PV Installation", min_level: 4, essential: true },
          { skill: "Solar Inverter Basics", min_level: 3.5, essential: true },
        ],
      },
      {
        id: 102,
        kind: "internship",
        title: "EV Service Technician",
        company: "EV Motors Maharashtra",
        location: "Nashik",
        stipend: "₹16,000/month",
        duration: "6 months",
        description: "EV Motors Maharashtra (Nashik) hiring EV service technicians. Battery diagnostics at 3.5+ level required.",
        match: {
          score: 72,
          eligible: true,
          explanation: {
            score: 72,
            status: "eligible",
            matching_skills: ["EV Powertrain"],
            missing_skills: ["Battery Diagnostics"],
          },
        },
        requirements: [
          { skill: "Battery Diagnostics", min_level: 3.5, essential: true },
          { skill: "EV Powertrain", min_level: 3.5, essential: true },
        ],
      },
      {
        id: 103,
        kind: "apprenticeship",
        title: "Smart Grid Maintenance Assistant",
        company: "Mahavitran Renewable Cell",
        location: "Pune",
        stipend: "₹14,000/month",
        duration: "1 year",
        description: "Govt. apprenticeship programme for rooftop solar grid synchronization and net metering telemetry.",
        match: {
          score: 85,
          eligible: true,
          explanation: {
            score: 85,
            status: "eligible",
            matching_skills: ["Solar PV Installation"],
            missing_skills: [],
          },
        },
        requirements: [{ skill: "Solar PV Installation", min_level: 3.5, essential: true }],
      },
    ];

    if (kind) {
      return NextResponse.json(opps.filter((o) => o.kind === kind));
    }
    return NextResponse.json(opps);
  }

  // --- COMPANY ENDPOINTS ---
  if (path === "company/applications") {
    return NextResponse.json([
      { id: 1, opp_title: "Solar PV O&M Technician", candidate_ref: "TRN-02080", status: "applied", score: 88 },
      { id: 2, opp_title: "Solar PV O&M Technician", candidate_ref: "TRN-01115", status: "shortlisted", score: 76 },
    ]);
  }

  if (slug[0] === "company" && slug[1] === "candidates" && slug[2]) {
    return NextResponse.json({
      title: "Solar PV O&M Technician",
      candidates: [
        {
          application_id: 1,
          anon_ref: "TRN-02080",
          revealed: false,
          score: 88,
          pipeline_status: "shortlisted",
          genome: store.getGenome("priya.patil@demo.trainee").skills,
          explanation: { score: 88, status: "high_fit", matching_skills: ["Solar PV Installation"], missing_skills: [] },
          identity: { name: "Priya Patil", institution: "ITI Pune", headline: "Solar PV Specialist" },
        },
      ],
    });
  }

  if (path === "company/gauntlet-submissions") {
    return NextResponse.json(store.submissions);
  }

  // --- FACULTY ---
  if (path === "faculty/opportunities") {
    return NextResponse.json([
      {
        id: 1,
        kind: "industry_residency",
        title: "Solar & Clean Tech Industry Exposure",
        company: "SunRay Energy",
        location: "Pune, Maharashtra",
        stipend: "Sponsored (₹25,000 allowance)",
        duration: "2 weeks",
        description: "Hands-on immersion in grid-tied solar microgrid installations, commercial inverter commissioning, and rooftop safety compliance.",
        skills: ["Solar PV Installation", "Solar Inverter Basics", "Microgrid Architecture"],
      },
      {
        id: 2,
        kind: "faculty_fellowship",
        title: "EV Powertrain & BMS Faculty Fellowship",
        company: "EV Motors Maharashtra",
        location: "Nashik, Maharashtra",
        stipend: "Sponsored (₹30,000 allowance)",
        duration: "3 weeks",
        description: "Intensive industrial residency working directly on EV battery pack assembly, high-voltage safety isolation, and CAN-bus telemetry.",
        skills: ["Battery Diagnostics", "EV Powertrain", "BMS Calibration"],
      },
    ]);
  }

  // --- NOTIFICATIONS ---
  if (path === "notifications") {
    const unread = store.notifications.filter((n) => !n.read).length;
    return NextResponse.json({ unread, items: store.notifications });
  }

  // --- VERIFY CREDENTIAL ---
  if (slug[0] === "verify" && slug[1]) {
    return NextResponse.json(store.getVerifyCredential(slug[1]));
  }

  // --- ADAPTIVE ASSESSMENT GET ---
  if (slug[0] === "assess" && slug[1] && slug[1] !== "start") {
    const sessId = Number(slug[1]);
    const sess = store.assessSessions[sessId];
    if (sess) return NextResponse.json(sess);

    // Default active session
    return NextResponse.json({
      session_id: sessId,
      skill: "Battery Diagnostics",
      theta: 0.2,
      sem: 0.35,
      answered_count: 2,
      status: "in_progress",
      level_estimate: 3.2,
      served: {
        item_id: 3,
        stem: "A cell whose voltage sags sharply under load most likely has:",
        options: ["High internal resistance", "Low charger current", "Excess coolant", "A loose BMS data cable"],
        difficulty_b: 0.1,
        difficulty_label: "moderate",
        skill_type: "Vocational Diagnostic",
      },
    });
  }

  // --- RESUME CLAIMED VS VERIFIED ---
  if (slug[0] === "resume" && slug[1] === "claimed-vs-verified" && slug[2]) {
    return NextResponse.json({
      claimed_score: 84,
      verified_score: 62,
      delta: 22,
      eligible_claimed: true,
      declared_skill_ids: [15, 16],
      per_skill: [
        {
          skill: "Solar PV Installation",
          required: 4.0,
          claimed_level: 4.0,
          verified_level: 4.2,
          claimed_credit: 1.0,
          verified_credit: 1.0,
          is_declared_only: false,
          verified: true,
          bridge_courses: [],
        },
        {
          skill: "Battery Diagnostics",
          required: 3.5,
          claimed_level: 3.5,
          verified_level: 2.1,
          claimed_credit: 1.0,
          verified_credit: 0.6,
          is_declared_only: true,
          verified: false,
          bridge_courses: ["EV Traction Battery Diagnostics Mastery"],
        },
        {
          skill: "Solar Inverter Basics",
          required: 3.5,
          claimed_level: 4.0,
          verified_level: 3.6,
          claimed_credit: 1.0,
          verified_credit: 1.0,
          is_declared_only: false,
          verified: true,
          bridge_courses: [],
        },
      ],
    });
  }

  // --- ADMIN ---
  if (path === "admin/stats") {
    return NextResponse.json({
      trainees_total: 2000,
      providers_count: 15,
      programmes_count: 30,
      active_waves: store.waves.length,
      credentials_issued: 85,
      system_status: "optimal",
    });
  }

  return NextResponse.json({ detail: `Route ${path} not found` }, { status: 404 });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  const slug = params.slug || [];
  const path = slug.join("/");
  const store = getStore();
  const user = getUserFromReq(req);

  let body: any = {};
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      body = await req.json();
    } catch {
      body = {};
    }
  }

  // --- LOGIN ---
  if (path === "auth/login") {
    const { email, password } = body;
    const account = DEMO_USERS[email];
    if (!account || (password && password !== "demo1234" && password !== account.password)) {
      return NextResponse.json({ detail: "Invalid email or password" }, { status: 401 });
    }
    const token = `user_${Buffer.from(account.user.email).toString("base64")}`;
    return NextResponse.json({ token, user: account.user });
  }

  // --- OFFICER WAVES TRIGGER ---
  if (path === "officer/waves") {
    const cohortId = body.cohort_id || 1;
    const res = store.triggerWave(cohortId, user.id);
    return NextResponse.json(res);
  }

  // --- OFFICER ASSISTED ATTEMPT ---
  if (slug[0] === "officer" && slug[1] === "followup-attempts" && slug[2]) {
    const attemptId = Number(slug[2]);
    const res = store.recordAssistedAttempt(attemptId, body, user);
    return NextResponse.json(res);
  }

  // --- TRAINEE ONE-TAP RESPONSE ---
  if (slug[0] === "me" && slug[1] === "followups" && slug[2] && slug[3] === "respond") {
    const waveId = Number(slug[2]);
    const res = store.respondFollowup(waveId, body.response, body.band_idx ?? 2, body.role_title);
    return NextResponse.json(res);
  }

  // --- TRAINEE CONSENTS ---
  if (path === "me/consents") {
    const newConsent = {
      id: store.consents.length + 1,
      grantee_type: body.grantee_type || "department",
      grantee_id: null,
      scopes: body.scopes || ["outcomes", "wage", "demographics", "skills"],
      purpose: body.purpose || "Granted from consent manager",
      granted_at: new Date().toISOString(),
      expires_at: null,
      revoked: false,
      revoked_at: null,
    };
    store.consents.unshift(newConsent);
    return NextResponse.json(newConsent);
  }

  if (slug[0] === "me" && slug[1] === "consents" && slug[2] && slug[3] === "revoke") {
    const id = Number(slug[2]);
    const res = store.revokeConsent(id);
    return NextResponse.json(res);
  }

  if (path === "me/declared-skills") {
    return NextResponse.json({ success: true, count: (body.skill_ids || []).length });
  }

  // --- EMPLOYER VALIDATION ACTION ---
  if (slug[0] === "employer" && slug[1] === "validations" && slug[2]) {
    const epId = Number(slug[2]);
    if (body.decision === "confirm") {
      store.confirmValidation(epId, body.wage_band ?? 2);
    } else {
      store.disputeValidation(epId, body.role_title || "Disputed");
    }
    return NextResponse.json({ success: true, status: body.decision === "confirm" ? "validated" : "disputed" });
  }

  // --- COURSES & ENROLLMENT ---
  if (slug[0] === "courses" && slug[1] && slug[2] === "enroll") {
    const courseId = Number(slug[1]);
    const course = COURSES_DATA.find((c: any, i: number) => i + 1 === courseId || c.title.includes(String(courseId)));
    const newEnroll = {
      id: store.enrollments.length + 1,
      course_id: courseId,
      title: course ? course.title : `Enrolled Course #${courseId}`,
      provider: course ? course.provider : "ExcelUp AI Academy",
      url: course ? course.url : "https://excelupai.demo/courses",
      progress: 0,
      status: "active",
      skills: course ? course.skills : [],
    };
    store.enrollments.unshift(newEnroll);
    return NextResponse.json(newEnroll);
  }

  if (slug[0] === "enrollments" && slug[1] && slug[2] === "progress") {
    const enrollId = Number(slug[1]);
    const en = store.enrollments.find((e) => e.id === enrollId);
    if (en) {
      en.progress = body.progress ?? 100;
      if (en.progress >= 100) en.status = "completed";
    }
    return NextResponse.json({ success: true });
  }

  // --- GAUNTLETS ---
  if (slug[0] === "gauntlets" && slug[1] && slug[2] === "submit") {
    const gid = Number(slug[1]);
    const sub = {
      id: store.submissions.length + 1,
      opp_id: gid,
      title: gid === 1 ? "Solar PV Site Safety Challenge" : "EV Battery Diagnostics Challenge",
      gauntlet_title: gid === 1 ? "Solar PV Site Safety Challenge" : "EV Battery Diagnostics Challenge",
      company: gid === 1 ? "SunRay Energy" : "EV Motors Maharashtra",
      candidate_ref: `TRN-${String(user.id).padStart(5, "0")}`,
      candidate_user_id: user.id,
      status: "submitted",
      submission_url: body.submission_url,
      writeup: body.writeup,
      reviewed_at: null,
    };
    store.submissions.unshift(sub);
    return NextResponse.json(sub);
  }

  // --- POST OPPORTUNITIES (Posting Builder) ---
  if (path === "opportunities") {
    const newId = Math.floor(Math.random() * 900) + 200;
    return NextResponse.json({
      success: true,
      id: newId,
      ...body,
    });
  }

  // --- FACULTY ENROLLMENT ---
  if (slug[0] === "faculty" && slug[1] === "opportunities" && slug[2] && slug[3] === "enroll") {
    return NextResponse.json({ success: true, enrolled_id: Number(slug[2]) });
  }

  // --- COMPANY ACTIONS ---
  if (path === "company/shortlist") {
    return NextResponse.json({ shortlisted: body.application_ids || [] });
  }

  if (slug[0] === "company" && slug[1] === "applications" && slug[2] && slug[3] === "status") {
    return NextResponse.json({ application_id: Number(slug[2]), status: body.status });
  }

  if (slug[0] === "company" && slug[1] === "gauntlet-submissions" && slug[2] && slug[3] === "review") {
    const subId = Number(slug[2]);
    const sub = store.submissions.find((s) => s.id === subId);
    if (sub) {
      sub.status = body.decision === "approve" ? "approved" : "rejected";
      sub.reviewed_at = new Date().toISOString();
    }
    return NextResponse.json({ success: true, status: sub ? sub.status : "reviewed" });
  }

  // --- OPPORTUNITIES APPLY ---
  if (slug[0] === "opportunities" && slug[1] && slug[2] === "apply") {
    const oppId = Number(slug[1]);
    const now = new Date().toISOString();
    store.applications.unshift({
      id: store.applications.length + 1,
      opp_id: oppId,
      title: oppId === 101 ? "Solar PV O&M Technician" : oppId === 102 ? "EV Service Technician" : "Solar PV Installer",
      company: oppId === 101 ? "SunRay Energy" : oppId === 102 ? "EV Motors Maharashtra" : "ExcelUp Partner",
      kind: oppId === 102 ? "internship" : "job",
      status: "applied",
      score: 85,
      created_at: now,
      opportunity: {
        id: oppId,
        title: oppId === 101 ? "Solar PV O&M Technician" : oppId === 102 ? "EV Service Technician" : "Solar PV Installer",
        company: oppId === 101 ? "SunRay Energy" : oppId === 102 ? "EV Motors Maharashtra" : "ExcelUp Partner",
        kind: oppId === 102 ? "internship" : "job",
        location: oppId === 102 ? "Nashik" : "Pune",
      },
      events: [{ type: "applied", ts: now }],
      feedback: null,
    });
    return NextResponse.json({ success: true, status: "applied" });
  }

  // --- ADAPTIVE ASSESSMENT ---
  if (path === "assess/start") {
    const sId = ++store.sessionCounter;
    const sess = {
      session_id: sId,
      skill: "Battery Diagnostics",
      theta: 0.0,
      sem: 0.5,
      answered_count: 0,
      status: "in_progress",
      level_estimate: 2.5,
      served: {
        item_id: 1,
        stem: "A healthy lithium-ion EV battery cell at rest should read roughly:",
        options: ["3.6-3.7 V per cell", "1.2 V per cell", "12 V per cell", "0.9 V per cell"],
        difficulty_b: -1.3,
        difficulty_label: "foundation",
        skill_type: "Diagnostic Knowledge",
      },
    };
    store.assessSessions[sId] = sess;
    return NextResponse.json(sess);
  }

  if (slug[0] === "assess" && slug[1] && slug[2] === "answer") {
    const sId = Number(slug[1]);
    const sess = store.assessSessions[sId] || {
      session_id: sId,
      theta: 0.5,
      sem: 0.35,
      answered_count: 1,
      level_estimate: 3.2,
      status: "in_progress",
    };
    sess.answered_count = (sess.answered_count || 0) + 1;
    sess.theta = Number((sess.theta + 0.35).toFixed(2));
    sess.sem = Number(Math.max(0.2, sess.sem - 0.08).toFixed(2));
    sess.level_estimate = Number(Math.min(5, 2.5 + sess.theta * 0.8).toFixed(1));

    if (sess.answered_count >= 5 || sess.sem <= 0.25) {
      sess.status = "completed";
      sess.served = null;
    } else {
      sess.served = {
        item_id: sess.answered_count + 1,
        stem: "Which tool measures a pack's internal resistance non-destructively?",
        options: ["AC impedance meter (1 kHz)", "Hydrometer", "Clamp meter on DC bus at rest", "Torque wrench"],
        difficulty_b: 0.4,
        difficulty_label: "intermediate",
        skill_type: "Diagnostic Method",
      };
    }
    store.assessSessions[sId] = sess;
    return NextResponse.json(sess);
  }

  // --- SIMULATOR ---
  if (path === "simulator/what-if") {
    const lvl = Number(body.hypothetical_level) || 4;
    return NextResponse.json({
      skill: "Battery Diagnostics",
      hypothetical_level: lvl,
      avg_delta: 14.5,
      newly_eligible: ["EV Service Technician · EV Motors Maharashtra", "Traction Battery QC Assistant · Pune"],
      results: [
        {
          opp_id: 102,
          title: "EV Service Technician",
          company: "EV Motors Maharashtra",
          kind: "job",
          score_before: 58,
          score_after: 86,
          delta: 28,
          eligible_before: false,
          eligible_after: true,
        },
        {
          opp_id: 105,
          title: "Battery Maintenance Lead",
          company: "Tata AutoComp Systems",
          kind: "job",
          score_before: 64,
          score_after: 88,
          delta: 24,
          eligible_before: false,
          eligible_after: true,
        },
      ],
    });
  }

  // --- RESUME SCAN ---
  if (path === "resume/scan") {
    const extracted = [
      { skill_id: 1, name: "Solar PV Installation", level: 4 },
      { skill_id: 2, name: "Solar Site Survey", level: 3.5 },
      { skill_id: 3, name: "Electrical Earthing", level: 3 },
      { skill_id: 4, name: "Teamwork & Safety Protocols", level: 4 },
    ];
    return NextResponse.json({
      added: extracted,
      path: "regex_llm_hybrid",
      extracted_skills: extracted.map((s) => s.name),
      declared_ids: [1, 2, 3, 4],
      match_summary: "High fit for Solar & Clean Tech trades (4 skills extracted).",
    });
  }

  // --- NOTIFICATIONS READ ---
  if (slug[0] === "notifications" && slug[1] && slug[2] === "read") {
    const nid = Number(slug[1]);
    const notif = store.notifications.find((n) => n.id === nid);
    if (notif) notif.read = true;
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: true });
}
