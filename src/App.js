import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";

//pages
import Contract from "./pages/Contract";
import New from "./pages/New";
import ThemeEditor from './pages/theme/ThemeEditor';

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
    <WagmiConfig client={wagmiClient}>
    <div className="App">
      <header className='appHeader'>
        <div id="colorSquare" />
        <h1>
          <a href="/">Stupid Simple UI</a>
        </h1>
        <div className='examples'>
          Examples:{" "}
          <a href="https://www.stupidsimpleui.com/contracts/Chain%2084531/0x8b2948d486336e9ecAe12D570469D0C62CdcbaC1">Base: Guestbook</a>
          {" | "}
          <a href="/contracts/Goerli/0xDB0d5dB07d42D5589230e40c3A51Ac8454D312d3">Goerli: Guestbook</a>
          {" | "}
          <a href="/contracts/goerli/0xcaFAa9C9662f2a7EaeceD891C039317035286540">Escrow</a>
          {" | "}
          <a href="/contracts/goerli/0xa4e4745a1066ac0faebe4e005793b172c69cc9c4">ERC20 Token</a>
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
                <Route path='contracts/:chainName/:contractAddress' element={<Contract />} />
                <Route path='themes' element={<ThemeEditor />} />
                <Route path='themes/:themeId' element={<ThemeEditor />} />
                <Route path='themes/new' element={<ThemeEditor />} />
              </Routes>
            </BrowserRouter>
          </ConvexProvider>
      </div>
    </div>
  </WagmiConfig> 
  </>
  );
}

export default App;
