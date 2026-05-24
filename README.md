<div align="center">
  <img src="public/img/logo.jpeg" alt="MedSage Logo" width="200" style="border-radius: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"/>
  <h1>MedSage: The Personal Medical Intelligence System</h1>
  <p><strong>Bridging the gap between consumer lifestyle tracking and clinical-grade medical reasoning.</strong></p>

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Google_MedGemma-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="MedGemma" />
  <img src="https://img.shields.io/badge/Vite-B73BA5?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
</div>

<br />

<div align="center">
  <img src="public/img/Overview.png" alt="MedSage Overview" width="800" style="border-radius: 10px; box-shadow: 0 8px 16px rgba(0,0,0,0.2);"/>
</div>

---

## 🌟 What is MedSage?

**MedSage** is a production-grade personal health intelligence platform designed to act as your **on-device medical expert**. It leverages the power of Google's specialized **MedGemma** model and a Multi-Agent Architecture to provide holistic, privacy-preserving health guidance. 

Unlike generalist AI models, MedSage possesses deep specialized knowledge of medical terminology, drug interactions, and clinical guidelines, ensuring all sensitive data processing happens safely and securely.

---

## 🧠 Core Innovation: The Multi-Agent Ecosystem

The system follows an **Agentic Workflow** where specialized AI personas collaborate under a Lead Coordinator to achieve comprehensive health monitoring and personalized recommendations. Every piece of advice is debated, reviewed, and finalized in a "Daily Consensus Meeting".

<div align="center">
  <img src="public/img/Meeting1.png" alt="Multi-Agent Meeting" width="800" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom: 10px;"/>
  <img src="public/img/Meeting2.png" alt="Multi-Agent Consensus" width="800" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"/>
</div>

<br />

### 🩺 Medical Specialist (Powered by MedGemma)
The heart of the system. It acts as the clinical "safety check" for the entire ecosystem.
- **Clinical Q&A:** Answers user health concerns based on specific medical history and genetic risks.
- **Document Analysis:** Parses complex medical tests (blood panels, radiology) to extract key findings for the longitudinal record.
- **Cross-Agent Verification:** Reviews logs from the Dietitian and Trainer to identify potential contraindications (e.g., advising against high-intensity cardio if a heart condition is detected).

<div align="center">
  <img src="public/img/Medical.png" alt="Medical Agent" width="800" style="border-radius: 10px; border: 1px solid #eee;"/>
</div>

---

### 🤝 Meet The Health Specialists

<table align="center">
  <tr>
    <td align="center" width="50%">
      <h4>🥗 Dietitian</h4>
      <p>AI meal planning & calorie tracking. Suggests nutrition paths optimized for your health profile.</p>
      <img src="public/img/Dietitian.png" alt="Dietitian Agent" width="100%" style="border-radius: 8px;"/>
    </td>
    <td align="center" width="50%">
      <h4>🏋️ Trainer</h4>
      <p>Adaptive workout generation with strict safety checks based on the Medical Specialist's input.</p>
      <img src="public/img/Trainer.png" alt="Trainer Agent" width="100%" style="border-radius: 8px;"/>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <h4>💤 Sleep Specialist</h4>
      <p>Sleep cycle analysis and actionable optimization strategies for recovery and better rest.</p>
      <img src="public/img/Sleep.png" alt="Sleep Agent" width="100%" style="border-radius: 8px;"/>
    </td>
    <td align="center" width="50%">
      <h4>🫂 Counselor</h4>
      <p>Provides empathetic mental health support, stress management, and daily emotional tracking.</p>
      <img src="public/img/Counselor.png" alt="Counselor Agent" width="100%" style="border-radius: 8px;"/>
    </td>
  </tr>
</table>

---

## 📊 Comprehensive User Tracking & Dynamic Memory

MedSage maintains a "Dynamic Memory" that continuously aggregates daily logs, lab results, and personal history. It captures both static data (genetics, allergies) and dynamic daily inputs.

<table align="center">
  <tr>
    <td align="center" width="50%">
      <h4>Personal Profile</h4>
      <img src="public/img/Profile.png" alt="User Profile" width="100%" style="border-radius: 8px;"/>
    </td>
    <td align="center" width="50%">
      <h4>Medical Records Vault</h4>
      <img src="public/img/Record.png" alt="Medical Records" width="100%" style="border-radius: 8px;"/>
    </td>
  </tr>
</table>

---

## 🚀 Kaggle MedGemma Impact Challenge

*This application was created as a submission for the **MedGemma Impact Challenge**.*

### Why MedGemma makes an impact:
By utilizing MedGemma instead of a standard general-purpose LLM, MedSage provides:
1. **Clinical Specificity:** MedGemma's fine-tuning on robust medical datasets allows for more precise interpretation of complex medical terminology and risk factors.
2. **Privacy & Security Readiness:** As an open-weights model, MedGemma can be deployed locally or in HIPAA-compliant private environments. This ensures that a user's sensitive medical history **never leaves their controlled infrastructure**.

<div align="center">
  <img src="public/img/MedGemma.png" alt="MedGemma Architecture" width="600" style="border-radius: 10px; border: 1px solid #ddd;"/>
</div>

---

## 💻 Technical Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** CSS / Tailwind CSS
- **General Reasoning:** Google Gemini 3.1 APIs (handles non-clinical tasks)
- **Clinical Reasoning:** Google MedGemma-4B-IT
- **Database:** Supabase / PostgreSQL / Local SQLite

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn package manager
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/MedSage.git
   cd MedSage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the project root:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Start Exploring**
   Open your browser and navigate to `http://localhost:5173`. You will be greeted by the login portal:

<div align="center">
  <img src="public/img/Login.png" alt="Login Screen" width="600" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-top: 10px;"/>
</div>

---

<div align="center">
  <i>Empowering Personal Health through Localized AI Intelligence.</i>
</div>