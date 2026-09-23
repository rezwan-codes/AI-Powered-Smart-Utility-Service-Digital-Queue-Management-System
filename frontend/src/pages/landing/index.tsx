import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Stats from "./Stats";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
    </div>
  );
}
