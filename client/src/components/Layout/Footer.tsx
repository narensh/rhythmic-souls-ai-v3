import { Link } from 'wouter';
import { Mail, Phone } from 'lucide-react';
import logoPath from '@assets/logo-design_1751134726547.jpg';

const services = [
  'Conversational AI',
  'Agentic AI Solutions',
  'Call Centre Solutions',
  'DevOps & CI/CD',
  'MLOps Platform',
  'GPU Optimization',
];

const resources = [
  'Documentation',
  'API Reference',
  'Tutorials',
  'Case Studies',
  'Blog',
  'Community',
];

const company = [
  'About Us',
  'Careers',
  'Contact',
  'Privacy Policy',
  'Terms of Service',
  'Security',
];

export function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={logoPath} 
                alt="Rhythmic Souls AI Logo" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-bold text-white">Rhythmic Souls AI</h3>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Transforming businesses with intelligent AI solutions. From conversational bots to MLOps platforms, 
              we deliver cutting-edge technology that drives real results.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-purple-400" />
                <span className="text-sm">info@rhythmicsouls.ai</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-purple-400" />
                <span className="text-sm">+91-9220460200</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              {services.map((service) => (
                <li key={service}>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              {resources.map((resource) => (
                <li key={resource}>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {company.map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="my-8 border-slate-700" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-400">
            © 2024 Rhythmic Souls Pvt Ltd. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">
              <i className="fab fa-github"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
