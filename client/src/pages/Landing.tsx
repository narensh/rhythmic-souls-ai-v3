import { Navigation } from '@/components/Layout/Navigation';
import { HeroSection } from '@/components/Hero/HeroSection';
import { ServicesGrid } from '@/components/Services/ServicesGrid';
import { InteractiveDemo } from '@/components/Demo/InteractiveDemo';
import { CodeEditor } from '@/components/Education/CodeEditor';
import { MusicTools } from '@/components/Music/MusicTools';
import { NewsSection } from '@/components/News/NewsSection';
import { TestimonialsSection } from '@/components/Testimonials/TestimonialsSection';
import { NewsletterSection } from '@/components/Newsletter/NewsletterSection';
import { Footer } from '@/components/Layout/Footer';
import { Sidebar } from '@/components/Layout/Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Landing() {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navigation />
      <Sidebar />
      
      <main className={`pt-16 min-h-screen transition-all duration-300 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <HeroSection />
        <ServicesGrid />
        <InteractiveDemo />
        <CodeEditor />
        <MusicTools />
        <NewsSection />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
      
      <Footer />
    </div>
  );
}
