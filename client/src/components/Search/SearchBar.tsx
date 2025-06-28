import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const { toast } = useToast();

  const searchMutation = useMutation({
    mutationFn: async (searchQuery: string) => {
      const response = await apiRequest('POST', '/api/search', { query: searchQuery });
      return response.json();
    },
    onSuccess: (data) => {
      setSearchResults(data.results);
      setIsOpen(true);
    },
    onError: (error) => {
      toast({
        title: "Search failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchMutation.mutate(query.trim());
    }
  };

  return (
    <>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search with AI..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          {searchMutation.isPending && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 animate-spin" />
          )}
        </div>
      </form>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Search Results</DialogTitle>
          </DialogHeader>
          {searchResults && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Query: "{searchResults.query}"
                </p>
                <div className="prose dark:prose-invert max-w-none">
                  <p>{searchResults.answer}</p>
                </div>
              </div>
              {searchResults.relatedTopics && searchResults.relatedTopics.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Related Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.relatedTopics.map((topic: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-xs rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
