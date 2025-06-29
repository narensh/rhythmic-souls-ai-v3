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
    { title: "Conversational AI", description: "AI-powered chatbots voice assistants customer engagement chat support automated responses", section: "services" },
    { title: "Agentic AI Solutions", description: "Autonomous AI agents business process automation intelligent workflow management", section: "services" },
    { title: "Call Centre Solutions", description: "AI-enhanced call center technology customer service phone automation voice recognition", section: "services" },
    { title: "DevOps & CI/CD", description: "Continuous integration deployment solutions development operations automation pipeline", section: "services" },
    { title: "MLOps Platform", description: "Machine learning operations model management ML deployment artificial intelligence", section: "services" },
    { title: "GPU & Infra Cost Optimization", description: "Cloud infrastructure optimization cost reduction server performance computing resources", section: "services" }
  ],
  features: [
    { title: "Interactive Demo", description: "Try our AI solutions with live demonstrations hands-on experience platform testing", section: "content-creation" },
    { title: "Content Creation", description: "AI-powered content generation tools writing automation blog articles social media", section: "content-creation" },
    { title: "Music Tools", description: "AI music generation audio processing sound synthesis creative tools", section: "music-tools" },
    { title: "Latest News", description: "Industry news AI technology updates blog articles insights trends", section: "news-feed" }
  ],
  company: [
    { title: "About Rhythmic Souls AI", description: "Leading provider intelligent business solutions company information team mission", section: "about" },
    { title: "Contact Us", description: "Get in touch info@rhythmicsouls.ai +91-9220460200 contact form support", section: "contact" },
    { title: "Services", description: "AI business solutions conversational AI DevOps MLOps call center optimization", section: "services" },
    { title: "Solutions", description: "Business automation AI integration digital transformation technology consulting", section: "services" }
  ]
};

function searchSiteContent(query: string) {
  const searchTerm = query.toLowerCase().trim();
  const results: any[] = [];
  
  if (!searchTerm) return results;
  
  // Search through all content categories with enhanced matching
  Object.entries(siteContent).forEach(([category, items]) => {
    items.forEach(item => {
      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();
      
      // Enhanced partial matching - split search term for multi-word queries
      const searchWords = searchTerm.split(' ').filter(word => word.length > 0);
      
      let titleMatches = 0;
      let descMatches = 0;
      
      searchWords.forEach(word => {
        if (titleLower.includes(word)) titleMatches++;
        if (descLower.includes(word)) descMatches++;
      });
      
      // Match if any word matches either title or description
      const hasMatch = titleMatches > 0 || descMatches > 0;
      
      if (hasMatch) {
        // Calculate relevance based on match quality
        let relevance = 0;
        if (titleMatches === searchWords.length) relevance += 3; // All words in title
        else if (titleMatches > 0) relevance += 2; // Some words in title
        if (descMatches === searchWords.length) relevance += 2; // All words in description
        else if (descMatches > 0) relevance += 1; // Some words in description
        
        results.push({
          ...item,
          category: category.charAt(0).toUpperCase() + category.slice(1),
          relevance: relevance
        });
      }
    });
  });
  
  // Sort by relevance (highest first)
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