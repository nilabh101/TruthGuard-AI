import { Shield } from 'lucide-react';

export function Sidebar() {
  const capabilities = [
    {
      title: 'Text Analysis',
      items: ['Semantic understanding', 'Claim verification', 'Source cross-checking']
    },
    {
      title: 'Image Analysis',
      items: ['AI-generation detection', 'Forensic analysis', 'Manipulation detection']
    },
    {
      title: 'Video Analysis',
      items: ['Deepfake detection', 'Temporal analysis', 'Audio-visual sync']
    }
  ];

  const useCases = [
    'Government Monitoring',
    'Media Verification',
    'Election Integrity',
    'Digital Trust & Safety'
  ];

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Shield className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">TruthGuard AI</h1>
            <p className="text-xs text-gray-500">Multi-Modal Verification</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-2">System Overview</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Advanced AI platform for detecting misinformation, deepfakes, and AI-generated 
              manipulations across text, images, and videos.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Capabilities</h2>
            <div className="space-y-3">
              {capabilities.map((capability) => (
                <div key={capability.title}>
                  <p className="text-xs font-semibold text-gray-700 mb-1.5">{capability.title}</p>
                  <ul className="space-y-1">
                    {capability.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Use Cases</h2>
            <ul className="space-y-2">
              {useCases.map((useCase) => (
                <li key={useCase} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-auto p-8 border-t border-gray-200">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-blue-900 mb-1">DEMO VERSION</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Demonstration platform using simulated AI models. Production system integrates 
            real-time knowledge bases and computer vision models.
          </p>
        </div>
      </div>
    </aside>
  );
}
