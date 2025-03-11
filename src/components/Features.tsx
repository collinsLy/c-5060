
import { Bot, TrendingUp, Shield, BarChart2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: "AI-Powered Trading Bots",
      description: "Leverage our advanced trading bots to automate your trading strategy and maximize returns."
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      title: "Real-Time Charts",
      description: "Access comprehensive, real-time market data and charts to make informed trading decisions."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "High Win Rates",
      description: "Our algorithms are designed to achieve industry-leading win rates across various market conditions."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Bank-Grade Security",
      description: "Your funds and personal information are protected with state-of-the-art security measures."
    }
  ];

  return (
    <div id="features" className="py-24 px-4 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-accent/5 backdrop-blur-3xl"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Advanced Trading Features</h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Experience the next level of cryptocurrency trading with our innovative platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/50 border-accent/10 hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-4 p-3 rounded-lg bg-accent/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl font-bold mb-4">Trade with Confidence</h3>
            <p className="text-white/60 mb-6">
              Our platform provides you with all the tools and information you need to make confident trading decisions. 
              From advanced charting to AI-powered insights, we've got you covered.
            </p>
            <ul className="space-y-3">
              {[
                "Multiple trading bots for different strategies",
                "Transparent win/loss tracking",
                "Instant deposits and withdrawals",
                "24/7 customer support"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 lg:order-2 glass-effect p-8 rounded-2xl">
            <div className="aspect-video bg-card rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full">
                  <iframe 
                    className="w-full h-full border-0"
                    src="https://www.tradingview.com/widgetembed/?frameElementId=tradingview_76d87&symbol=BINANCE:BTCUSDT&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=F1F3F6&studies=[]&hideideas=1&theme=dark&style=1&timezone=exchange&withdateranges=1&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=en&utm_source=&utm_medium=widget&utm_campaign=chart&utm_term=BINANCE:BTCUSDT"
                    allowTransparency={true}
                    allowFullScreen={true}
                  ></iframe>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
