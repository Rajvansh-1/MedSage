import React, { useState, useRef, DragEvent, useEffect } from 'react';
import { useHealth } from '../store';
import { consultMedicalAgent, analyzeMedicalResult, generateClinicalReport } from '../geminiService';
import { 
  Stethoscope, 
  UploadCloud, 
  AlertCircle, 
  Globe,
  Loader2, 
  ScanLine, 
  Send,
  ShieldCheck,
  Activity,
  Mic,
  MicOff,
  FileText,
  Download
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
// @ts-ignore
import html2pdf from 'html2pdf.js';

const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali'];

// Web Speech API Types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const MedicalView: React.FC = () => {
  const { profile } = useHealth();
  
  // State
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'agent', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Vision State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [scanResult, setScanResult] = useState<{summary: string, anomalies: string[]} | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  // Report State
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Update input field in real time
        setQuestion(prev => {
           // We only append final results to avoid overwriting existing text completely
           // But since continuous is true, we need to handle it carefully.
           // A simpler approach for the hackathon: just set the value to the latest result.
           return finalTranscript || interimTranscript; 
        });
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Set language code based on dropdown
      const langCode = selectedLanguage === 'Hindi' ? 'hi-IN' : 'en-IN';
      if (recognitionRef.current) {
         recognitionRef.current.lang = langCode;
         recognitionRef.current.start();
         setIsListening(true);
      } else {
         alert("Your browser does not support Speech Recognition.");
      }
    }
  };

  const handleConsult = async () => {
    if (!question.trim()) return;
    
    // Stop listening if sending message
    if (isListening) {
       recognitionRef.current?.stop();
       setIsListening(false);
    }

    const userMsg = question;
    setQuestion('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    
    const response = await consultMedicalAgent(profile, userMsg, selectedLanguage);
    
    setChatHistory(prev => [...prev, { role: 'agent', text: response }]);
    setLoading(false);
  };

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = (reader.result as string);
      setUploadedImagePreview(base64Data);
      
      const base64Clean = base64Data.split(',')[1];
      setAnalyzingImage(true);
      setScanResult(null);
      
      const result = await analyzeMedicalResult(base64Clean, selectedLanguage);
      setScanResult(result);
      setAnalyzingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
  };

  const handleGenerateReport = async () => {
     if (chatHistory.length === 0 && !scanResult) {
        alert("Please have a consultation or upload a scan first.");
        return;
     }
     setGeneratingReport(true);
     const reportText = await generateClinicalReport(profile, chatHistory, scanResult);
     setReportData(reportText);
     setGeneratingReport(false);
  };

  const downloadPDF = () => {
     if (!reportRef.current) return;
     const opt = {
       margin:       0.5,
       filename:     'MedSage_Clinical_Report.pdf',
       image:        { type: 'jpeg', quality: 0.98 },
       html2canvas:  { scale: 2 },
       jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
     };
     html2pdf().set(opt).from(reportRef.current).save();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 pb-24 md:pb-6 h-full flex flex-col bg-slate-950 text-slate-200">
      
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
             <div className="bg-cyan-500/20 p-2.5 rounded-xl border border-cyan-500/30 text-cyan-400">
                 <Activity size={26} />
             </div>
             <div>
                 <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                   Clinical Copilot
                 </h1>
                 <p className="text-indian-brown/60 text-sm flex items-center gap-2">
                   <ShieldCheck size={14} className="text-emerald-400"/> Local Edge Network • Offline Mode
                 </p>
             </div>
          </div>
        </div>

        {/* Multilingual Selector */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2 rounded-xl">
           <Globe size={18} className="text-indian-brown/60 ml-2" />
           <select 
             value={selectedLanguage}
             onChange={(e) => setSelectedLanguage(e.target.value)}
             className="bg-transparent border-none text-sm text-slate-200 focus:ring-0 outline-none pr-4 cursor-pointer"
           >
             {LANGUAGES.map(lang => (
               <option key={lang} value={lang} className="bg-slate-900">{lang}</option>
             ))}
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        
        {/* Left Column: Vision & Pre-Screening */}
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto scrollbar-hide">
           
           <div 
             className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden min-h-[250px]
               ${isDragging ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/50'}
               ${analyzingImage ? 'opacity-50 pointer-events-none' : ''}
             `}
             onDragOver={onDragOver}
             onDragLeave={onDragLeave}
             onDrop={onDrop}
             onClick={() => fileInputRef.current?.click()}
           >
              {uploadedImagePreview ? (
                <>
                  <div className="absolute inset-0 bg-black/40 z-10"></div>
                  <img src={uploadedImagePreview} alt="Uploaded Scan" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <div className="relative z-20 text-white flex flex-col items-center">
                     {analyzingImage ? (
                        <>
                          <ScanLine size={48} className="text-cyan-400 mb-4 animate-pulse" />
                          <p className="font-semibold text-lg drop-shadow-lg-md">Running Local Model...</p>
                        </>
                     ) : (
                        <>
                          <UploadCloud size={48} className="text-slate-200 mb-4 drop-shadow-lg-md" />
                          <p className="font-semibold drop-shadow-lg-md">Upload new scan</p>
                        </>
                     )}
                  </div>
                </>
              ) : (
                <>
                  <UploadCloud size={40} className="text-indian-brown/70 mb-3" />
                  <p className="text-slate-300 font-medium mb-1">Upload X-Ray / MRI</p>
                  <p className="text-indian-brown/70 text-xs">Drag and drop or click to browse</p>
                </>
              )}
           </div>

           {/* Vision Results */}
           {scanResult && !analyzingImage && (
             <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                   <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                     <ScanLine size={16} className="text-cyan-400" /> MedGemma Vision
                   </h3>
                   <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-md">Processed Locally</span>
                </div>
                
                {/* Auto Flagging Anomalies */}
                {scanResult.anomalies && scanResult.anomalies.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs text-indian-brown/70 uppercase font-semibold">Auto-Flagged Anomalies</h4>
                    {scanResult.anomalies.map((anomaly, idx) => (
                       <div key={idx} className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg flex items-start gap-3 text-sm">
                          <AlertCircle size={16} className="mt-0.5 shrink-0" />
                          <span>{anomaly}</span>
                       </div>
                    ))}
                  </div>
                )}

                <div className="prose prose-sm prose-invert max-w-none text-slate-300">
                   <ReactMarkdown>{scanResult.summary}</ReactMarkdown>
                </div>
             </div>
           )}

           <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
           />
        </div>

        {/* Right Column: Chat Reasoning */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden relative">
           
           {/* Report Modal / Overlay */}
           {reportData && (
             <div className="absolute inset-0 bg-slate-900 z-30 flex flex-col animate-in fade-in zoom-in-95">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                   <h3 className="font-bold text-cyan-400 flex items-center gap-2">
                      <FileText size={20} /> Generated Clinical Report
                   </h3>
                   <div className="flex gap-2">
                      <button onClick={downloadPDF} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                         <Download size={16} /> Download PDF
                      </button>
                      <button onClick={() => setReportData(null)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
                         Close
                      </button>
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 bg-white text-slate-900" ref={reportRef}>
                   <div className="prose max-w-none">
                      <ReactMarkdown>{reportData}</ReactMarkdown>
                   </div>
                   <div className="mt-12 pt-8 border-t border-slate-200 text-sm text-slate-500 text-center">
                      <img src="/img/logo.jpeg" alt="MedSage Logo" className="w-12 h-12 rounded-full mx-auto mb-2" />
                      <p>MedSage AI - Your True Indian Health Companion</p>
                      <p>Report generated on {new Date().toLocaleDateString()}</p>
                   </div>
                </div>
             </div>
           )}

           {/* Chat History Area */}
           <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide animate-slide-up">
              {chatHistory.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <Stethoscope size={48} className="text-indian-brown/80 mb-4" />
                    <h3 className="text-lg font-medium text-indian-brown/60">Offline Clinical Reasoning</h3>
                    <p className="text-sm text-indian-brown/70 max-w-sm mt-2">
                      Ask questions using text or voice. Generate a final PDF report when you're done.
                    </p>
                 </div>
              ) : (
                 chatHistory.map((msg, i) => (
                   <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl p-4 ${
                         msg.role === 'user' 
                           ? 'bg-cyan-600 text-white rounded-tr-sm' 
                           : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
                      }`}>
                         {msg.role === 'agent' && (
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700/50">
                               <Stethoscope size={14} className="text-cyan-400" />
                               <span className="text-xs font-bold text-indian-brown/60 uppercase tracking-wide">MedGemma 4B</span>
                            </div>
                         )}
                         <div className="prose prose-sm prose-invert max-w-none">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                         </div>
                      </div>
                   </div>
                 ))
              )}
              {loading && (
                 <div className="flex justify-start">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm p-4 flex items-center gap-3 text-indian-brown/60 text-sm">
                       <Loader2 size={16} className="animate-spin text-cyan-500" /> Reasoning locally...
                    </div>
                 </div>
              )}
           </div>

           {/* Controls Area */}
           <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col gap-3">
              {/* Actions Row */}
              {(chatHistory.length > 0 || scanResult) && (
                 <div className="flex justify-center mb-1">
                    <button 
                       onClick={handleGenerateReport}
                       disabled={generatingReport}
                       className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-900/50 px-6 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all disabled:opacity-50"
                    >
                       {generatingReport ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                       {generatingReport ? "Generating..." : "Get Results"}
                    </button>
                 </div>
              )}

              {/* Input Row */}
              <div className="relative flex items-center bg-slate-950 border border-slate-700 rounded-xl focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all p-1">
                 
                 {/* Voice Button */}
                 <button 
                    onClick={toggleListening}
                    className={`p-3 rounded-lg transition-colors flex-shrink-0 ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-slate-400 hover:bg-slate-800 hover:text-cyan-400'}`}
                    title={isListening ? "Stop listening" : "Start voice input"}
                 >
                    {isListening ? <Mic size={20} /> : <MicOff size={20} />}
                 </button>

                 <input 
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleConsult()}
                    placeholder={isListening ? "Listening..." : "Enter clinical queries here..."}
                    className="flex-1 bg-transparent border-none text-slate-200 px-3 py-3 focus:ring-0 outline-none placeholder:text-indian-brown/80"
                 />
                 
                 <button 
                    onClick={handleConsult}
                    disabled={loading || !question.trim()}
                    className="mr-1 p-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 transition-colors flex-shrink-0"
                 >
                    <Send size={18} />
                 </button>
              </div>
           </div>
           
        </div>

      </div>
    </div>
  );
};

export default MedicalView;
