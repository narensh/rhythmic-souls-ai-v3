import { Navigation } from "@/components/Layout/Navigation";
import { HeroSection } from "@/components/Hero/HeroSection";
import { ServicesGrid } from "@/components/Services/ServicesGrid";
import { DemoVideo } from "@/components/Demo/DemoVideo";

import { MusicTools } from "@/components/Music/MusicTools";
import { NewsSection } from "@/components/News/NewsSection";
import { TestimonialsSection } from "@/components/Testimonials/TestimonialsSection";
import { NewsletterSection } from "@/components/Newsletter/NewsletterSection";
import { Footer } from "@/components/Layout/Footer";
import { Sidebar } from "@/components/Layout/Sidebar";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Landing() {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navigation />
      <Sidebar />

      <div className={`pt-16 transition-all duration-300 ${isCollapsed ? "md:ml-16" : "md:ml-80"}`}>
        <main className="min-h-[calc(100vh-4rem)]">
          <HeroSection />
          <ServicesGrid />
          <DemoVideo />
          <MusicTools />
          <NewsSection />
          <TestimonialsSection />
          <NewsletterSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
