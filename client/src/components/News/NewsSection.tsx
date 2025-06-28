import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

export function NewsSection() {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['/api/news'],
    retry: false,
  });

  if (isLoading) {
    return (
      <section id="news-feed" className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Latest News & Insights</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Stay updated with the latest in AI and technology</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-200 dark:bg-slate-700 h-48 rounded-t-xl"></div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-b-xl border border-slate-200 dark:border-slate-700">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-3"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news-feed" className="py-20 bg-slate-50 dark:bg-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Latest News & Insights</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">Stay updated with the latest in AI and technology</p>
        </div>

        {articles.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Card key={article.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-shadow">
                  {article.imageUrl && (
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      {article.category && (
                        <Badge variant="secondary" className="text-xs">
                          {article.category}
                        </Badge>
                      )}
                      <div className="flex items-center text-xs text-slate-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(article.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    <Button variant="ghost" className="text-purple-600 dark:text-purple-400 p-0 h-auto font-medium hover:underline">
                      Read More →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all">
                View All Articles
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Articles Available</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                We're working on bringing you the latest AI insights and technology news.
              </p>
              <Button variant="outline">
                Check Back Soon
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
