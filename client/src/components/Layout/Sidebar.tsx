import { Link } from 'wouter';
import { useSidebar } from '@/contexts/SidebarContext';
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
  Phone,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const mainServices = [
  { href: 'services', icon: Bot, label: 'Conversational AI', color: 'text-purple-500' },
  { href: 'services', icon: Cog, label: 'Agentic AI Solutions', color: 'text-blue-500' },
  { href: 'services', icon: Headphones, label: 'Call Centre Solutions', color: 'text-green-500' },
  { href: 'services', icon: GitBranch, label: 'DevOps & CI/CD', color: 'text-orange-500' },
  { href: 'services', icon: Brain, label: 'MLOps Platform', color: 'text-pink-500' },
  { href: 'services', icon: Cpu, label: 'GPU Optimization', color: 'text-red-500' },
];

const additionalTools = [
  { href: 'content-creation', icon: Edit, label: 'Content Creation', color: 'text-purple-400' },
  { href: 'news-feed', icon: Newspaper, label: 'Latest News', color: 'text-blue-400' },
  { href: 'music-tools', icon: Music, label: 'Music Tools', color: 'text-green-400' },
  { href: 'education', icon: GraduationCap, label: 'Education Platform', color: 'text-yellow-400' },
  { href: 'resources', icon: Book, label: 'Resources Library', color: 'text-indigo-400' },
];

export function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  const handleServiceClick = (sectionId: string) => {
    // First navigate to home page if not already there
    if (window.location.pathname !== '/') {
      window.location.href = '/';
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on home page, just scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleToolClick = (sectionId: string) => {
    // First navigate to home page if not already there
    if (window.location.pathname !== '/') {
      window.location.href = '/';
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on home page, just scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <aside className={`fixed left-0 top-16 bottom-0 ${isCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transform -translate-x-full lg:translate-x-0 transition-all duration-300 z-40 overflow-y-auto`}>
      <div className="p-4">
        {!isCollapsed && (
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Main Services
          </h3>
        )}
        <nav className="space-y-2">
          {mainServices.map((service) => (
            <button
              key={service.href}
              onClick={() => handleServiceClick(service.href)}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} p-3 w-full rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group`}
              title={isCollapsed ? service.label : ''}
            >
              <service.icon className={`h-5 w-5 ${service.color}`} />
              {!isCollapsed && <span className="text-sm font-medium">{service.label}</span>}
            </button>
          ))}
        </nav>

        {!isCollapsed && <hr className="my-6 border-slate-200 dark:border-slate-700" />}

        {!isCollapsed && (
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Additional Tools
          </h3>
        )}
        <nav className="space-y-2">
          {additionalTools.map((tool) => (
            <button
              key={tool.href}
              onClick={() => handleToolClick(tool.href)}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} p-3 w-full rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group`}
              title={isCollapsed ? tool.label : ''}
            >
              <tool.icon className={`h-5 w-5 ${tool.color}`} />
              {!isCollapsed && <span className="text-sm font-medium">{tool.label}</span>}
            </button>
          ))}
        </nav>

        {!isCollapsed && <hr className="my-6 border-slate-200 dark:border-slate-700" />}

        {/* Contact Info */}
        {!isCollapsed && (
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
        )}
      </div>
    </aside>
  );
}
