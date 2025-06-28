import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 text-white py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Transform Your Business with{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Intelligent AI
              </span>
            </h1>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Accelerate growth with our comprehensive AI solutions - from conversational bots to MLOps platforms. 
              Build, deploy, and scale intelligent systems that drive real business value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="px-8 py-4 bg-white text-purple-600 font-semibold hover:bg-purple-50 transition-colors"
                onClick={() => window.location.href = '/api/login'}
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="px-8 py-4 border-2 border-white text-white font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <div className="text-center">
                  <Bot className="h-24 w-24 text-white/80 mx-auto mb-4" />
                  <p className="text-white/60 text-lg">AI Solutions Dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
