MedSage: The Personal Medical Intelligence System
MedSage is a production-grade personal health intelligence platform designed to act as your on-device medical expert. It bridges the gap between consumer lifestyle tracking and clinical-grade medical reasoning by leveraging Google's MedGemma model, ensuring complete data privacy as all processing happens locally.

Key Features
🔒 True Local Inference: Powered by Ollama. All AI operations—from generating meal plans to analyzing MRIs—run entirely on your own hardware. No data leaves your device.
🧠 Deep Medical Specialization: Utilizes MedGemma-4B-IT, a transformer model finetuned by Google on MedPaLM research. It possesses specialized knowledge of medical terminology, drug interactions, and clinical guidelines that generalist models lack.
📋 On-the-Fly Medical Records: A state-of-the-art "Medical Specialist" agent handles complex document analysis in real-time. It ingests and interprets diverse medical inputs, including:
Lab Reports (CBC, Lipid Panels, Thyroid, etc.)
Radiology Reports (X-rays, Ultrasounds)
Pathology Reports
Clinical Notes & Doctor's Summaries
Visual Biometric Data (Skin Lesions, Eye Scans via Llava)
🗂️ Context-Aware Synthesis: The system maintains a "Dynamic Memory" that aggregates daily logs (Nutrition, Fitness, Sleep, Mental Health). The Coordinator Agent uses this context to synthesize personalized, safe, and actionable insights tailored to your specific medical history.
🎯 Proactive Coaching: A suite of specialized agents works in tandem:
Nutritionist: AI meal planning & calorie tracking.
Trainer: Adaptive workout generation with safety checks.
Sleep Specialist: Sleep cycle analysis & dream interpretation.
Counselor: Empathetic mental health support.
Architecture: Multi-Agent System (MAS)
The system follows an Agentic Workflow where specialized agents collaborate to achieve comprehensive health monitoring.

User Profile & History: Captures static data (Genetics, Allergies) and dynamic daily inputs.
Daily Agent Loop: Agents run sequentially to gather and process multimodal data.
Consensus Synthesis: The Coordinator Agent consolidates logs, retrieves historical context, and generates an "Executive Summary" for the day.
Architecture Diagram

Technical Stack
Frontend: Next.js (React)
Backend: Flask (Python)
AI Inference: Google MedGemma-4B-IT (via Ollama)
Vision: Google Llava (via Ollama)
Database: SQLite (Local)
Deployment: Local Machine / Docker (Future)