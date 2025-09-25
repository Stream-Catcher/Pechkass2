import React, { useState } from 'react';
import ProfilePage from './components/ProfilePage.jsx';
import InterviewPage from './components/InterviewPage.jsx';
import ResultsPage from './components/ResultsPage.jsx';

function App() {
  const [page, setPage] = useState('profile'); 
  const [resume, setResume] = useState('');
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [language, setLanguage] = useState('en-US');
  const [finalFeedback, setFinalFeedback] = useState(null);
  const [interviewHistory, setInterviewHistory] = useState([]);

  const handleStartInterview = (userResume, userJobRole, userLanguage) => {
    setResume(userResume);
    setJobRole(userJobRole);
    setLanguage(userLanguage);
    setFinalFeedback(null); 
    
    let introMessage = `Hello! I'm Nexa, and I'll be conducting your mock interview today for the ${userJobRole} position. I've reviewed your resume. I will ask you a series of questions to understand your experience better. Let's begin when you're ready.`;

    if (userLanguage === 'hi-IN') {
      introMessage = `नमस्ते! मैं नेक्सा हूँ, और आज मैं ${jobRole} पद के लिए आपका मॉक इंटरव्यू संचालित करूँगा। मैंने आपका बायोडाटा देख लिया है। आपके अनुभव को बेहतर समझने के लिए मैं आपसे कुछ प्रश्न पूछूँगा। जब आप तैयार हों, तो शुरू करते हैं।`;
    }

    const history = [
        { role: "user", parts: [{ text: getSystemPrompt(userResume, userJobRole, userLanguage) }] },
        { role: "model", parts: [{ text: introMessage }] },
    ];
    setInterviewHistory(history);
    setPage('interview');
  };

  const handleEndInterview = (feedback) => {
    setFinalFeedback(feedback);
    setPage('results');
  };

  const handleStartNew = () => {
    setPage('profile');
    setFinalFeedback(null);
    setInterviewHistory([]);
  };

  const renderPage = () => {
    switch (page) {
      case 'interview': return <InterviewPage initialHistory={interviewHistory} language={language} onEndInterview={handleEndInterview} />;
      case 'results': return <ResultsPage feedback={finalFeedback} onStartNew={handleStartNew} />;
      default: return <ProfilePage onStartInterview={handleStartInterview} />;
    }
  };

  return (
    <div className="text-slate-800 min-h-screen font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      <div className="gradient-bg">
        <div className="gradient-blob blob1 top-1/4 left-1/4"></div>
        <div className="gradient-blob blob2 top-1/2 left-1/2"></div>
      </div>
      
      <div className="w-full max-w-4xl mx-auto z-10">
        <header className="text-center mb-12">
            <h1 className="text-8xl md:text-9xl font-black text-slate-800 tracking-wider text-glow">
                NEXA
            </h1>
            <p className="text-slate-600 mt-2 text-xl md:text-2xl font-medium">AI Mock Interview</p>
        </header>
        <main>
            {renderPage()}
        </main>
        <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>Powered by Nexa AI</p>
        </footer>
      </div>
    </div>
  );
}

const getSystemPrompt = (resume, jobRole, lang) => `
You are an expert technical interviewer and career coach named 'Nexa'. Your task is to conduct a mock interview for the role of '${jobRole}'.
**You MUST conduct the entire interview, including all questions and feedback, in the language specified by the language code: ${lang}.**
The candidate's resume is provided below:
--- START RESUME ---
${resume}
--- END RESUME ---
Here are your instructions:
1.  **Language & Script**: The primary language for this session is ${lang}. All your responses must be in this language. **If the language code is 'hi-IN', you MUST respond using the Devanagari script.**
2.  **Formatting**: Your responses MUST be plain text only. Do not use any markdown formatting, especially asterisks (*), bolding, or lists.
3.  **Goal**: Assess the candidate's skills, experience, and suitability for the role. Ask a total of 5 main questions.
4.  **Persona**: Maintain a professional, encouraging, and conversational tone. You have already introduced yourself; your first response should be the first question.
5.  **Questioning Flow**: Ask ONE question at a time and wait for the candidate's response.
6.  **Adaptive Response Analysis**:
    -   If the candidate's answer is strong and detailed: Give brief, positive reinforcement then move to the next question.
    -   If the candidate's answer is weak or vague: Ask a clarifying follow-up question.
7.  **Conclusion**: After the 5th question, provide a brief concluding remark, thank the candidate, and tell them they can now access their feedback.
8.  **Final Feedback Generation**: After the interview concludes, you will receive a final prompt. Your response to this MUST be ONLY a single JSON object with the keys 'strengths', 'weaknesses', 'advice', and 'score'. The text within the arrays must also be in the specified language and script.
`;

export default App;