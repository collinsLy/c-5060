
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80"></div>
      <div className="absolute inset-0 bg-[url('public/lovable-uploads/d83975c0-724b-4683-bb86-0b8eb9a708f4.png')] bg-cover bg-center opacity-20"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/30 rounded-full filter blur-3xl opacity-20 animate-float animation-delay-1000"></div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white max-w-3xl mb-6">
          Next-Generation Cryptocurrency Trading Platform
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-10">
          Trade cryptocurrencies with advanced bots, real-time charts, and AI-driven insights. 
          Experience the future of digital asset trading with Vertex.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="px-8">
            <Link to="/dashboard">Start Trading</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="group">
            <a href="#features">
              Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">$2.5B+</p>
            <p className="text-white/60">Trading Volume</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">150K+</p>
            <p className="text-white/60">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">10+</p>
            <p className="text-white/60">Trading Pairs</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">99.9%</p>
            <p className="text-white/60">Uptime</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
