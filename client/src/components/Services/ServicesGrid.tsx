import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  Cog, 
  Headphones, 
  GitBranch, 
  Brain, 
  Cpu, 
  Check 
} from 'lucide-react';

const services = [
  {
    id: 'conversational-ai',
    icon: Bot,
    title: 'Conversational AI',
    description: 'Build intelligent chatbots, voicebots, and WhatsApp bots that understand context and deliver personalized customer experiences.',
    features: ['Multi-channel deployment', 'Natural language processing', 'Voice & text integration'],
    gradient: 'from-purple-500 to-purple-600',
    hoverGradient: 'hover:from-purple-600 hover:to-purple-700',
  },
  {
    id: 'agentic-ai',
    icon: Cog,
    title: 'Agentic AI Solutions',
    description: 'Enable dynamic AI-driven workflows that adapt and respond to changing business needs with autonomous decision-making capabilities.',
    features: ['Autonomous workflows', 'Flexible automation', 'Rapid deployment'],
    gradient: 'from-blue-500 to-blue-600',
    hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
  },
  {
    id: 'call-centre',
    icon: Headphones,
    title: 'Call Centre Solutions',
    description: 'Enhance call center efficiency with AI-powered agent auditing, real-time analytics, and intelligent customer insights.',
    features: ['Agent performance tracking', 'Call analytics & insights', 'Quality assurance automation'],
    gradient: 'from-green-500 to-green-600',
    hoverGradient: 'hover:from-green-600 hover:to-green-700',
  },
  {
    id: 'devops-cicd',
    icon: GitBranch,
    title: 'DevOps & CI/CD',
    description: 'Streamline software delivery with end-to-end DevOps pipelines, automated testing, and built-in observability tools.',
    features: ['Automated pipelines', 'Continuous integration', 'Built-in monitoring'],
    gradient: 'from-orange-500 to-orange-600',
    hoverGradient: 'hover:from-orange-600 hover:to-orange-700',
  },
  {
    id: 'mlops-platform',
    icon: Brain,
    title: 'MLOps Platform',
    description: 'Accelerate AI development with custom model training, automated data annotation, and streamlined ML operations.',
    features: ['Custom model training', 'Data annotation tools', 'Model deployment & monitoring'],
    gradient: 'from-pink-500 to-pink-600',
    hoverGradient: 'hover:from-pink-600 hover:to-pink-700',
  },
  {
    id: 'gpu-optimization',
    icon: Cpu,
    title: 'GPU & Infra Optimization',
    description: 'Optimize compute costs with intelligent GPU slicing, infrastructure tuning, and hybrid cloud management solutions.',
    features: ['GPU resource optimization', 'Cost reduction strategies', 'Multi-cloud support'],
    gradient: 'from-red-500 to-red-600',
    hoverGradient: 'hover:from-red-600 hover:to-red-700',
  },
];

export function ServicesGrid() {
  return (
    <section id="services" className="py-20 bg-slate-50 dark:bg-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Our Core AI Solutions</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Comprehensive AI-powered tools designed to streamline operations, enhance customer engagement, 
            and accelerate your digital transformation journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card id={service.id} key={service.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-6`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full bg-gradient-to-r ${service.gradient} text-white ${service.hoverGradient} transition-all`}
                  onClick={() => {
                    if (service.id) {
                      const element = document.getElementById(service.id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
