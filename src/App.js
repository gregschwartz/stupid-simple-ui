import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";

//pages
import Contract from "./pages/Contract";
import New from "./pages/New"

//replace
import logo from './logo.svg';

function App() {
  //connect to database
  const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL);
  
  return (
    <div className="App">
      <header>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Stupid Simple UI</h1>
        <nav>
          <a href="/contracts/goerli/0x04f5FBcCfC5C5ca62C84Cc5Bb71bD99a6cA43874">Greg Token</a>
        </nav>
      </header>
      <div className='main'>
        <ConvexProvider client={convex}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<New />} />
              <Route path='contracts/:chain/:contractAddress' element={<Contract />} />
            </Routes>
          </BrowserRouter>
        </ConvexProvider>
      </div>
    </div>
  );
}

export default App;
