# ExcelUp AI (Next.js Full-Stack)

**Longitudinal skilling-outcomes and impact-measurement platform** - Smart India Hackathon PS 26135, Government of Maharashtra, Department of Skills, Employment, Entrepreneurship and Innovation.

Tagline: **"Skilling outcomes, measured honestly."**

---

## 🚀 Deployed on Vercel in 1-Click

The entire application (frontend + backend data & APIs) is now converted into a **unified full-stack Next.js (App Router)** application! 
No separate Python server, no external database dependencies, and no complicated microservice setup are required to deploy.

### How to Deploy to Vercel:

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "Convert backend and frontend to full-stack Next.js for Vercel"
   git push origin main
   ```
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your repository `kshivamsoni08/excelup_ai`.
4. Vercel automatically detects **Next.js** at the root:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
5. Click **"Deploy"**! Your app will be live with a `.vercel.app` URL in ~1 minute.

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run the Next.js development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 👥 Demo Accounts (Password: `demo1234`)

| Role | Email | Why they matter |
|---|---|---|
| **Officer (hero)** | `sunita.rao@skills.mahdemo.gov` | Impact dashboard, ranking-flip toggle, drill-downs, workbench, PII audit |
| **Trainee (hero)** | `priya.patil@demo.trainee` | Solar PV @ ITI Pune, rising wage curve, credential, responds to live wave |
| **Trainee (non-placed)** | `rahul.jadhav@demo.trainee` | Reason codes + skill-gap remediation story |
| **Employer** | `hr@sunray.demo` | Validation queue (Priya's episode is pending) |
| **Provider** | `principal@itipune.demo` | ITI Pune outcome dashboard |
| **Provider** | `principal@itinashik.demo` | ITI Nashik (EV - flagged programme) |
| **Admin** | `admin@excelupai.demo` | Platform stats |

---

## 🎯 The Demo Flows Supported

1. **The Thesis in One Toggle**:
   - Placement-day view: *EV Assembly Technician (ITI Nashik)* sits #1 (~92%).
   - Outcome view: ranking flips! *Solar PV Installer (ITI Pune)* takes #1 (OQI ~93), while Nashik EV drops (OQI ~59).
   - Auto-flags: `vanity_metric`, `oversupplied`, `obsolete`.
2. **Programme Drill-down**:
   - EV Assembly Technician & Solar PV Installer: published OQI math, placement decay curve, median wage progression, attrition Pareto, demographic equity with privacy suppression (`n < 5`), skill-gap diagnostics.
3. **Run Follow-up Wave**:
   - Officer triggers an ad-hoc wave on Solar Pune cohort.
4. **Trainee One-tap Response**:
   - Priya Patil sees active check-in card on *My Outcome Ledger*, reports wage job + band 15-20k in one tap.
5. **Employer Validation**:
   - `hr@sunray.demo` confirms Priya's employment episode; validation rate ticks up.
6. **Consent Manager**:
   - Priya revokes `wage` scope; officer wage coverage drops live with privacy preserved.
7. **Assisted Workbench & PII Audit**:
   - Officer opens non-responder queue, records assisted outcome; every card open is permanently recorded in the PII Access Audit trail.
8. **Rahul (Non-Placed Story)**:
   - Non-placement reasons, skill-gap diagnostic (Battery Diagnostics gap 1.4) mapped to remedial courses.
9. **Verifiable Credential**:
   - Priya's signed Ed25519 & Merkle proof credential verifies authentic green at `/verify/1`.
