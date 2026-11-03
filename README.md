<p align="center">
  <img src="public/logo.svg" width="96" height="96" alt="RightWay AI Logo" />
</p>

<h1 align="center">RightWay AI — Public Web Platform</h1>

<p align="center">
  <strong>Enterprise European Recruitment Marketing, Candidate Onboarding & Public Landing Engine</strong><br />
  European Career Scrollytelling • Live ATS Checker • Blue Card Radar Preview • Ecosystem Gateway
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React_18_+_Vite-61DAFB?logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Port-3002-blue" alt="Port 3002" />
  <img src="https://img.shields.io/badge/Host-rightway.ai-purple" alt="rightway.ai" />
  <img src="https://img.shields.io/badge/Design-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Compliance-GDPR_Ready-rose" alt="GDPR" />
</p>

---

## 🎯 Public Marketing & Ecosystem Gateway

`rightway-public` serves as the public-facing storefront and unified entry point for the RightWay European Recruitment Ecosystem (`rightway.ai`):

1. **Interactive European Career Scrollytelling**: Engaging visual walkthrough guiding international talent through qualification verification, Europass tailoring, EU Blue Card thresholds, and employer interview workflows.
2. **Instant ATS Score Checker**: Direct routing to the interactive candidate ATS evaluator (`candidate.rightway.ai/ats-checker`) to test resumes against standard European Applicant Tracking Systems.
3. **EU Blue Card Radar Preview**: Educational breakdown of national salary requirements (such as Germany §18g AufenthG), shortage occupation lists, and ANABIN database recognition standards.
4. **Unified Portal Navigation**: Streamlined sign-in and onboarding entryways routing candidates, European employers, and platform staff to their respective specialized workspaces (`candidate.rightway.ai`, `recruiter.rightway.ai`, and `admin.rightway.ai`).

---

## 🏛️ Public Route Matrix & Features

Configured in `src/App.jsx`:

| Route | View Component | Description |
| :--- | :--- | :--- |
| `/` | `HomePage` | Public storefront: Hero, value proposition, European career scrollytelling |
| `/ats-checker` | `AtsRedirect` | Client-side redirection to Candidate ATS checker (`candidate.rightway.ai/ats-checker`) |
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
# Clone the repository
git clone https://github.com/anuj-screenista/rightway-public.git
cd rightway-public

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

---

<p align="center">Part of the <a href="https://github.com/anuj-screenista">RightWay European Recruitment Ecosystem</a>.</p>
