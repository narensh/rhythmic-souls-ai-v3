import { useState } from 'react';
import { Search, Loader2, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Internal site content for search
const siteContent = {
  services: [
    { title: "Conversational AI", description: "AI-powered chatbots and voice assistants for customer engagement", section: "services" },
    { title: "Agentic AI Solutions", description: "Autonomous AI agents for business process automation", section: "services" },
    { title: "Call Centre Solutions", description: "AI-enhanced call center technology for improved customer service", section: "services" },
    { title: "DevOps & CI/CD", description: "Continuous integration and deployment solutions", section: "services" },
    { title: "MLOps Platform", description: "Machine learning operations and model management", section: "services" },
    { title: "GPU & Infra Cost Optimization", description: "Cloud infrastructure optimization for reduced costs", section: "services" }
  ],
  features: [
    { title: "Interactive Demo", description: "Try our AI solutions with live demonstrations", section: "content-creation" },
    { title: "Content Creation", description: "AI-powered content generation tools", section: "content-creation" },
    { title: "Music Tools", description: "AI music generation and audio processing", section: "music-tools" },
    { title: "Latest News", description: "Industry news and AI technology updates", section: "news-feed" }
  ],
  company: [
    { title: "About Rhythmic Souls AI", description: "Leading provider of intelligent business solutions", section: "about" },
    { title: "Contact", description: "Get in touch: info@rhythmicsouls.ai, +91-9220460200", section: "contact" }
  ]
};

function searchSiteContent(query: string) {
  const searchTerm = query.toLowerCase();
  const results: any[] = [];
  
  // Search through all content categories
  Object.entries(siteContent).forEach(([category, items]) => {
    items.forEach(item => {
      if (item.title.toLowerCase().includes(searchTerm) || 
          item.description.toLowerCase().includes(searchTerm)) {
        results.push({
          ...item,
          category: category.charAt(0).toUpperCase() + category.slice(1),
          relevance: item.title.toLowerCase().includes(searchTerm) ? 2 : 1
        });
      }
    });
  });
  
  // Sort by relevance
  return results.sort((a, b) => b.relevance - a.relevance);
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const performSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search delay for better UX
    setTimeout(() => {
      const results = searchSiteContent(query);
      setSearchResults(results);
      setIsOpen(true);
      setIsSearching(false);
      
      if (results.length === 0) {
        toast({
          title: "No results found",
          description: `No content found for "${query}". Try searching for services, features, or company info.`,
        });
      }
    }, 300);
  };

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not on home page, navigate to home first
      if (window.location.pathname !== '/') {
        window.location.href = `/#${sectionId}`;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search site content..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 animate-spin" />
          )}
        </div>
      </form>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Search Results for "{query}"</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <div
                  key={index}
                  className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  onClick={() => scrollToSection(result.section)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-slate-900 dark:text-slate-100">
                          {result.title}
                        </h3>
                        <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                          {result.category}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {result.description}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-400 ml-2 flex-shrink-0" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results found. Try searching for:</p>
                <p className="text-sm mt-2">Services, AI, Chat, DevOps, Music, News, About</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}