import './App.css';
import logo from './logo.png';

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
      <header>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Stupid Simple UI</h1>
        <nav>
          <i>Example UIs: </i>
          <a href="/contracts/Goerli/0xDB0d5dB07d42D5589230e40c3A51Ac8454D312d3">GuestBook</a>
          {" | "}
          <a href="/contracts/goerli/0xcaFAa9C9662f2a7EaeceD891C039317035286540">Escrow</a>
          {" | "}
          <a href="/contracts/goerli/0xa4e4745a1066ac0faebe4e005793b172c69cc9c4">Greg Token</a>
        </nav>
        <Web3Button />
        <Web3Modal
          projectId="6469fc0f92c76b3fb593c78ff3fd92c7"
          ethereumClient={ethereumClient}
          themeColor='purple'
          />
            {/* themeMode?: 'dark' | 'light';
            themeColor?: 'blackWhite' | 'blue' | 'default' | 'green' | 'magenta' | 'orange' | 'purple' | 'teal';
            themeBackground?: 'gradient' | 'themeColor';
            themeZIndex?: number; */}
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
