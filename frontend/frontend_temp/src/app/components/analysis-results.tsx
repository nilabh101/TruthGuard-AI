import { CheckCircle, AlertTriangle, AlertCircle, Loader2, Search, ExternalLink, Clock, Cpu } from 'lucide-react';
import type { AnalysisResult } from '../App';

interface AnalysisResultsProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

export function AnalysisResults({ result, isAnalyzing }: AnalysisResultsProps) {
  if (isAnalyzing) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Analysis Results</h2>
          <p className="text-sm text-gray-500 mt-1">
            AI-powered verification in progress
          </p>
        </div>

        <div className="flex-1 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center">
          <Loader2 className="size-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-900 font-medium mb-1">Running multi-modal analysis...</p>
          <p className="text-sm text-gray-500">Cross-referencing trusted sources</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Analysis Results</h2>
          <p className="text-sm text-gray-500 mt-1">
            Verification and evidence will appear here
          </p>
        </div>

        <div className="flex-1 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
          <Search className="size-16 mb-4 opacity-20" />
          <p className="text-sm">No analysis yet</p>
          <p className="text-xs mt-1">Upload content to begin verification</p>
        </div>
      </div>
    );
  }

  const verdictConfig = {
    authentic: {
      icon: CheckCircle,
      label: 'Likely Authentic',
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      textColor: 'text-green-900'
    },
    manipulated: {
      icon: AlertTriangle,
      label: 'Likely Manipulated',
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      textColor: 'text-red-900'
    },
    suspicious: {
      icon: AlertCircle,
      label: 'Suspicious Content',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      textColor: 'text-amber-900'
    }
  };

  const config = verdictConfig[result.verdict];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Analysis Results</h2>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {result.analyzedAt.toLocaleTimeString()}
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="size-3" />
              {result.processingTime}ms
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-auto">
        <div className="p-6 space-y-6">
          {/* Verdict Card */}
          <div className={`border-2 rounded-lg p-6 ${config.bg} ${config.border}`}>
            <div className="flex items-start gap-4">
              <config.icon className={`size-12 ${config.color} flex-shrink-0`} />
              <div className="flex-1">
                <h3 className={`text-2xl font-semibold mb-2 ${config.textColor}`}>
                  {config.label}
                </h3>
                <p className={`text-sm ${config.color}`}>
                  {result.contentType === 'text' && 'Semantic analysis and source verification completed'}
                  {result.contentType === 'image' && 'Computer vision and forensic analysis completed'}
                  {result.contentType === 'video' && 'Deepfake detection and temporal analysis completed'}
                </p>
              </div>
            </div>
          </div>

          {/* Confidence Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">Confidence Level</span>
              <span className="text-sm font-semibold text-gray-900">{result.confidence}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all ${
                  result.verdict === 'authentic' ? 'bg-green-600' :
                  result.verdict === 'manipulated' ? 'bg-red-600' :
                  'bg-amber-600'
                }`}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>

          {/* AI Generation Detection (for images) */}
          {result.aiGenerated && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">AI Generation Detection</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">AI-Generated Likelihood</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(result.aiGenerated.likelihood)}%
                  </span>
                </div>
                {result.aiGenerated.model && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Suspected Model</span>
                    <span className="font-medium text-gray-900">{result.aiGenerated.model}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Deepfake Detection (for videos) */}
          {result.deepfakeDetection && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Deepfake Detection</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Deepfake Detected</span>
                  <span className={`font-semibold ${
                    result.deepfakeDetection.detected ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {result.deepfakeDetection.detected ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Detection Confidence</span>
                  <span className="font-semibold text-gray-900">
                    {result.deepfakeDetection.confidence}%
                  </span>
                </div>
                {result.deepfakeDetection.manipulationType && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Manipulation Type</span>
                    <span className="font-medium text-gray-900">
                      {result.deepfakeDetection.manipulationType}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Semantic Analysis (for text) */}
          {result.semanticAnalysis && result.semanticAnalysis.claims.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Claim Verification</h4>
              <div className="space-y-2">
                {result.semanticAnalysis.verification.map((item, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-700 mb-2">{item.claim}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          item.status === 'verified' ? 'bg-green-100 text-green-700' :
                          item.status === 'disputed' ? 'bg-red-100 text-red-700' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {item.sources.length} sources checked
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Supporting Evidence</h4>
            <div className="space-y-2">
              {result.evidence.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div className={`size-2 rounded-full mt-1.5 flex-shrink-0 ${
                    item.type === 'support' ? 'bg-green-500' :
                    item.type === 'concern' ? 'bg-red-500' :
                    'bg-gray-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{item.description}</p>
                    {item.source && (
                      <p className="text-xs text-gray-500 mt-1">Source: {item.source}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Source Attribution */}
          {result.sourceAttribution && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ExternalLink className="size-4" />
                Source Attribution
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Possible Origins: </span>
                  <span className="text-gray-900 font-medium">
                    {result.sourceAttribution.possibleOrigins.join(', ')}
                  </span>
                </div>
                {result.sourceAttribution.earliestDetection && (
                  <div>
                    <span className="text-gray-600">Earliest Detection: </span>
                    <span className="text-gray-900 font-medium">
                      {result.sourceAttribution.earliestDetection}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 leading-relaxed">
              This analysis uses advanced AI models including language understanding, computer vision, 
              and deepfake detection. Results should be used as guidance and verified through multiple 
              trusted sources before taking action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
