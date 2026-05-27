import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { wagmiConfig } from "@/lib/wagmi";
import "@/lib/wagmi";
import { LoadingScreen } from "@/components/loading-screen";

import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Network from "@/pages/network";
import Relayer from "@/pages/relayer";
import Token from "@/pages/token";
import Whitepaper from "@/pages/whitepaper";
import Governance from "@/pages/governance";
import About from "@/pages/about";
import SDK from "@/pages/sdk";
import Docs from "@/pages/docs";
import FAQ from "@/pages/faq";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchInterval: 30_000,
      retry: 2,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/network" component={Network} />
      <Route path="/relayer" component={Relayer} />
      <Route path="/token" component={Token} />
      <Route path="/whitepaper" component={Whitepaper} />
      <Route path="/governance" component={Governance} />
      <Route path="/about" component={About} />
      <Route path="/sdk" component={SDK} />
      <Route path="/docs" component={Docs} />
      <Route path="/faq" component={FAQ} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [loaded, setLoaded] = useState(
    () => sessionStorage.getItem("zhad0_loaded") === "1"
  );

  function handleLoadDone() {
    sessionStorage.setItem("zhad0_loaded", "1");
    setLoaded(true);
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {!loaded && <LoadingScreen onDone={handleLoadDone} />}
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
