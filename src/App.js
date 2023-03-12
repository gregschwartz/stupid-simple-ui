import './App.scss';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import {Helmet} from "react-helmet";

//pages
import Contract from "./pages/Contract";
import New from "./pages/New";
import ThemeEditor from './pages/theme/ThemeEditor';
import Examples from './pages/Examples';
import Admin from './pages/Admin';

//WalletConnect and Wagmi
import { Web3Modal } from '@web3modal/react';
import { Web3Button } from "@web3modal/react";
import { useWagmi } from './hooks/useWagmi';
import { WagmiConfig } from 'wagmi';


function App() {
  const { wagmiClient, ethereumClient } = useWagmi()

  //connect to database
  const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL);
  
  return (
    <>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Stupid Simple UI: Automagic UI and Hosting for Smart Contracts</title>
      <meta name="description" content="Provide your smart contract. We make and host a beautiful customizable UI that you can immediately share. No need to learn React, or even CSS!" />
    </Helmet>
    
    <WagmiConfig client={wagmiClient}>
    <div className="App">
      <header className='appHeader'>
        <div id="colorSquare" className='d-none d-sm-flex' />
        <h1>
          <a href="/">Stupid Simple UI</a>
        </h1>
        <div className='examples'>
          {process.env.NODE_ENV==="development" 
          ? <a href="/admin">All Contracts</a>
          : <a href="/examples">Examples</a>
          }
        </div>
        <div className='walletButton'>
          <Web3Button />
        </div>
        <Web3Modal
        projectId="6469fc0f92c76b3fb593c78ff3fd92c7"
        ethereumClient={ethereumClient}
        themeColor="magenta"
        />
      </header>
      <div className='main'>
          <ConvexProvider client={convex}>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<New />} />
                <Route path='contracts/:contractId' element={<Contract />} />
                <Route path='c/:contractId' element={<Contract />} />
                <Route path='examples' element={<Examples />} />
                <Route path='admin' element={<Admin />} />
                <Route path='themes' element={<ThemeEditor />} />
                <Route path='themes/:themeId' element={<ThemeEditor />} />
                <Route path='themes/new' element={<ThemeEditor />} />
              </Routes>
            </BrowserRouter>
          </ConvexProvider>
      </div>
    </div>
  </WagmiConfig>
  <footer>
    <div className='licenses'>
      <a href="https://www.iconfinder.com/icons/4691461/ethereum_icon">Ethereum icon</a> by <a href='https://www.iconfinder.com/iconfinder'>Iconfinder</a> (with no changes) under <a href='https://creativecommons.org/licenses/by/3.0/'>Creative Commons (Attribution 3.0 Unported)</a> license
    </div>
  </footer>
  </>
  );
}

export default App;
