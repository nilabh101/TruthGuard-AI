import {
  Loader2,
  Search,
  ExternalLink,
  Clock,
  Cpu,
} from "lucide-react";
import type { AnalysisResult } from "../App";

interface AnalysisResultsProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

/* =========================
   Verdict formatting helper
   ========================= */
function formatVerdict(verdict: string, confidence: number) {
  if (verdict === "authentic") {
    return {
      title: "Content appears authentic",
      subtitle:
        confidence >= 85
          ? "High confidence based on multiple independent verification signals"
          : "Moderate confidence — some verification signals present",
      color: "text-green-700",
    };
  }

  if (verdict === "manipulated") {
    return {
      title: "High risk of AI-generated or manipulated content",
      subtitle:
        confidence >= 80
          ? "Strong AI-generation and forensic indicators detected"
          : "Some manipulation indicators detected",
      color: "text-red-700",
    };
  }

  return {
    title: "Content may be misleading or unverified",
    subtitle: "Insufficient evidence to fully verify authenticity",
    color: "text-amber-700",
  };
}

/* =========================
   Confidence interpretation
   ========================= */
function confidenceLabel(confidence: number) {
  if (confidence >= 85) {
    return {
      label: "High Confidence",
      description: "Strong agreement across multiple AI models",
      color: "text-green-700",
    };
  }

  if (confidence >= 65) {
    return {
      label: "Moderate Confidence",
      description: "Some uncertainty — partial verification signals",
      color: "text-amber-700",
    };
  }

  return {
    label: "Low Confidence",
    description: "Limited evidence or conflicting indicators",
    color: "text-red-700",
  };
}

/* =========================
   Why-this-result explainer
   ========================= */
function explainResult(result: AnalysisResult) {
  const evidence = result.evidence ?? [];
  const concerns = evidence.filter(e => e.type === "concern").length;
  const supports = evidence.filter(e => e.type === "support").length;

  if (result.verdict === "manipulated") {
    return `This content was flagged as high risk because multiple AI models detected
    forensic or semantic inconsistencies. ${concerns} risk indicators outweighed
    supporting signals, suggesting possible manipulation or AI generation.`;
  }

  if (result.verdict === "authentic") {
    return `This content appears authentic based on consistent signals across
    verification models. ${supports} supporting indicators were detected with
    minimal conflicting evidence.`;
  }

  return `The system could not fully verify this content due to limited or
  conflicting signals. While some indicators were detected, they were not strong
  enough to reach a definitive conclusion.`;
}

export function AnalysisResults({ result, isAnalyzing }: AnalysisResultsProps) {
  /* =========================
     Loading state
     ========================= */
  if (isAnalyzing) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Analysis Results
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            AI-powered verification in progress
          </p>
        </div>

        <div className="flex-1 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center">
          <Loader2 className="size-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-900 font-medium mb-1">
            Running multi-modal analysis…
          </p>
          <p className="text-sm text-gray-500">
            Cross-referencing trusted sources
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     Empty state
     ========================= */
  if (!result) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Analysis Results
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Verification and evidence will appear here
          </p>
        </div>

        <div className="flex-1 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
          <Search className="size-16 mb-4 opacity-20" />
          <p className="text-sm">No analysis yet</p>
          <p className="text-xs mt-1">
            Upload content to begin verification
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     Safe derived values
     ========================= */
  const verdictUI = formatVerdict(result.verdict, result.confidence);
  const confidenceUI = confidenceLabel(result.confidence);
  const explanation = explainResult(result);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Analysis Results
          </h2>

          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {new Date(result.analyzedAt).toLocaleTimeString()}
            </span>

            <span className="flex items-center gap-1">
              <Cpu className="size-3" />
              {result.processingTime ?? 0}ms
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-auto">
        <div className="p-6 space-y-6">
          {/* Verdict + Confidence */}
          <div className="border-2 rounded-lg p-6 bg-gray-50 border-gray-200">
            <h3 className={`text-2xl font-semibold mb-1 ${verdictUI.color}`}>
              {verdictUI.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {verdictUI.subtitle}
            </p>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-900">
                  Confidence Level
                </span>
                <span className={`text-sm font-semibold ${confidenceUI.color}`}>
                  {confidenceUI.label} ({result.confidence}%)
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>

              <p className="text-xs text-gray-500">
                {confidenceUI.description}
              </p>
            </div>
          </div>

          {/* Why this result */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Why this result?
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {explanation}
            </p>
          </div>

          {/* Evidence */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Supporting Evidence
            </h4>

            <div className="space-y-2">
              {(result.evidence ?? []).map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div
                    className={`size-2 rounded-full mt-2 ${
                      item.type === "support"
                        ? "bg-green-500"
                        : item.type === "concern"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }`}
                  />

                  <div>
                    <p className="text-sm text-gray-700">
                      {item.description}
                    </p>
                    {item.source && (
                      <p className="text-xs text-gray-500 mt-1">
                        Source: {item.source}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 leading-relaxed">
              This analysis uses advanced AI models across language,
              vision, and forensic domains. Results are probabilistic
              and should be verified through trusted sources before
              taking action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
