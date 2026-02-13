import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { ContentInput } from "./components/content-input";
import { AnalysisResults } from "./components/analysis-results";
import { analyzeText, analyzeImage, analyzeVideo } from "../services/api";

export type ContentType = "text" | "image" | "video";

export interface AnalysisResult {
  contentType: ContentType;
  verdict: "authentic" | "manipulated" | "suspicious";
  confidence: number;
  aiGenerated?: {
    likelihood: number;
    model?: string;
  };
  deepfakeDetection?: {
    detected: boolean;
    confidence: number;
    manipulationType?: string;
  };
  semanticAnalysis?: {
    claims: string[];
    verification: Array<{
      claim: string;
      status: "verified" | "disputed" | "unverified";
      sources: string[];
    }>;
  };
  evidence: Array<{
    type: "support" | "concern" | "neutral";
    description: string;
    source?: string;
  }>;
  sourceAttribution?: {
    possibleOrigins: string[];
    earliestDetection?: string;
  };
 analyzedAt: Date;
  processingTime: number;
}

export default function App() {
  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // ✅ STEP 1 — BACKEND-INTEGRATED ANALYSIS HANDLER
  const handleAnalyze = async (content: string | File, type: ContentType) => {
    try {
      setIsAnalyzing(true);
      const start = Date.now();

      let backendResult: any;

      if (type === "text") {
        backendResult = await analyzeText(content as string);
      } else if (type === "image") {
        backendResult = await analyzeImage(content as File);
      } else {
        backendResult = await analyzeVideo(content as File);
      }

      const processingTime = Date.now() - start;

      const normalizedResult: AnalysisResult = {
        contentType: type,

        verdict:
          backendResult.verdict?.toLowerCase().includes("authentic")
            ? "authentic"
            : backendResult.verdict?.toLowerCase().includes("manipulated") ||
              backendResult.verdict?.toLowerCase().includes("ai")
            ? "manipulated"
            : "suspicious",

        confidence:
          backendResult.confidence ??
          Math.round(
            (1 - (backendResult.ai_generated_probability ?? 0)) * 100
          ),

        aiGenerated:
          backendResult.ai_generated_probability !== undefined
            ? {
                likelihood: Math.round(
                  backendResult.ai_generated_probability * 100
                ),
              }
            : undefined,

        deepfakeDetection: backendResult.model_signals
          ? {
              detected: backendResult.model_signals.cnn_score > 0.5,
              confidence: Math.round(
                backendResult.model_signals.cnn_score * 100
              ),
            }
          : undefined,

        semanticAnalysis: backendResult.semanticAnalysis,
        evidence: backendResult.evidence ?? [],
        sourceAttribution: backendResult.sourceAttribution,

        analyzedAt: new Date().toISOString(),

        processingTime,
      };

      setAnalysisResult(normalizedResult);
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 gap-8 min-h-[calc(100vh-4rem)]">
              <ContentInput
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                onReset={handleReset}
                hasResult={!!analysisResult}
              />

              <AnalysisResults
                result={analysisResult}
                isAnalyzing={isAnalyzing}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
