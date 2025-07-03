import { Navigation } from '@/components/Layout/Navigation';
import { HeroSection } from '@/components/Hero/HeroSection';
import { ServicesGrid } from '@/components/Services/ServicesGrid';
import { DemoVideo } from '@/components/Demo/DemoVideo';
import { UserDashboard } from '@/components/Dashboard/UserDashboard';
import { NewsletterSection } from '@/components/Newsletter/NewsletterSection';
import { Footer } from '@/components/Layout/Footer';
import { Sidebar } from '@/components/Layout/Sidebar';

export default function Home() {
  const isCollapsed = true;
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navigation />
      
      <main className={`pt-16 min-h-screen transition-all duration-300 ${isCollapsed ? 'md:ml-0' : 'md:ml-80'}`}>
        <HeroSection />
        <UserDashboard />
        <div id="services">
          <ServicesGrid />
        </div>
        <div id="content-creation">
          <DemoVideo />
        </div>
        <div id="resources">
          <NewsletterSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
