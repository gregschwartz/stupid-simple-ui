import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";

//pages
import Contract from "./pages/Contract";
import New from "./pages/New";
import ThemeEditor from './pages/theme/ThemeEditor';

//replace
import logo from './logo.png';

function App() {
  //connect to database
  const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL);
  
  return (
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
      </header>
      <div className='main'>
        <ConvexProvider client={convex}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<New />} />
              <Route path='contracts/:chain/:contractAddress' element={<Contract />} />
              <Route path='/themes' element={<ThemeEditor />} />
            </Routes>
          </BrowserRouter>
        </ConvexProvider>
      </div>
    </div>
  );
}

export default App;
