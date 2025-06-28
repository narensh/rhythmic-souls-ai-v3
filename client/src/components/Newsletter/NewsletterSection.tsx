import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const subscribeToNewsletterMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest('POST', '/api/newsletter/subscribe', { email });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail('');
    },
    onError: (error) => {
      toast({
        title: "Subscription failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscribeToNewsletterMutation.mutate(email);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Stay Updated with AI Insights</h2>
        <p className="text-xl text-purple-100 mb-8">
          Get the latest news, tutorials, and industry insights delivered to your inbox
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex space-x-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white text-slate-900 border-white focus:ring-white/50"
            />
            <Button
              type="submit"
              disabled={subscribeToNewsletterMutation.isPending}
              className="bg-white text-purple-600 font-semibold hover:bg-purple-50 transition-colors"
            >
              {subscribeToNewsletterMutation.isPending ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
          <p className="text-sm text-purple-200 mt-3">No spam. Unsubscribe anytime.</p>
        </form>
      </div>
    </section>
  );
}
