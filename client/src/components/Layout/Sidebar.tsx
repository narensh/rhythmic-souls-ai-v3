import { Link } from 'wouter';
import { 
  Bot, 
  Cog, 
  Headphones, 
  GitBranch, 
  Brain, 
  Cpu, 
  Edit, 
  Newspaper, 
  Music, 
  GraduationCap, 
  Book,
  Mail,
  Phone
} from 'lucide-react';

const mainServices = [
  { href: '#conversational-ai', icon: Bot, label: 'Conversational AI', color: 'text-purple-500' },
  { href: '#agentic-ai', icon: Cog, label: 'Agentic AI Solutions', color: 'text-blue-500' },
  { href: '#call-center', icon: Headphones, label: 'Call Centre Solutions', color: 'text-green-500' },
  { href: '#devops', icon: GitBranch, label: 'DevOps & CI/CD', color: 'text-orange-500' },
  { href: '#mlops', icon: Brain, label: 'MLOps Platform', color: 'text-pink-500' },
  { href: '#gpu-optimization', icon: Cpu, label: 'GPU Optimization', color: 'text-red-500' },
];

const additionalTools = [
  { href: '#content-creation', icon: Edit, label: 'Content Creation', color: 'text-purple-400' },
  { href: '#news-feed', icon: Newspaper, label: 'Latest News', color: 'text-blue-400' },
  { href: '#music-tools', icon: Music, label: 'Music Tools', color: 'text-green-400' },
  { href: '#education', icon: GraduationCap, label: 'Education Platform', color: 'text-yellow-400' },
  { href: '#resources', icon: Book, label: 'Resources Library', color: 'text-indigo-400' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 z-40 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Main Services
        </h3>
        <nav className="space-y-2">
          {mainServices.map((service) => (
            <a
              key={service.href}
              href={service.href}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            >
              <service.icon className={`h-5 w-5 ${service.color}`} />
              <span className="text-sm font-medium">{service.label}</span>
            </a>
          ))}
        </nav>

        <hr className="my-6 border-slate-200 dark:border-slate-700" />

        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Additional Tools
        </h3>
        <nav className="space-y-2">
          {additionalTools.map((tool) => (
            <a
              key={tool.href}
              href={tool.href}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            >
              <tool.icon className={`h-5 w-5 ${tool.color}`} />
              <span className="text-sm font-medium">{tool.label}</span>
            </a>
          ))}
        </nav>

        <hr className="my-6 border-slate-200 dark:border-slate-700" />

        {/* Contact Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
            <Mail className="h-4 w-4" />
            <span>info@rhythmicsouls.ai</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
            <Phone className="h-4 w-4" />
            <span>+91-9220460200</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
