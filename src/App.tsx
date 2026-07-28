import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { AgentSkillsShowcase } from './components/AgentSkillsShowcase';
import { IncludedSection } from './components/IncludedSection';
import { Testimonials } from './components/Testimonials';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { VIPDashboard } from './components/VIPDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LivePurchaseToast } from './components/LivePurchaseToast';

const MainContent: React.FC = () => {
  const { currentPage } = useAuth();

  return (
    <div className="min-h-screen bg-[#08090B] text-gray-100 flex flex-col font-sans selection:bg-[#FF3366] selection:text-white relative">
      <Navbar />

      <main className="flex-grow">
        {currentPage === 'landing' ? (
          <>
            <Hero />
            <AgentSkillsShowcase />
            <Features />
            <IncludedSection />
            <Testimonials />
            <FAQSection />
          </>
        ) : currentPage === 'admin' ? (
          <AdminDashboard />
        ) : (
          <VIPDashboard />
        )}
      </main>

      <Footer />
      <AuthModal />
      <CheckoutModal />
      <LivePurchaseToast />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
