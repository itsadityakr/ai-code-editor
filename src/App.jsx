import React, { useState, useEffect } from "react";

// --- Theme Colors ---
// I've revamped the themes for better aesthetics and added a new "Sunset" theme.
const themes = {
    dark: {
        background: "#0f172a", // slate-900
        surface: "#1e2b3b", // slate-800
        primary: "#38bdf8", // sky-400
        "primary-hover": "#7dd3fc", // sky-300
        secondary: "#818cf8", // indigo-400
        "text-primary": "#f8fafc", // slate-50
        "text-secondary": "#94a3b8", // slate-400
        border: "#334155", // slate-700
        "editor-bg": "#020617", // slate-950
        success: "#22c55e", // green-500
        warning: "#f59e0b", // amber-500
        info: "#38bdf8", // sky-400
    },
    light: {
        background: "#f1f5f9", // slate-100
        surface: "#ffffff", // white
        primary: "#0ea5e9", // sky-500
        "primary-hover": "#38bdf8", // sky-400
        secondary: "#6366f1", // indigo-500
        "text-primary": "#0f172a", // slate-900
        "text-secondary": "#475569", // slate-600
        border: "#e2e8f0", // slate-200
        "editor-bg": "#f8fafc", // slate-50
        success: "#16a34a", // green-600
        warning: "#d97706", // amber-600
        info: "#0284c7", // sky-600
    },
    sunset: {
        background: "#0f0c29",
        surface: "#1f1c4e",
        primary: "#ff8c00",
        "primary-hover": "#ffa500",
        secondary: "#da70d6",
        "text-primary": "#f5f5f5",
        "text-secondary": "#d8bfd8",
        border: "#483d8b",
        "editor-bg": "rgba(0,0,0,0.2)",
        success: "#39ff14",
        warning: "#ffce00",
        info: "#00d4ff",
    },
};

// --- Helper Components & Icons ---
// Updated icons for a sleeker look.

