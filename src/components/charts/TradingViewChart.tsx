
import { useEffect, useRef } from "react";

interface TradingViewChartProps {
  symbol: string;
  theme?: "light" | "dark";
  autosize?: boolean;
  height?: number;
  interval?: string;
}

const TradingViewChart = ({
  symbol,
  theme = "dark",
  autosize = true,
  height = 400,
  interval = "15"
}: TradingViewChartProps) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clean up any existing widget
    if (container.current) {
      container.current.innerHTML = '';
    }

    const containerId = `tradingview_${symbol.replace(/[/:]/g, "")}`;
    if (container.current) {
      container.current.id = containerId;
    }

    // Load TradingView widget script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined' && container.current) {
        new window.TradingView.widget({
          autosize,
          symbol,
          interval,
          timezone: "Etc/UTC",
          theme,
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerId,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          height: autosize ? "100%" : height,
          withdateranges: true,
          studies: ["RSI@tv-basicstudies"]
        });
      }
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, theme, autosize, height, interval]);

  return (
    <div 
      ref={container}
      className="w-full h-full"
    />
  );
};

export default TradingViewChart;
