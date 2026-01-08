# 🚀 Creative Autopilot

### *AI-Powered Creative Automation Platform*

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-active-success)
![AI](https://img.shields.io/badge/AI-Generative-purple)
![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript-blue)
![Backend](https://img.shields.io/badge/Backend-Supabase%20%7C%20Deno-green)
![Vision%20AI](https://img.shields.io/badge/Vision%20AI-Google%20Gemini-orange)
![Image%20Gen](https://img.shields.io/badge/Image%20Gen-FLUX.1%20%7C%20SD3-red)

> **Creative Autopilot** is an AI-driven creative automation system that acts as a **virtual creative director**, enabling brands to generate **high-quality, brand-compliant, multi-platform marketing creatives in seconds**.

---

## 🏆 Why Creative Autopilot?

### 🚨 The Problem

Marketing teams struggle with:

* Time-consuming manual creative design
* Brand inconsistency across platforms
* Frequent ad guideline violations
* Platform-specific size & format complexity
* Heavy dependency on designers

### 💡 The Innovation

Creative Autopilot introduces:

* **Multi-Agent AI architecture**
* **Automated compliance validation**
* **AI-based quality scoring**
* **One-click multi-platform exports**
* **No-design-skills-required workflow**

### 📈 The Impact

* ⏱️ **Hours → Seconds** creative turnaround
* 🎯 **100% guideline-aware creatives**
* 💸 Lower creative costs
* 🚀 Faster campaign launches
* 🧠 Scalable creative intelligence

---

## 🧠 Core Features

* 🤖 **AI Creative Generation** (FLUX.1 / SD3)
* 🎨 **Brand Analyzer** (colors, style, personality)
* 🛡️ **Auto Compliance Checker**
* 📊 **Quality Scoring System**
* 🖱️ **Drag-and-Drop Canvas Editor**
* 🔁 **Creative Variations Generator**
* 🔥 **Attention Heatmaps**
* 📦 **Multi-Platform Export**

---

## 🧩 Multi-Agent AI Architecture

| Agent                   | Responsibility              |
| ----------------------- | --------------------------- |
| **Brand Stylist Agent** | Extracts brand identity     |
| **Designer Agent**      | Generates layouts & visuals |
| **Compliance Agent**    | Checks ad & platform rules  |
| **Quality Agent**       | Scores creative quality     |
| **Attention Agent**     | Generates heatmaps          |

---

## 📸 Screenshots

(<img width="1881" height="837" alt="Screenshot 2026-01-02 201234" src="https://github.com/user-attachments/assets/eb50ea68-edb5-478c-a862-d134821f3ad9" />
)

<img width="1857" height="857" alt="Screenshot 2026-01-02 201340" src="https://github.com/user-attachments/assets/627d0efd-e690-401b-ba0e-769dd6211159" />
<img width="1801" height="880" alt="Screenshot 2026-01-02 201358" src="https://github.com/user-attachments/assets/203bff0d-a66a-4154-9b39-4f4c1db1eb25" />

---

## 🏗️ System Architecture

```text
Frontend (React + Vite)
│
├── Auth
├── Brand Analyzer
├── Creative Generator
├── Canvas Editor
├── Quality Scoring UI
│
└── Supabase Edge Functions
     ├── analyze-brand
     ├── generate-creative
     ├── edit-creative
     ├── check-compliance
     ├── score-creative
     └── analyze-attention
```

---

## 🛠️ Tech Stack

### Frontend

* React 18 + TypeScript
* Vite
* Tailwind CSS + shadcn/ui
* Framer Motion
* Fabric.js
* React Query

### Backend

* Supabase (PostgreSQL + Auth)
* Supabase Edge Functions (Deno)

### AI / ML

* Google Gemini Vision
* FLUX.1 (NScale)
* Stability AI SD3
* Hugging Face (fallback)

---

## ⚙️ Local Setup

```bash
git clone https://github.com/Tan28bha/Creative-Autopilot
cd creative-autopilot
npm install
npm run dev
```

Deploy edge functions:

```bash
supabase functions deploy
```

---

## 🔄 User Workflow

1. Sign up / Login
2. Upload brand assets
3. AI analyzes brand identity
4. Generate creatives
5. Edit / regenerate variations
6. Auto-check compliance & quality
7. Export for all platforms

---

# ⚙️ Setup & Installation

## Prerequisites

Make sure you have the following installed:

* **Node.js** `>= 18`
* **npm** or **pnpm**
* **Supabase CLI**
* A **Supabase account**
* API keys for AI services (listed below)

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

GOOGLE_AI_API_KEY=your_gemini_api_key
NSCALE_API_KEY=your_nscale_api_key
STABILITY_API_KEY=your_stability_api_key   # optional
HUGGINGFACE_API_KEY=your_hf_api_key        # optional
```

> ⚠️ Never commit `.env` files to GitHub.

---

## 📦 Dependencies

### Frontend

* React 18
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui (Radix UI)
* Framer Motion
* Fabric.js
* React Query
* React Hook Form + Zod

### Backend

* Supabase (PostgreSQL + Auth)
* Supabase Edge Functions (Deno)

### AI / ML Services

* Google Gemini Vision API
* FLUX.1 (via NScale)
* Stability AI SD3 (optional)
* Hugging Face Inference API (fallback)

---

## 🛠️ Local Setup Steps

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Tan28bha/Creative-Autopilot.git
cd creative-autopilot
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Start the frontend

```bash
npm run dev
```

App will be available at:

```
http://localhost:8080
```

---

### 4️⃣ Setup Supabase

```bash
supabase login
supabase init
supabase start
```

---

### 5️⃣ Deploy Edge Functions

```bash
supabase functions deploy
```

---

## ▶️ Usage Instructions

### Step 1: Authentication

* Sign up / login using email & password
* Supabase handles session management

---

### Step 2: Upload Brand Assets

* Upload logos, packshots, or past creatives
* Assets are stored securely in Supabase Storage
* Brand Analyzer extracts:

  * Colors
  * Typography
  * Visual style
  * Brand personality

---

### Step 3: Generate Creatives

* Choose creative style
* (Optional) Select product image
* AI generates multiple creative variations
* Powered by FLUX.1 / SD3

---

### Step 4: Edit & Customize

* Open creative in Canvas Editor
* Drag & drop layers
* Edit text, resize elements
* Merge products into backgrounds
* Regenerate variations if needed

---

### Step 5: Compliance & Quality Check

* Run auto compliance check
* View platform readiness
* See quality score breakdown:

  * Visual hierarchy
  * Brand consistency
  * Readability
  * Platform fitness

---

### Step 6: Export

* Select output platforms (Instagram, Facebook, etc.)
* Download optimized creatives
* Correct dimensions & size (<500KB)

---

## 🧪 Development Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

## 🧠 Troubleshooting

### Image generation is slow?

* FLUX.1 takes 10–30 seconds
* Check API rate limits
* Verify API keys

### Supabase functions failing?

* Ensure `.env` variables are set
* Run `supabase functions serve` locally
* Check Supabase logs

---


## 🚀 Roadmap

### Short-Term

* Batch generation
* Templates library
* Collaboration & version history

### Medium-Term

* A/B testing
* Performance analytics
* Mobile app
* Video creatives

### Long-Term

* Brand-trained AI models
* White-label solution
* Shopify & Ads Manager integration

---

## 🔒 Security

* Supabase Auth
* Row-Level Security
* Secure storage
* Environment-based secrets

---

## 📄 License

MIT License © 2026

---

## 🙌 Final Note

> **Creative Autopilot is not just an AI image generator.**
> It is a **creative intelligence system** that understands brands, follows rules, evaluates quality, and scales marketing creativity autonomously.

---


