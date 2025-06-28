import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Music, Play, Pause, Download, Headphones } from 'lucide-react';

const musicTools = [
  {
    title: 'AI Beat Generator',
    description: 'Generate unique beats and rhythms using machine learning algorithms',
    category: 'Generation',
    difficulty: 'Beginner',
    color: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
  },
  {
    title: 'Smart Audio Mastering',
    description: 'Automatically enhance your tracks with AI-powered mastering',
    category: 'Enhancement',
    difficulty: 'Intermediate',
    color: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Melody Harmonizer',
    description: 'Add intelligent harmonies to your melodies with AI assistance',
    category: 'Composition',
    difficulty: 'Advanced',
    color: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
  },
];

export function MusicTools() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo] = useState([120]);
  const [volume] = useState([75]);

  return (
    <section id="music-tools" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">AI Music Creation Tools</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Empower your creativity with AI-powered music production tools
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Interactive Music Player */}
          <div>
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Music className="h-6 w-6 text-purple-600" />
                  <span>AI Music Studio</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    size="lg"
                    className={`w-16 h-16 rounded-full ${
                      isPlaying 
                        ? 'bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' 
                        : 'bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                    }`}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white" />}
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                      Tempo: {tempo[0]} BPM
                    </label>
                    <Slider
                      value={tempo}
                      min={60}
                      max={200}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                      Volume: {volume[0]}%
                    </label>
                    <Slider
                      value={volume}
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Headphones className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tools Grid */}
          <div className="space-y-6">
            {musicTools.map((tool) => (
              <Card key={tool.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tool.color}`}>
                        <Music className="h-4 w-4" />
                      </div>
                      <h3 className="text-lg font-semibold">{tool.title}</h3>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {tool.difficulty}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {tool.category}
                    </Badge>
                    <Button size="sm" variant="ghost" className="text-purple-600 dark:text-purple-400">
                      Try Now →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered Creation</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Generate unique musical compositions using advanced machine learning algorithms
            </p>
          </div>

          <div className="text-center p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-time Processing</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Instant audio processing and enhancement with low-latency algorithms
            </p>
          </div>

          <div className="text-center p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Export & Share</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Export your creations in multiple formats and share across platforms
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}