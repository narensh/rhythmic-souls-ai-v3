import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, MessageCircle, BarChart3, Code2 } from 'lucide-react';

const videoId = 'QgxViasTjqs';
const noCookie = true;
const autoplay = 1;
const mute = 1;
const demoVideoUrl = `https://www.youtube${noCookie ? '-nocookie' : ''}.com/embed/${videoId}?autoplay=${autoplay}&mute=${mute}`;

const demoFeatures = [
  {
    icon: MessageCircle,
    title: 'Live Chat Integration',
    description: 'See how our conversational AI handles complex customer queries in real-time.',
    color: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Explore detailed insights and performance metrics from our AI solutions.',
    color: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Code2,
    title: 'Code Playground',
    description: 'Test our APIs and see live examples of integration possibilities.',
    color: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
  },
];

export function DemoVideo() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Experience Our Platform</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Watch our demo to see how our AI solutions can transform your business
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Demo Video/Interface */}
          <div className="relative">
            <Card className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="relative aspect-[16/9]">
                <iframe
                  src={demoVideoUrl}
                  title="Interactive Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
                ></iframe>
              </div>
            </Card>
          </div>

          {/* Demo Features */}
          <div className="space-y-6">
            {demoFeatures.map((feature) => (
              <div key={feature.title} className="flex items-start space-x-4">
                <div className={`w-12 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
