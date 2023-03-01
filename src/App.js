import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Contract from "./pages/Contract";
import New from "./pages/New"

//replace
import logo from './logo.svg';

function App() {
  return (
    <div className="App">
      <header>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Stupid Simple UI</h1>
      </header>
      <div className='main'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<New />} />
            <Route path='contracts/:chain/:address' element={<Contract />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
