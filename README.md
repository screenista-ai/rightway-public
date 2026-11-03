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
  <img src="https://img.shields.io/badge/Host-rightway.com-purple" alt="rightway.com" />
  <img src="https://img.shields.io/badge/Design-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Compliance-GDPR_Ready-rose" alt="GDPR" />
</p>

---

## 🎯 Public Marketing & Ecosystem Gateway

`rightway-public` serves as the public-facing storefront and unified entry point for the RightWay European Recruitment Ecosystem:

1. **Interactive European Career Scrollytelling**: Engaging visual walkthrough guiding international talent through qualification verification, Europass tailoring, EU Blue Card thresholds, and employer interview workflows.
2. **Instant ATS Score Checker**: Free public tool enabling candidates to upload their existing resume and evaluate it against standard European Applicant Tracking Systems.
3. **EU Blue Card Radar Preview**: Educational breakdown of national salary requirements (such as Germany §18g AufenthG), shortage occupation lists, and ANABIN database recognition standards.
4. **Unified Portal Navigation**: Streamlined sign-in and onboarding entryways routing candidates, European employers, and platform staff to their respective specialized workspaces (`candidate.rightway.com`, `recruiter.rightway.com`, and `admin.rightway.com`).

---

## 🏛️ Public Routes

| Route | View | Description |
| :--- | :--- | :--- |
| `/` | Landing Page | Hero banner, scrollytelling walkthrough, feature highlights |
| `/ats-checker` | Free ATS Tool | Algorithmic resume scoring and formatting diagnostics |
| `/privacy` | Privacy Notice | Statutory GDPR privacy policy and candidate rights notice |
| `/terms` | Terms of Service | Enterprise terms, acceptable use, and platform agreements |
| `/auth/login` | Unified Sign In | Portal selector routing actors to candidate/recruiter/admin |
| `/auth/register` | Candidate Onboarding | Direct candidate registration with citizenship claim intake |

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

Application is live at: **http://localhost:3002** (Production: `rightway.com`)

### Environment Configuration

Create a `.env` file in the repository root:

```env
VITE_API_URL=http://localhost:3004
```

---

## 📁 Repository Structure

```text
├── public/
│   ├── favicon.svg
│   └── logo.svg
├── src/
│   ├── components/
│   │   ├── AtsScorePanel.jsx              # ATS score evaluation widget
│   │   ├── CareerJourneyScrollytelling.jsx# European career progression walkthrough
│   │   ├── Logo.jsx                       # RightWay brand mark
│   │   └── PillSwap.jsx
│   ├── lib/
│   │   └── api.js                         # API fetch helper
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx              # Public authentication hub
│   │   │   └── RegisterPage.jsx           # Candidate registration
│   │   ├── legal/
│   │   │   ├── PrivacyPage.jsx            # GDPR Article 13/14 disclosures
│   │   │   └── TermsPage.jsx              # Platform service terms
│   │   ├── AtsCheckerPage.jsx             # Public resume testing page
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
