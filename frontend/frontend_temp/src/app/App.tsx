import { useState } from 'react';
import { Sidebar } from './components/sidebar';
import { ContentInput } from './components/content-input';
import { AnalysisResults } from './components/analysis-results';

export type ContentType = 'text' | 'image' | 'video';

export interface AnalysisResult {
  contentType: ContentType;
  verdict: 'authentic' | 'manipulated' | 'suspicious';
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
      status: 'verified' | 'disputed' | 'unverified';
      sources: string[];
    }>;
  };
  evidence: Array<{
    type: 'support' | 'concern' | 'neutral';
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
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (content: string | File, type: ContentType) => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    const processingStart = Date.now();
    await new Promise(resolve => setTimeout(resolve, 3000));
    const processingTime = Date.now() - processingStart;
    
    // Generate mock analysis result based on type
    const result = generateMockAnalysis(content, type, processingTime);
    setAnalysisResult(result);
    setIsAnalyzing(false);
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

function generateMockAnalysis(content: string | File, type: ContentType, processingTime: number): AnalysisResult {
  let verdict: 'authentic' | 'manipulated' | 'suspicious';
  let confidence: number;
  const evidence: AnalysisResult['evidence'] = [];
  
  if (type === 'text') {
    const text = typeof content === 'string' ? content.toLowerCase() : '';
    
    const hasStrongClaims = /breaking|shocking|never|always|100%|guaranteed|must see/.test(text);
    const hasEmotionalLanguage = /devastating|terrible|amazing|incredible|unbelievable/.test(text);
    const hasSourceMentions = /according to|reported by|study shows|research|expert|official/.test(text);
    const hasNumbers = /\d+%|\d+ percent|\d+ people/.test(text);
    
    if (hasStrongClaims && hasEmotionalLanguage && !hasSourceMentions) {
      verdict = 'manipulated';
      confidence = 78 + Math.random() * 15;
    } else if (hasSourceMentions && hasNumbers) {
      verdict = 'authentic';
      confidence = 72 + Math.random() * 18;
    } else {
      verdict = 'suspicious';
      confidence = 55 + Math.random() * 20;
    }
    
    if (hasSourceMentions) {
      evidence.push({
        type: 'support',
        description: 'Content cites specific sources and authorities',
        source: 'Semantic Analysis Engine'
      });
    }
    
    if (hasEmotionalLanguage) {
      evidence.push({
        type: 'concern',
        description: 'Heavy use of emotionally charged language typical of misinformation',
        source: 'Linguistic Pattern Detector'
      });
    }
    
    if (!hasSourceMentions) {
      evidence.push({
        type: 'concern',
        description: 'Lacks verifiable attribution or citation',
        source: 'Source Verification System'
      });
    }
    
    const claims = extractClaims(text);
    
    return {
      contentType: type,
      verdict,
      confidence: Math.round(confidence),
      semanticAnalysis: {
        claims,
        verification: claims.map(claim => ({
          claim,
          status: verdict === 'authentic' ? 'verified' : verdict === 'manipulated' ? 'disputed' : 'unverified',
          sources: ['Reuters', 'AP News', 'FactCheck.org']
        }))
      },
      evidence,
      sourceAttribution: {
        possibleOrigins: ['Social Media', 'Unverified Blog'],
        earliestDetection: '2 days ago'
      },
      analyzedAt: new Date(),
      processingTime
    };
  } else if (type === 'image') {
    const isManipulated = Math.random() > 0.5;
    verdict = isManipulated ? 'manipulated' : 'authentic';
    confidence = 70 + Math.random() * 25;
    
    evidence.push({
      type: isManipulated ? 'concern' : 'support',
      description: isManipulated 
        ? 'Detected inconsistencies in noise patterns and compression artifacts'
        : 'Consistent EXIF metadata and natural noise distribution',
      source: 'Computer Vision Analysis'
    });
    
    if (isManipulated) {
      evidence.push({
        type: 'concern',
        description: 'Edge detection reveals potential cloning or splicing',
        source: 'Forensic Image Analyzer'
      });
    }
    
    return {
      contentType: type,
      verdict,
      confidence: Math.round(confidence),
      aiGenerated: {
        likelihood: isManipulated ? 75 + Math.random() * 20 : 15 + Math.random() * 15,
        model: isManipulated ? 'Stable Diffusion / Midjourney' : undefined
      },
      evidence,
      sourceAttribution: {
        possibleOrigins: isManipulated ? ['AI Generator', 'Photoshop'] : ['Original Photo'],
        earliestDetection: '1 week ago'
      },
      analyzedAt: new Date(),
      processingTime
    };
  } else {
    const hasDeepfake = Math.random() > 0.6;
    verdict = hasDeepfake ? 'manipulated' : 'authentic';
    confidence = 65 + Math.random() * 25;
    
    evidence.push({
      type: hasDeepfake ? 'concern' : 'support',
      description: hasDeepfake
        ? 'Facial landmark inconsistencies detected across frames'
        : 'Natural eye blink patterns and facial micro-expressions',
      source: 'Deepfake Detection Model'
    });
    
    if (hasDeepfake) {
      evidence.push({
        type: 'concern',
        description: 'Audio-visual synchronization anomalies detected',
        source: 'Multi-modal Analyzer'
      });
    }
    
    return {
      contentType: type,
      verdict,
      confidence: Math.round(confidence),
      deepfakeDetection: {
        detected: hasDeepfake,
        confidence: Math.round(confidence),
        manipulationType: hasDeepfake ? 'Face swap' : undefined
      },
      evidence,
      sourceAttribution: {
        possibleOrigins: hasDeepfake ? ['Deepfake Generator'] : ['Original Recording'],
        earliestDetection: '3 days ago'
      },
      analyzedAt: new Date(),
      processingTime
    };
  }
}

function extractClaims(text: string): string[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 3).map(s => s.trim());
}
