<p align="center">
  <img src="public/logo.svg" width="96" height="96" alt="RightWay AI Logo" />
</p>

<h1 align="center">RightWay AI — Public Web Platform</h1>

<p align="center">
  <strong>Public Marketing Storefront, European Career Scrollytelling & Portal Routing Engine</strong><br />
  Interactive Career Scrollytelling • Live ATS Checker Router • Blue Card Radar Preview • Cross-Portal Gateway
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React_18_+_Vite-61DAFB?logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Port-3002-blue" alt="Port 3002" />
  <img src="https://img.shields.io/badge/Host-rightway.ai-purple" alt="rightway.ai" />
  <img src="https://img.shields.io/badge/Design-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

---

## 🌐 Ecosystem Role & Connections

`rightway-public` serves as the primary storefront and routing hub (`rightway.ai`) for the entire RightWay European Recruitment Ecosystem.

- **Runs On**: Port `3002` (`rightway.ai`)
- **Outbound Surface Routing**: Configured in `src/lib/surfaces.js`:
  - **Candidates**: Directed to `candidate.rightway.ai` (Port `3003`) for Fact Vault, CV generation, and jobs.
  - **Recruiters**: Directed to `recruiter.rightway.ai` (Port `3005`) for employer registration and ATS hiring workspaces.
  - **Staff / Admin**: Dedicated separate domain `admin.rightway.ai` (Port `3006`).
- **ATS Checker Delegation**: `/ats-checker` performs a client-side handoff to the live interactive evaluator at `candidate.rightway.ai/ats-checker`.
- **Backend Service**: Validates authentication credentials and session tokens via `http://localhost:3004/auth`.

---

## 🏛️ Route Matrix & Features

Configured in `src/App.jsx`:

| Route | View Component | Description |
| :--- | :--- | :--- |
| `/` | `HomePage` | Public storefront: Hero, value proposition, European career scrollytelling walkthrough |
| `/ats-checker` | `AtsRedirect` | Client-side delegation to candidate ATS evaluator (`candidate.rightway.ai/ats-checker`) |
| `/legal/gdpr-privacy` | `PrivacyPage` | Statutory GDPR Articles 13 & 14 candidate privacy notice & regulatory disclosures |
| `/legal/terms` | `TermsPage` | Enterprise platform service terms, acceptable use, and compliance policies |
| `/auth/login` | `LoginPage` | Unified authentication portal with selector for Candidate, Recruiter, and Staff |
| `/auth/register` | `RegisterPage` | Candidate registration entry point routing to specialized candidate onboarding |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18.0.0+
- Running `rightway-backend` API on `http://127.0.0.1:3004`

### Installation & Run

```bash
# Install dependencies
npm install

# Start development server (Port 3002)
npm run dev
```

Application is live at: **http://localhost:3002** (Production: `rightway.ai`)

### Environment Configuration

Create a `.env` file in the repository root:

```env
VITE_API_URL=http://localhost:3004
VITE_CANDIDATE_URL=https://candidate.rightway.ai
VITE_RECRUITER_URL=https://recruiter.rightway.ai
VITE_ADMIN_URL=https://admin.rightway.ai
```

---

## 📁 Repository Structure

```text
├── public/
│   ├── favicon.svg
│   └── logo.svg
├── src/
│   ├── components/
│   │   ├── CareerJourneyScrollytelling.jsx# European career progression walkthrough
│   │   ├── Logo.jsx                       # RightWay brand mark
│   │   └── PillSwap.jsx                   # Role pill toggle
│   ├── lib/
│   │   ├── api.js                         # API fetch helper
│   │   └── surfaces.js                    # Outbound surface URL router
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx              # Public authentication hub
│   │   │   └── RegisterPage.jsx           # Candidate registration
│   │   ├── legal/
│   │   │   ├── PrivacyPage.jsx            # GDPR Article 13/14 disclosures
│   │   │   └── TermsPage.jsx              # Platform service terms
│   │   └── HomePage.jsx                   # Main landing page
│   ├── App.jsx                            # Public router configuration
│   ├── main.jsx                           # App entry point
│   └── globals.css                        # Tailwind CSS styles
├── index.html
├── package.json
└── vite.config.js
```
