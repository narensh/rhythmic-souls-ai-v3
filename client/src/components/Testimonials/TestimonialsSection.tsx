import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const fallbackTestimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'CEO',
    company: 'TechCorp',
    content: 'Rhythmic Souls AI transformed our customer service with their conversational AI solution. We\'ve seen a 40% reduction in response time and improved customer satisfaction.',
    rating: 5,
    imageUrl: null,
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'CTO',
    company: 'DataFlow',
    content: 'Their MLOps platform helped us deploy models 60% faster. The automated pipelines and monitoring tools are exactly what we needed for scale.',
    rating: 5,
    imageUrl: null,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    title: 'Head of Engineering',
    company: 'CloudScale',
    content: 'The GPU optimization saved us 30% on infrastructure costs while improving performance. Excellent ROI and outstanding support team.',
    rating: 5,
    imageUrl: null,
  },
];

export function TestimonialsSection() {
  const { data: testimonials = fallbackTestimonials, isLoading } = useQuery({
    queryKey: ['/api/testimonials'],
    retry: false,
  });

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Success stories from businesses that transformed with our AI solutions</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  ))}
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Success stories from businesses that transformed with our AI solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-700">
              <CardContent className="p-0">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.imageUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">
                      {testimonial.title}{testimonial.company && `, ${testimonial.company}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
