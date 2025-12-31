import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturedNotes from "../components/FeaturedNotes";
import HowItWorks from "../components/HowItWorks";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>StudyShare - Crowd-Sourced Notes Platform for Students</title>
        <meta 
          name="description" 
          content="Share and discover high-quality study notes. Join thousands of students collaborating on academic success. Upload PDFs, rate content, and learn together." 
        />
        <meta name="keywords" content="study notes, student resources, collaborative learning, PDF notes, academic sharing" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <FeaturedNotes />
          <HowItWorks />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;