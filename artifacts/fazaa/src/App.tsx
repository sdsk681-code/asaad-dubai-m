import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import Home from './pages/home';
import Cards from './pages/cards';
import Order from './pages/order';
import Header from './components/Header';
import Footer from './components/Footer';

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-[#f5f5f5]">
      <Header />
      <main className="flex-1 w-full pb-12">
        <Switch>
          <Route path="/" component={Home} />
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
