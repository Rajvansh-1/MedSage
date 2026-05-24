import os
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

# True Production-Ready Edge Backend
# This server routes requests to your local Ollama instance running MedGemma.
# No data leaves this device.
app = Flask(__name__)
CORS(app) 

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "medgemma-copilot" # Our custom local model

@app.route('/api/triage/chat', methods=['POST'])
def chat():
    data = request.json
    profile = data.get('profile', {})
    question = data.get('question', '')
    language = data.get('language', 'English')
    
    prompt = f"""
    User Context:
    - Medical History: {profile.get('medicalHistory', 'None')}
    - Genetic Risks: {profile.get('geneticRisks', 'None')}
    
    User Query: {question}
    
    Provide a clinical-style informative answer. 
    IMPORTANT: You MUST respond entirely in {language}.
    """
    
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=120)
        if response.status_code == 200:
            result = response.json()
            return jsonify({"answer": result.get("response", "")})
        else:
            return jsonify({"answer": f"Ollama Error: {response.text}"}), 500
    except requests.exceptions.ConnectionError:
        return jsonify({"answer": "CRITICAL: Cannot connect to Ollama. Is Ollama running on your machine?"}), 500
    except Exception as e:
        return jsonify({"answer": f"Local Inference Error: {str(e)}"}), 500

@app.route('/api/triage/vision', methods=['POST'])
def vision():
    data = request.json
    base64_img = data.get('image', '')
    language = data.get('language', 'English')
    
    prompt = f"""
    Analyze this medical document/scan. 
    1. Provide a clinical summary of key findings.
    2. Extract a list of anomalies or flags.
    
    IMPORTANT: Return ONLY a strict JSON object (no markdown formatting) with this structure:
    {{
        "summary": "Clinical summary translated to {language}",
        "anomalies": ["Anomaly 1 in {language}", "Anomaly 2 in {language}"]
    }}
    """
    
    payload = {
        "model": "llava", # Llava is Ollama's vision model.
        "prompt": prompt,
        "stream": False,
        "images": [base64_img]
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=120)
        if response.status_code == 200:
            result = response.json().get("response", "")
            # Clean JSON from markdown if present
            raw_text = result.replace('```json', '').replace('```', '').strip()
            parsed = json.loads(raw_text)
            return jsonify(parsed)
        else:
            # Fallback if Llava isn't installed
            if "model 'llava' not found" in response.text:
                return jsonify({
                    "summary": "Ollama Error: The 'llava' vision model is not installed. Please run 'ollama pull llava'.",
                    "anomalies": ["Vision Model Missing"]
                }), 500
            return jsonify({"summary": f"Ollama Error: {response.text}", "anomalies": []}), 500
            
    except requests.exceptions.ConnectionError:
        return jsonify({
            "summary": "CRITICAL: Cannot connect to Ollama.",
            "anomalies": ["Connection Failed"]
        }), 500
    except Exception as e:
        # Fallback if json parsing fails
        return jsonify({
            "summary": f"Vision analysis failed to parse. Details: {str(e)}",
            "anomalies": ["Analysis Error"]
        }), 500

if __name__ == '__main__':
    print("🚀 Starting TRUE LOCAL MedGemma Triage Backend...")
    print("🔒 Routing everything to Ollama (port 11434). Zero cloud reliance.")
    app.run(port=5000, debug=True)
