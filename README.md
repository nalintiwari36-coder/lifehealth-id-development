
# 🩺 LifeHealth ID

### Your health story, always with you.

**A public-benefit digital health platform that helps people securely collect, understand, and share their medical records — for life.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-blue?style=for-the-badge)](https://lifehealth-id-development.vercel.app/)
[![License](https://img.shields.io/badge/📄_License-MIT-green?style=for-the-badge)](LICENSE)
[![Privacy First](https://img.shields.io/badge/🔒_Privacy-First-important?style=for-the-badge)](#-privacy--security)
[![Free Forever](https://img.shields.io/badge/💚_Free-Forever-success?style=for-the-badge)](#-why-lifehealth-id)

</div>

---

## 📸 Product Preview

> Replace these image paths with your actual screenshots inside a `/docs/screenshots` folder.

| Landing Page | Health Dashboard |
|:---:|:---:|
| ![LifeHealth ID Landing Page](docs/screenshots/landing-page.png) | ![LifeHealth ID Dashboard](docs/screenshots/dashboard.png) |

| Medical Records | Secure Sharing |
|:---:|:---:|
| ![Medical Records](docs/screenshots/records.png) | ![Secure Sharing](docs/screenshots/sharing.png) |

---

## ✨ What is LifeHealth ID?

**LifeHealth ID** is a secure digital health identity platform designed to become a person’s lifelong home for medical information.

Instead of losing prescriptions in WhatsApp chats, keeping reports in email folders, or repeating your medical history at every clinic, LifeHealth ID gives you one organized place to manage your health story.

<div align="center">

### 🧩 Collect → Understand → Share

</div>

| Step | What it means |
|---|---|
| 📥 **Collect** | Store reports, prescriptions, vaccinations, allergies, medications, and health documents in one secure place |
| 🧠 **Understand** | Keep health information organized so it is easier to review, prepare for appointments, and understand over time |
| 🔗 **Share** | Share only the information you choose, with the people you choose, for the duration you choose |

---

## 🚀 Key Features

### 🗂️ Lifelong Medical Records
Keep your health documents organized in one place:

- Lab reports
- Prescriptions
- Vaccination records
- Scan and imaging documents
- Hospital summaries
- Insurance documents
- Doctor notes and personal health notes

### 👤 Personal Health Profile
Create a complete health identity that can include:

- Name and basic profile details
- Blood group
- Allergies
- Chronic conditions
- Current medications
- Emergency contacts
- Insurance details
- Doctor and clinic information

### 🔐 User-Controlled Sharing
You decide:

- **Who** can see your information
- **What** they can see
- **Why** they can see it
- **How long** they can access it

No blanket access. No hidden sharing. Your records remain under your control.

### 📊 Simple Health Dashboard
The dashboard gives users a clear overview of their health information, including records, upcoming items, and sharing status.

### 🆓 Free and Accessible
LifeHealth ID is built as a public-benefit platform:

- No paywalls
- No ads
- No selling health data
- Designed to remain accessible for everyone

---

## 🎯 Who Is It For?

| User | How LifeHealth ID Helps |
|---|---|
| 🧑 **Individuals** | Keep personal medical records organized and accessible |
| 👨‍👩‍👧 **Families** | Manage health information for children, parents, and dependents |
| ❤️ **People with chronic conditions** | Track ongoing conditions, medicines, reports, and appointments |
| 🧓 **Caregivers** | Support elderly family members with organized health information |
| 🏥 **Patients** | Share relevant records with doctors during consultations |
| 🚑 **Emergency situations** | Make critical information easier to locate when it matters most |

---

## 💚 Why LifeHealth ID?

> **Your records belong to you.**

Traditional health records are often scattered across hospitals, emails, WhatsApp messages, paper files, and memory.

LifeHealth ID brings them together in a secure, user-controlled digital home.

| Traditional Health Records | LifeHealth ID |
|---|---|
| Paper files get lost | 📁 Digital and organized |
| Reports spread across apps | 🗂️ One secure health home |
| Difficult to share securely | 🔗 Controlled sharing |
| Hard to access during emergencies | 🚑 Health information ready when needed |
| Users often lose control | 🔐 Privacy-first and user-owned |

---

## 🛠️ Tech Stack

> Update this section based on your actual repository technologies.

| Layer | Technology |
|---|---|
| Frontend | React / Next.js |
| Styling | Tailwind CSS |
| Deployment | Vercel |
| Authentication | To be added / configured |
| Database | To be added / configured |
| File Storage | To be added / configured |
| Analytics | To be added / configured |

---

## ⚙️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone [https://github.com/nalintiwari36-coder/lifehealth-id-development.git](https://github.com/nalintiwari36-coder/lifehealth-id-development.git)
cd lifehealth-id-development
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Add your authentication, database, and storage credentials here
```

### 4️⃣ Run the development server

```bash
npm run dev
```

### 5️⃣ Open the app

Visit:

```bash
http://localhost:3000
```

---

## 🧭 Product Roadmap

### ✅ Current Focus
- Clear privacy-first product identity
- Health record collection
- User-controlled sharing concept
- Public-benefit, free-to-use positioning

### 🚧 In Progress
- Improved onboarding experience
- Stronger dashboard actions
- Enhanced record organization
- Better mobile experience

### 🔮 Planned Features
- 🪪 Emergency QR health card
- 📅 Appointment and medication reminders
- 👨‍👩‍👧 Family health profiles
- 📄 Document upload and categorization
- 🔗 Expiring secure share links
- 🧠 Plain-language explanations for reports
- 📤 Download and export personal data
- 🏥 Clinic and doctor partnership tools

---

## NVIDIA Hackathon Readiness

This project targets the Nebius × NVIDIA Global AI Hackathon. The official event guidance reviewed for this implementation requires: (1) use of Nebius Token Factory or Nebius AI Cloud, (2) at least one eligible NVIDIA open-source model, (3) a working demo, (4) a public repository with an open-source license, (5) a demonstration video under three minutes, and (6) feedback on the Nebius and NVIDIA tools. Eligibility, dates, prize restrictions, and final submission instructions must be rechecked against the event's live rules before submission; this repository does not claim eligibility or submission completion.

### Current implementation checklist

- [x] NVIDIA Nemotron is requested through the Vercel AI Gateway model route (`nvidia/nemotron-3-nano-30b-a3b`), not a mock response.
- [x] Server-side session protection is required before report analysis; audit events record AI requests.
- [x] The prompt receives the report text and a deterministic source-facts extraction, and instructs the model not to invent values or reference ranges.
- [x] The UI labels the source document, report date, extracted facts/interpretation boundary, and medical disclaimer.
- [x] Synthetic fixtures measure extraction accuracy, factual consistency, latency, and malformed-input handling.
- [ ] Nebius Token Factory deployment/provider configuration and the under-three-minute demo video remain release tasks and are not asserted here.

Run the evaluation suite with `pnpm test`; its metrics are printed from the current test run and are not hardcoded.

### Demonstration path

1. Sign in as a patient and open the protected dashboard.
2. Upload a supported report through the authenticated upload route, then open the report assistant.
3. Submit report text containing values, units, and the report's own reference ranges; confirm the response shows the source and model label.
4. Grant a doctor scoped consent, verify the doctor can access only authorized records, then revoke consent and verify access is denied.
5. Review audit events and notifications for the upload, explanation, consent grant, access, and revocation actions.

## 🔒 Privacy & Security

LifeHealth ID is designed around a simple principle:

> **Health data belongs to the user — not to platforms, advertisers, or third parties.**

Our privacy principles:

- 🔒 **Private by design**
- 👤 **Users control access**
- 🚫 **No selling health data**
- 📤 **Data portability**
- 💚 **Free for everyone**

> ⚠️ **Medical Disclaimer:**  
> LifeHealth ID is a health-record management platform. It does not provide medical diagnosis, treatment, or emergency medical services. Always consult a qualified healthcare professional for medical advice.

---

## 🤝 Contributing

Contributions are welcome!

If you would like to improve LifeHealth ID:

1. Fork the repository
2. Create a new branch  
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Commit your work  
   ```bash
   git commit -m "Add: your feature description"
   ```
5. Push to your branch  
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a Pull Request

---

## 📬 Connect

<div align="center">

**Built with care by [Nalin Tiwari](https://github.com/nalintiwari36-coder)**

[![GitHub](https://img.shields.io/badge/GitHub-nalintiwari36--coder-black?style=for-the-badge&logo=github)](https://github.com/nalintiwari36-coder)
[![Website](https://img.shields.io/badge/🌐_Website-LifeHealth_ID-blue?style=for-the-badge)](https://lifehealth-id-development.vercel.app/)

</div>

---

<div align="center">

### 💚 LifeHealth ID

**Your health story, always with you.**

</div>