const LightbulbIcon = ({ className = "h-6 w-6" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
    </svg>
);

const SparkleIcon = ({ className = "h-5 w-5" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
    </svg>
);

const LoadingSpinner = () => (
    <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24">
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const CheckCircleIcon = ({ className = "h-6 w-6" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

const ExplanationModal = ({ content, onClose }) => {
    if (!content) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-[var(--color-surface)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col border border-[var(--color-border)]">
                <div className="flex justify-between items-center p-4 border-b border-[var(--color-border)]">
                    <h2 className="text-xl font-bold text-[var(--color-primary)] flex items-center gap-2">
                        <SparkleIcon />
                        AI Code Explanation
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors p-1 rounded-full hover:bg-white/10">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto prose prose-invert text-[var(--color-text-secondary)] whitespace-pre-wrap">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: content
                                .replace(
                                    /```(\w+)?\n([\s\S]*?)```/g,
                                    "<pre><code>$2</code></pre>"
                                )
                                .replace(/`([^`]+)`/g, "<code>$1</code>"),
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function App() {
    const [theme, setTheme] = useState(
        () => localStorage.getItem("ai-editor-theme") || "dark"
    );
    const [allQuestions, setAllQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const difficulties = ["All", "Easy", "Medium", "Hard"];

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState("All");

    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const [userCode, setUserCode] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [translateToLang, setTranslateToLang] = useState("python");

    // State for Gemini features
    const [isTranslating, setIsTranslating] = useState(false);
    const [isExplaining, setIsExplaining] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [explanation, setExplanation] = useState("");
    const [analysisResult, setAnalysisResult] = useState(null);
    const [showAnalysisHint, setShowAnalysisHint] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch("./questions.json");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const flatQuestions = await response.json();
                setAllQuestions(flatQuestions);

                // Derive unique categories from the flat list of questions
                const uniqueCategories = [
                    ...new Set(flatQuestions.flatMap((q) => q.categories)),
                ];
                setCategories(uniqueCategories);

                if (uniqueCategories.length > 0) {
                    setSelectedCategories([uniqueCategories[0]]);
                }
            } catch (e) {
                setError(e.message);
                console.error("Failed to fetch questions:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    useEffect(() => {
        localStorage.setItem("ai-editor-theme", theme);
        const root = window.document.documentElement;
        const currentTheme = themes[theme];
        Object.keys(currentTheme).forEach((key) => {
            root.style.setProperty(`--color-${key}`, currentTheme[key]);
        });
    }, [theme]);

    useEffect(() => {
        if (!allQuestions) return;

        let questions = [...allQuestions];

        // Apply category filter (AND logic)
        if (selectedCategories.length > 0) {
            questions = questions.filter((question) =>
                selectedCategories.every((category) =>
                    question.categories.includes(category)
                )
            );
        }

        // Apply difficulty filter
        if (selectedDifficulty !== "All") {
            questions = questions.filter(
                (q) => q.difficulty === selectedDifficulty
            );
        }
        setFilteredQuestions(questions);

        // If there are questions, select the first one by default,
        // but only if the currently selected question is not in the new filtered list.
        if (questions.length > 0) {
            if (
                !selectedQuestion ||
                !questions.find((q) => q.id === selectedQuestion.id)
            ) {
                setSelectedQuestion(questions[0]);
            }
        } else {
            setSelectedQuestion(null);
        }
    }, [
        selectedCategories,
        selectedDifficulty,
        allQuestions,
        selectedQuestion,
    ]);

    useEffect(() => {
        if (selectedQuestion) {
            setUserCode(
                selectedQuestion.starterCode[language] ||
                    selectedQuestion.starterCode["javascript"] ||
                    `// No starter code for ${language}`
            );
        } else {
            setUserCode("// Select a question to start coding");
        }
        setAnalysisResult(null);
        setShowAnalysisHint(false);
    }, [selectedQuestion, language]);

    const handleCategoryToggle = (category) => {
        setSelectedCategories((prev) => {
            const isSelected = prev.includes(category);
            if (isSelected) {
                return prev.filter((c) => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    const getDifficultyClass = (difficulty) => {
        return (
            {
                Easy: "text-green-400 bg-green-500/10",
                Medium: "text-yellow-400 bg-yellow-500/10",
                Hard: "text-red-400 bg-red-500/10",
            }[difficulty] || "text-gray-400 bg-gray-500/10"
        );
    };

    const toggleTheme = () => {
        const themeCycle = {
            dark: "light",
            light: "sunset",
            sunset: "dark",
        };
        setTheme(themeCycle[theme] || "dark");
    };

    const getNextThemeName = () => {
        const nextThemeMap = {
            dark: "Light",
            light: "Sunset",
            sunset: "Dark",
        };
        return nextThemeMap[theme] || "Dark";
    };

    const languages = [
        { value: "javascript", label: "JavaScript" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
        { value: "go", label: "Go" },
        { value: "cpp", label: "C++" },
    ];

    const callGeminiAPI = async (payload) => {
        // In this specific environment, the API key is handled automatically by the platform.
        // We leave the apiKey string empty, and the backend securely injects the necessary key during the request.
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error(
                    `API call failed with status: ${response.status}`
                );
            }
            return await response.json();
        } catch (error) {
            console.error("Gemini API call error:", error);
            throw error;
        }
    };

    const handleAnalyzeCode = async () => {
        if (!selectedQuestion) return;
        setIsAnalyzing(true);
        setAnalysisResult(null);
        setShowAnalysisHint(false);
        const systemPrompt = `You are a helpful and encouraging coding tutor for absolute beginners. Analyze a user's code for a problem. Determine time/space complexity, if it's optimal, and provide a simple, step-by-step hint towards a better solution if it's not. Do NOT give code. If optimal, be encouraging. Also, briefly explain why their code works.`;
        const userQuery = `Problem: ${selectedQuestion.title}\n\nUser's Code (${language}):\n\`\`\`\n${userCode}\n\`\`\``;
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        userTimeComplexity: { type: "STRING" },
                        userSpaceComplexity: { type: "STRING" },
                        isOptimal: { type: "BOOLEAN" },
                        hint: { type: "STRING" },
                        explanation: { type: "STRING" },
                    },
                    required: [
                        "userTimeComplexity",
                        "userSpaceComplexity",
                        "isOptimal",
                        "explanation",
                    ],
                },
            },
        };
        try {
            const result = await callGeminiAPI(payload);
            const candidate = result.candidates?.[0];
            if (candidate?.content?.parts?.[0]?.text) {
                setAnalysisResult(JSON.parse(candidate.content.parts[0].text));
            } else {
                setAnalysisResult({
                    error: "Sorry, I couldn't analyze the code.",
                });
            }
        } catch (error) {
            setAnalysisResult({ error: "An error occurred during analysis." });
            console.error(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleExplainCode = async () => {
        if (!selectedQuestion) return;
        setIsExplaining(true);
        setExplanation("");
        const systemPrompt =
            "As a world-class code analyst, explain the provided code snippet in a clear, beginner-friendly manner. Use markdown to format your response, including code blocks for examples if necessary. Cover the overall logic, then detail its time and space complexity in separate, clearly marked sections.";
        const userQuery = `Please explain the following code for the problem "${selectedQuestion.title}".\n\n\`\`\`${language}\n${userCode}\n\`\`\``;
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };
        try {
            const result = await callGeminiAPI(payload);
            const candidate = result.candidates?.[0];
            if (candidate?.content?.parts?.[0]?.text) {
                setExplanation(candidate.content.parts[0].text);
            } else {
                setExplanation("Sorry, I couldn't generate an explanation.");
            }
        } catch (error) {
            setExplanation("An error occurred while fetching the explanation.");
            console.error(error);
        } finally {
            setIsExplaining(false);
        }
    };

    const handleTranslateCode = async () => {
        if (!selectedQuestion || language === translateToLang) return;
        setIsTranslating(true);
        const systemPrompt = `As an expert code translator, convert the given code snippet to the target language. Provide only the raw, translated code without any markdown formatting, language identifiers, or extra text.`;
        const userQuery = `Translate the following ${language} code to ${translateToLang}:\n\n${userCode}`;
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };
        try {
            const result = await callGeminiAPI(payload);
            const candidate = result.candidates?.[0];
            if (candidate?.content?.parts?.[0]?.text) {
                setUserCode(candidate.content.parts[0].text.trim());
                setLanguage(translateToLang);
            } else {
                console.error("Sorry, I couldn't translate the code.");
            }
        } catch (error) {
            console.error("An error occurred while translating the code.");
            console.error(error);
        } finally {
            setIsTranslating(false);
        }
    };

    const ActionButton = ({
        onClick,
        disabled,
        inProgress,
        icon,
        children,
        className,
    }) => (
        <button
            onClick={onClick}
            disabled={disabled || inProgress}
            className={`flex items-center justify-center font-bold py-2 px-4 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:bg-gray-500 disabled:cursor-not-allowed ${className}`}>
            {inProgress ? <LoadingSpinner /> : icon}
            <span className="ml-2">{children}</span>
        </button>
    );

    if (isLoading)
        return (
            <div className="bg-[var(--color-background)] text-[var(--color-text-primary)] min-h-screen flex items-center justify-center text-xl">
                Loading Questions...
            </div>
        );
    if (error)
        return (
            <div className="bg-red-900 text-white min-h-screen flex items-center justify-center p-4">
                Error: {error}
            </div>
        );

    return (
        <>
            <ExplanationModal
                content={explanation}
                onClose={() => setExplanation("")}
            />
            <div className="bg-[var(--color-background)] text-[var(--color-text-primary)] min-h-screen font-sans flex flex-col">
                <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-md p-3 px-6 flex items-center justify-between z-10">
                    <h1 className="text-2xl font-bold text-[var(--color-primary)] tracking-wider flex items-center gap-2">
                        <SparkleIcon className="h-6 w-6" /> AI Code Editor
                    </h1>
                    <button
                        onClick={toggleTheme}
                        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white/10 transition-all">
                        Switch to {getNextThemeName()}
                    </button>
                </header>

                <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
                    {/* Left Panel */}
                    <div className="w-full lg:w-1/3 xl:w-2/5 flex flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)]">
                        <div className="p-4 space-y-4">
                            <div>
                                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">
                                    CATEGORIES
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() =>
                                                handleCategoryToggle(category)
                                            }
                                            className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${
                                                selectedCategories.includes(
                                                    category
                                                )
                                                    ? "bg-[var(--color-primary)] text-white shadow-md"
                                                    : "bg-black/10 hover:bg-black/20 text-[var(--color-text-secondary)]"
                                            }`}>
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">
                                    DIFFICULTY
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {difficulties.map((difficulty) => (
                                        <button
                                            key={difficulty}
                                            onClick={() =>
                                                setSelectedDifficulty(
                                                    difficulty
                                                )
                                            }
                                            className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${
                                                selectedDifficulty ===
                                                difficulty
                                                    ? "bg-[var(--color-secondary)] text-white shadow-md"
                                                    : "bg-black/10 hover:bg-black/20 text-[var(--color-text-secondary)]"
                                            }`}>
                                            {difficulty}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-[var(--color-border)] p-4 flex-grow overflow-y-auto">
                            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">
                                PROBLEMS
                            </h2>
                            {filteredQuestions.length > 0 ? (
                                <ul className="space-y-2">
                                    {filteredQuestions.map((q) => (
                                        <li
                                            key={q.id}
                                            onClick={() =>
                                                setSelectedQuestion(q)
                                            }
                                            className={`cursor-pointer p-3 rounded-lg transition-all duration-200 border-2 ${
                                                selectedQuestion?.id === q.id
                                                    ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]"
                                                    : "border-transparent hover:bg-white/5"
                                            }`}>
                                            <div className="flex justify-between items-center">
                                                <span
                                                    className={
                                                        selectedQuestion?.id ===
                                                        q.id
                                                            ? "text-[var(--color-primary)] font-semibold"
                                                            : ""
                                                    }>
                                                    {q.title}
                                                </span>
                                                <span
                                                    className={`text-xs font-bold px-2 py-1 rounded-full ${getDifficultyClass(
                                                        q.difficulty
                                                    )}`}>
                                                    {q.difficulty}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-[var(--color-text-secondary)] text-center mt-8">
                                    No problems match your filters.
                                </p>
                            )}
                        </div>

                        {selectedQuestion && (
                            <div className="p-5 border-t border-[var(--color-border)] bg-black/10 max-h-48 overflow-y-auto">
                                <h3 className="text-lg font-bold mb-2">
                                    {selectedQuestion.title}
                                </h3>
                                <p className="text-[var(--color-text-secondary)] text-sm whitespace-pre-wrap leading-relaxed">
                                    {selectedQuestion.prompt}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Panel */}
                    <div className="w-full lg:w-2/3 xl:w-3/5 flex flex-col">
                        <div className="bg-[var(--color-surface)] p-2 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)]">
                            <div className="flex items-center gap-2">
                                <label
                                    htmlFor="lang-select"
                                    className="text-sm font-medium text-[var(--color-text-secondary)]">
                                    Language:
                                </label>
                                <select
                                    id="lang-select"
                                    value={language}
                                    onChange={(e) =>
                                        setLanguage(e.target.value)
                                    }
                                    className="bg-black/20 border border-[var(--color-border)] rounded-md px-3 py-1.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all">
                                    {languages.map((lang) => (
                                        <option
                                            key={lang.value}
                                            value={lang.value}
                                            className="bg-[var(--color-surface)] text-[var(--color-text-primary)]">
                                            {lang.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <ActionButton
                                    onClick={handleAnalyzeCode}
                                    disabled={!selectedQuestion}
                                    inProgress={isAnalyzing}
                                    icon={<SparkleIcon />}
                                    className="bg-green-600 hover:bg-green-500 text-white">
                                    Analyze
                                </ActionButton>
                                <ActionButton
                                    onClick={handleExplainCode}
                                    disabled={!selectedQuestion}
                                    inProgress={isExplaining}
                                    icon={<LightbulbIcon className="h-5 w-5" />}
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white">
                                    Explain
                                </ActionButton>
                                <div className="flex items-center">
                                    <ActionButton
                                        onClick={handleTranslateCode}
                                        disabled={
                                            !selectedQuestion ||
                                            language === translateToLang
                                        }
                                        inProgress={isTranslating}
                                        icon={<SparkleIcon />}
                                        className="bg-purple-600 hover:bg-purple-500 text-white rounded-r-none">
                                        Translate to
                                    </ActionButton>
                                    <select
                                        value={translateToLang}
                                        onChange={(e) =>
                                            setTranslateToLang(e.target.value)
                                        }
                                        disabled={
                                            !selectedQuestion ||
                                            isTranslating ||
                                            isExplaining ||
                                            isAnalyzing
                                        }
                                        className="bg-black/20 border border-[var(--color-border)] rounded-r-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all disabled:opacity-50 h-full border-l-0">
                                        {languages.map((lang) => (
                                            <option
                                                key={lang.value}
                                                value={lang.value}
                                                className="bg-[var(--color-surface)] text-[var(--color-text-primary)]">
                                                {lang.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex-grow relative h-64 lg:h-auto">
                            <textarea
                                value={userCode}
                                onChange={(e) => setUserCode(e.target.value)}
                                className="w-full h-full p-4 bg-[var(--color-editor-bg)] text-[var(--color-text-primary)] font-mono text-base resize-none border-none outline-none absolute top-0 left-0"
                                spellCheck="false"
                                disabled={!selectedQuestion}
                            />
                        </div>

                        <div className="bg-[var(--color-surface)] border-t border-[var(--color-border)] p-4 lg:min-h-[200px] lg:max-h-[40vh] overflow-y-auto">
                            <h4 className="text-md font-semibold mb-3 text-[var(--color-primary)]">
                                AI Tutor Analysis
                            </h4>
                            {isAnalyzing && (
                                <div className="flex items-center text-[var(--color-text-secondary)]">
                                    <LoadingSpinner />{" "}
                                    <span className="ml-2">Analyzing...</span>
                                </div>
                            )}
                            {analysisResult && !isAnalyzing && (
                                <div className="space-y-4">
                                    {analysisResult.error ? (
                                        <p className="text-red-400">
                                            {analysisResult.error}
                                        </p>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                <div className="bg-black/20 p-3 rounded-lg">
                                                    <strong>
                                                        Time Complexity:
                                                    </strong>{" "}
                                                    <span className="font-mono text-[var(--color-text-primary)]">
                                                        {
                                                            analysisResult.userTimeComplexity
                                                        }
                                                    </span>
                                                </div>
                                                <div className="bg-black/20 p-3 rounded-lg">
                                                    <strong>
                                                        Space Complexity:
                                                    </strong>{" "}
                                                    <span className="font-mono text-[var(--color-text-primary)]">
                                                        {
                                                            analysisResult.userSpaceComplexity
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-[var(--color-text-secondary)]">
                                                {analysisResult.explanation}
                                            </p>
                                            {analysisResult.isOptimal ? (
                                                <div className="bg-[var(--color-success)]/10 border border-[var(--color-success)] text-[var(--color-success)] p-3 rounded-lg flex items-center gap-3">
                                                    <CheckCircleIcon />
                                                    <div>
                                                        <p className="font-bold">
                                                            Optimal Solution!
                                                        </p>
                                                        <p className="text-sm opacity-90">
                                                            This is a great
                                                            approach. Keep up
                                                            the excellent work!
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)] text-[var(--color-warning)] p-3 rounded-lg flex items-start gap-3">
                                                    <LightbulbIcon className="shrink-0 mt-1" />
                                                    <div>
                                                        <p className="font-bold">
                                                            Good start, but
                                                            there's room to
                                                            improve!
                                                        </p>
                                                        <p className="text-sm opacity-90 mb-2">
                                                            Your solution works,
                                                            which is fantastic!
                                                            For a greater
                                                            challenge, consider
                                                            a more efficient
                                                            approach.
                                                        </p>
                                                        {!showAnalysisHint ? (
                                                            <button
                                                                onClick={() =>
                                                                    setShowAnalysisHint(
                                                                        true
                                                                    )
                                                                }
                                                                className="bg-[var(--color-warning)] text-black font-bold py-1 px-3 rounded text-sm transition-colors hover:bg-opacity-80">
                                                                Show Hint
                                                            </button>
                                                        ) : (
                                                            <div className="mt-2 pt-2 border-t border-[var(--color-warning)]/20 text-sm">
                                                                <p className="font-semibold mb-1">
                                                                    Hint:
                                                                </p>
                                                                <p className="opacity-90">
                                                                    {
                                                                        analysisResult.hint
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                            {!analysisResult && !isAnalyzing && (
                                <p className="text-[var(--color-text-secondary)] text-sm">
                                    {selectedQuestion
                                        ? "Write some code and click 'Analyze' to get feedback."
                                        : "Select a question to begin."}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
