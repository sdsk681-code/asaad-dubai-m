import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Redirect, Route, Switch, Router as WouterRouter, useSearch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import Home from './pages/home';
import Cards from './pages/cards';
import Order from './pages/order';
import Payment from './pages/payment';
import Header from './components/Header';
import Footer from './components/Footer';

const queryClient = new QueryClient();

/** /request?card=X — يحوّل إلى صفحة البطاقات مع الجهة الصحيحة */
const CARD_TO_BRAND: Record<string, string> = {
  fazaa: 'fazaa',
  esaad: 'esaad',
  'homat-al-watan': 'homat',
  'al-saada': 'alsaada',
  absher: 'absher',
};

function RequestRedirect() {
  const search = useSearch();
  const card = new URLSearchParams(search).get('card') || 'fazaa';
  const brand = CARD_TO_BRAND[card] || 'fazaa';
  return <Redirect to={`/cards?brand=${brand}`} replace />;
}

function Router() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-[#f5f5f5]">
      <Header />
      <main className="flex-1 w-full pb-12">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/request" component={RequestRedirect} />
          <Route path="/payment" component={Payment} />
          <Route path="/cards" component={Cards} />
          <Route path="/order" component={Order} />
          <Route path="/register" component={Order} />
          <Route>
            <div className="p-12 text-center text-xl">الصفحة غير موجودة 404</div>
          </Route>
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
