
interface TradingViewWidgetOptions {
  autosize?: boolean;
  symbol: string;
  interval?: string;
  timezone?: string;
  theme?: 'light' | 'dark';
  style?: string;
  locale?: string;
  toolbar_bg?: string;
  enable_publishing?: boolean;
  allow_symbol_change?: boolean;
  container_id?: string;
  hide_top_toolbar?: boolean;
  hide_legend?: boolean;
  save_image?: boolean;
  height?: number | string;
  withdateranges?: boolean;
  studies?: string[];
  width?: number | string;
  fullscreen?: boolean;
  show_popup_button?: boolean;
  overrides?: {
    [key: string]: string | number | boolean;
  };
}

interface TradingView {
  widget: new (options: TradingViewWidgetOptions) => any;
}

interface Window {
  TradingView: TradingView;
}
