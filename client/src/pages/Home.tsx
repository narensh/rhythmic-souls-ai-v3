import { Navigation } from '@/components/Layout/Navigation';
import { HeroSection } from '@/components/Hero/HeroSection';
import { ServicesGrid } from '@/components/Services/ServicesGrid';
import { InteractiveDemo } from '@/components/Demo/InteractiveDemo';
import { CodeEditor } from '@/components/Education/CodeEditor';
import { MusicTools } from '@/components/Music/MusicTools';
import { UserDashboard } from '@/components/Dashboard/UserDashboard';
import { NewsSection } from '@/components/News/NewsSection';
import { TestimonialsSection } from '@/components/Testimonials/TestimonialsSection';
import { NewsletterSection } from '@/components/Newsletter/NewsletterSection';
import { Footer } from '@/components/Layout/Footer';
import { Sidebar } from '@/components/Layout/Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Home() {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navigation />
      <Sidebar />
      
      <main className={`lg:${isCollapsed ? 'ml-16' : 'ml-64'} pt-16 min-h-screen transition-all duration-300`}>
        <HeroSection />
        <UserDashboard />
        <ServicesGrid />
        <div id="content-creation">
          <InteractiveDemo />
        </div>
        <div id="education">
          <CodeEditor />
        </div>
        <div id="music-tools">
          <MusicTools />
        </div>
        <div id="news-feed">
          <NewsSection />
        </div>
        <TestimonialsSection />
        <div id="resources">
          <NewsletterSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
