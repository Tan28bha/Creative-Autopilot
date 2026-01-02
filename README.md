# 🚀 Creative Autopilot

**AI-Powered Creative Automation Platform for Scalable, Compliant Marketing**

Creative Autopilot is an autonomous, AI-driven system that acts like a **virtual creative director**. It enables brands and advertisers to generate **professional, brand-consistent, and platform-compliant marketing creatives in seconds**, without requiring any design skills.

> ⏱️ Reduce creative production time from **hours → seconds**
> 🎯 Ensure **brand consistency + platform compliance**
> 📦 Export creatives for **multiple platforms instantly**

---

## 🧠 Problem Statement

Marketing teams and e-commerce brands face major challenges when producing creatives at scale:

* ⌛ Manual, time-consuming design workflows
* 🎨 Inconsistent brand identity across campaigns
* ⚠️ High risk of violating platform ad guidelines
* 📐 Different size & format requirements per platform
* 🧑‍🎨 Heavy dependency on designers and creative teams

---

## ✅ Our Solution

**Creative Autopilot** eliminates these issues by combining **Generative AI, Vision AI, and intelligent automation**:

* 🤖 **Automated Creative Generation** using AI
* 🧩 **Multi-Agent AI Architecture** (Brand, Design, Compliance, Quality)
* 🛡️ **Auto-Compliance Validation**
* 📊 **Quality Scoring System**
* 📤 **Multi-Format Export** from a single design
* 🖱️ **Drag-and-Drop Canvas Editor**

📌 *Anyone can now create high-quality, compliant creatives—no design background required.*

---

## 🧩 Key Capabilities

* **Brand Analysis**

  * Extracts brand colors, typography, style & personality from uploaded assets
* **AI Creative Generation**

  * Uses FLUX.1 & Stability AI diffusion models
* **Compliance Checking**

  * Validates creatives against platform & brand guidelines
* **Quality Scoring**

  * Scores creatives across:

    * Visual hierarchy
    * Brand consistency
    * Text readability
    * Platform fitness
* **Creative Editing**

  * Merge products, edit text, regenerate variants
* **Attention Analysis**

  * AI-generated visual attention heatmaps
* **Multi-Platform Export**

  * Instagram, Facebook, LinkedIn, Pinterest, e-commerce & more
* **Canvas Editor**

  * Layer-based editing with Fabric.js

---

## 🏗️ Architecture Overview


Frontend (React + Vite)
│
├── Auth & Dashboard
├── Brand Analyzer
├── Creative Generator
├── Canvas Editor
├── Quality Score Panel
│
└── REST APIs
     │
     ▼
Supabase (Backend)
│
├── Edge Functions (Deno)
│   ├── analyze-brand
│   ├── generate-creative
│   ├── edit-creative
│   ├── check-compliance
│   ├── score-creative
│   └── analyze-attention
│
├── PostgreSQL Database
└── Supabase Storage
     │
     ▼
AI Services
├── Google Gemini Vision API
├── FLUX.1 (NScale)
├── Stability AI
└── Hugging Face (Fallback)


---

## 🛠️ Tech Stack

### Frontend

* **React 18 + TypeScript**
* **Vite**
* **Tailwind CSS + shadcn/ui**
* **Framer Motion**
* **Fabric.js**
* **React Query**
* **React Hook Form + Zod**

### Backend

* **Supabase**

  * PostgreSQL
  * Edge Functions (Deno)
  * Supabase Auth
  * Supabase Storage

### AI / ML

* **Google Gemini Vision** – brand analysis, compliance, scoring
* **FLUX.1-schnell (NScale)** – image generation
* **Stability AI SD3** – image-to-image editing
* **Hugging Face Inference API** – fallback

---

## 🔐 Environment Variables

Create a `.env` file with:


VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

GOOGLE_AI_API_KEY=
NSCALE_API_KEY=
STABILITY_API_KEY=   # optional
HUGGINGFACE_API_KEY= # optional
---

## ⚙️ Installation & Setup


# Clone the repo
git clone https://github.com/your-username/creative-autopilot.git

# Install dependencies
npm install

# Start development server
npm run dev
---

Supabase Edge Functions:


supabase functions deploy


---

## 🔄 User Workflow

1. **Sign up / Login**
2. **Upload Brand Assets**
3. **AI analyzes brand identity**
4. **Generate creatives**
5. **Edit / merge / regenerate variants**
6. **Check compliance & quality score**
7. **Export for multiple platforms**

---

## 🚧 Current Challenges

* API rate limits (Gemini, NScale)
* Image generation latency (10–30s)
* Brand analysis accuracy with limited assets
* Storage & image size optimization
* Platform-specific compliance depth

---

## 🚀 Future Roadmap

### Short-Term

* Batch creative generation
* Template library
* Enhanced text & visual controls
* Team collaboration
* Version history

### Medium-Term

* A/B testing integration
* Performance analytics
* Public API access
* Mobile app
* Video creative generation

### Long-Term

* Custom brand-trained AI models
* Marketplace for templates
* Enterprise features (SSO, roles)
* White-label solution
* Shopify / Meta Ads integration

---

## 🔒 Security & Privacy

* Supabase Authentication
* Row-Level Security (RLS)
* Secure file uploads
* API keys via environment variables
* Protected routes

---

## 🌟 Why Creative Autopilot?

Creative Autopilot bridges the gap between **AI power and real-world marketing needs**.
It brings **speed, consistency, compliance, and scalability** to creative production—making professional marketing accessible to everyone.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙌 Acknowledgements

* Black Forest Labs (FLUX.1)
* Google Gemini
* Supabase
* Stability AI
* Open-source community

---

