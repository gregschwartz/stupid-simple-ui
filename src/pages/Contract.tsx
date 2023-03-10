import React, { useState, useEffect, FormEvent, useRef } from "react";
import {Helmet} from "react-helmet";
import { useParams } from "react-router-dom";
import CoolLoading from '../components/coolLoading/CoolLoading';
import { ethers } from "ethers";
import { Id } from "../convex/_generated/dataModel"
import { useMutation, useQuery } from "../convex/_generated/react";
import { useAccount } from 'wagmi';
import { useWagmi } from "../hooks/useWagmi";
import { Web3Button, useWeb3Modal } from "@web3modal/react";
import Editable from "../components/coolEditable/CoolEditable";
import { useWeb3ModalTheme } from "@web3modal/react";
import { titleCaseSentence } from '../helpers/titleCase';
import { SecurityCheck } from "../helpers/securityCheck";

import { Col, Container, Row } from "react-bootstrap";
import './Contract.scss';

// function Field({ name: string, type: string, internalType: string }) {
//   let options = {};
//   let htmlType = "text";
//
//   if(type=="uint256") {htmlType = "number";}
//
//   if(type=="address") {
//     options["minlength"]=42
//     options["maxlength"]=42
//   }
//
//   return <div className='input'>
//     {/* {options.map((k) => {
//       return (k);
//     })} */}
//     <input
//       type={htmlType}
//       name={name ? name : type}
//       className={name ? name : type}
//       required
//       value="hi"
//     />
//   </div>; 
// }

interface Contract  {
  _id: Id<"contracts">;
  _creationTime: number;
  chainName: string;
  contractAddress: string;
  name: string;
  ownerAddress: string;
  contractAbi: any;
  contractCode: string;
  themeId: Id<"themes">;
  themeNameForWalletConnect: string;
  numViews: number;
}

export enum ExecutionStatus {
  START = "START",
  EXECUTING = "executing",
  AWAITING_CONFIRMATION = "executed, awaiting confirmation",
  CONFIRMED = "confirmed and done",
  ERROR = "error",
}

export default function Contract() {
  const { chains } = useWagmi()
  const { address, isConnected } = useAccount();
  const { setTheme } = useWeb3ModalTheme();
  const [styleTagForTheme, setStyleTagForTheme] = useState("");

  const { chainName, contractAddress } = useParams();
  
  const [isEditing, setEditing] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const [executionStatus, setExecutionStatus] = React.useState<ExecutionStatus>(ExecutionStatus.START);

  let oContract: Contract = {
    _id: new Id("contracts", ""),
    _creationTime: 0,
    chainName: "",
    contractAddress: "",
    name: "",
    ownerAddress: "",
    contractAbi: `{"_format":"hh-sol-artifact-1","contractName":"Foo","sourceName":"contracts/Foo.sol","abi":[{"inputs":[{"internalType":"bytes3[2]","name":"","type":"bytes3[2]"}],"name":"bar","outputs":[],"stateMutability":"pure","type":"function"}]}`,
    contractCode: "",
    themeId: new Id("themes", ""),
    themeNameForWalletConnect: "default",
    numViews: 0
  };

  const [record, setRecord] = useState(oContract);
  const inputRef = useRef();

  //automatically ask to switch to the relevant chain
  const { setDefaultChain } = useWeb3Modal();
  chains.forEach((c) => {
    if(c.network.toLowerCase() === chainName.toLowerCase()) {
      setDefaultChain(c);
    }
  });
  
  let getByFunc = useQuery("contracts:getBy", chainName, contractAddress);
 
  useEffect(() => {

    const loadContract = async() => {

      let result = await getByFunc;

      if(!result) {
        return (
          <div className="loadingWrapper">
          <span>Loading...</span>  
            <CoolLoading />
          </div>
        );
      };

      if(result.length === 0) {
        return (
          <div>
            <h1>Error, contract not found</h1>
            <h3>
              Sorry, no one has made a UI for that contract. If you're the developer,{" "}
              <a href={`/?chain=${chainName}&contractAddress=${contractAddress}`}>go create it!</a>
            </h3>
            <h6>
              Chain: {chainName}<br />
              Address: {contractAddress}
            </h6>
          </div>
        );
      }

      setRecord(result[0]);
      setIsloading(false);

      //set color in WalletConnect and other themes
      if(result[0].themeNameForWalletConnect?.length > 0) {
        setThemeColor(result[0].themeNameForWalletConnect);
      }
    }
    
    if(!isEditing){
      loadContract();
    }    
  }, [chainName, contractAddress, record.name, getByFunc, isEditing]);

  

  //TODO: add support for an ID in the URL, and then use that one instead!
  const abiFromDB = JSON.parse(record.contractAbi);
  let abi = (abiFromDB['abi'] !== undefined ? abiFromDB.abi : abiFromDB);

  //connect to contract
  let provider = ethers.getDefaultProvider(process.env.REACT_APP_ALCHEMY_URL, {"alchemy": process.env.REACT_APP_ALCHEMY_API_KEY});
  let contract = new ethers.Contract(contractAddress, abi, provider);

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    // const walletAddress = await signer.getAddress();
    // console.log(`connectWallet address '${walletAddress}'`);
    return contract.connect(signer);
  };

  function showResult(form: HTMLFormElement, result: any) {
    let responseCells = form.getElementsByClassName("responseCell");
    if(responseCells.length > 0) {
      let cell = responseCells[0] as HTMLDivElement;
      var html;

      //check if it is a transaction in-progress hash instead of data
      if(result == null) {
        setExecutionStatus(ExecutionStatus.ERROR);
        html = `😭 Error, the contract didn't accept your request! Try different parameters or again later.`;
      } else if(result.hash) {
        html = `<img src="/ethereum_icon48.png" height={24} width={24} class="loadingEthereum" /> Awaiting confirmation, up to 5 min wait (see wallet for info)`;
        console.log("awaiting confirm");

        result.wait().then(() => {
          setExecutionStatus(ExecutionStatus.CONFIRMED);
          html = `✅ Confirmed!`;
          cell.innerHTML = html;
        });
      } else if(Array.isArray(result)) {
        html = `Response:<br />
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>`;

          result.forEach((element,index) => {
            html += `<tr>
              <td>${index}</td>
              <td>${element}</td>
            </tr>`;
          });

          html += `</tbody>
        </table>`;

      } else {
        html = result;
      }
      
      cell.innerHTML = html;
    } else {
      alert("Cannot find where to show result, which is: " + result);
    }
  }

  function rotateTheme() {
    const themeList = ["default", "blue", "green", "magenta", "orange", "purple", "blackWhite", "teal"];   

    const index = Math.floor(Math.random() * themeList.length);
    setThemeColor(themeList[index]);
  }

  function setThemeColor(themeName) {
    let backgroundColor = "";
    let textColor = "white";

    //🤢 have to use this lunatic method because of the way WalletConnect coded it to only allow specific color values!
    if(themeName === "blackWhite") {
      setTheme({themeColor: "blackWhite"});
      backgroundColor = "white";
      textColor = "black";
    } else if(themeName === "blue") {
      setTheme({themeColor: "blue"});
      backgroundColor = "rgb(81,109,251)";
    } else if(themeName === "green") {
      setTheme({themeColor: "green"});
      backgroundColor = "rgb(38,217,98)";
    } else if(themeName === "magenta") {
      setTheme({themeColor: "magenta"});
      backgroundColor = "rgb(203,77,140)";
    } else if(themeName === "orange") {
      setTheme({themeColor: "orange"});
      backgroundColor = "rgb(255,166,76)";
    } else if(themeName === "purple") {
      setTheme({themeColor: "purple"});
      backgroundColor = "rgb(144,110,247)";
    } else if(themeName === "teal") {
      setTheme({themeColor: "teal"});
      backgroundColor = "rgb(54,226,226)";
    } else { //default
      setTheme({themeColor: "default"});
      backgroundColor = "rgb(71,161,255)";
    }

    setStyleTagForTheme(`
    header a { color: ${backgroundColor} !important; }
    header #colorSquare, button {
      background: ${backgroundColor} !important;
      color: ${textColor} !important;
    }
    input { border: 1px solid ${backgroundColor} !important; }
    `);

    document.body.onkeydown = (event) => {
      if(event.key === 'Alt'){
        rotateTheme();
      }
    }
  }

  const handleNameChange = (e) => {
    e.preventDefault();

    setRecord({
      ...record,
      name : e.target.value
    });
    console.log("changing name")
    console.log(record);
  }

  const handleSubmit = async (event: FormEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    setExecutionStatus(ExecutionStatus.EXECUTING);
    showResult(form, "Calling your wallet and the blockchain...");

    console.log("call contract's method: ", form.name);

    //future, this won't work with SELECTs nor radio buttons...
    let params:String[] = [];
    const inputs = form.getElementsByTagName("input");
    for(let i=0; i<inputs.length; i++) {
      params.push( inputs[i].value );
    }
    console.log("with these parameters", params);

    try {
      const connectedContract = await connectWallet();
      await connectedContract[`${form.name}`](...params)
        .then((result) => {
          // Returns signed transaction
          console.log("call finished", result);
          showResult(form, result);
        });
    } catch(x) {
      console.log("caught", x);

      let reason = "";

      if(x.reason === "sending a transaction requires a signer") {
        reason = "Please click Connect Wallet at the top of the screen.";
      } else if(x.reason === "execution reverted") {
        reason = "Reverted Without Reason: you either don't have access, or your parameters aren't valid.";
      } else {
        reason = (x.reason !== undefined ? x.reason : (
          x.message !== undefined ? x.message : x
        ))
      }

      showResult(form, reason);
      setExecutionStatus(ExecutionStatus.START);
    }
    setExecutionStatus(ExecutionStatus.AWAITING_CONFIRMATION);
  }

  return (
    isLoading? <CoolLoading/> :
    <Container className="contractPage">
      <Row>
        <Col xs={12}>
          <style>
            {styleTagForTheme}
          </style>
          <Helmet>
            <meta charSet="utf-8" />
            <title>{record.name}, powered by Stupid Simple UI -- Automagic UI and Hosting for Smart Contracts</title>
            <meta name="description" content={`${record.name} is powered by StupidSimpleUI.com Provide your smart contract. We make and host a beautiful customizable UI that you can immediately share. No need to learn React, or even CSS!`} />
          </Helmet>

          <SecurityCheck chainName={chainName} contractAddress={contractAddress} />

          <h1 onClick={() => setEditing(true)}>
            <Editable
              text={record.name}
              placeholder="My contract name"
              childRef={inputRef}
              type="input"
              onChange={handleNameChange}
            >
              <input
                ref={inputRef}
                type="text"
                name="contractName"
                placeholder="My contract name"
                value={record.name}
                onChange={handleNameChange}
              />
            </Editable>
          </h1>
        </Col>
      </Row>

      <Row>
        <Col xs={12} xl={{ span: 10, offset: 1 }} className="prettyBackground">
          {abi.map((functionOrObject) => {
            if (!functionOrObject.name || functionOrObject.type==="event") { return ""; }
      
            return (
              <form onSubmit={handleSubmit} name={functionOrObject.name} key={functionOrObject.name}>
                <h2>{functionOrObject.prettyName ?? titleCaseSentence(functionOrObject.name)}</h2>

                {(functionOrObject.stateMutability === "payable" ? (
                  <div className='addressSection row'>
                    <div className='label'>
                      <label htmlFor="contractAddres">Amount in Ether (not wei)</label> 
                    </div>
                    <div className='input'>
                      <input type="number" id="amount" name="amount" className='amount' placeholder="Amount of Eth" required />
                    </div>
                  </div>
                ) : "")}

                {functionOrObject.inputs.map((input) => {
                  let placeholder = input.type;
                  if(input.type === "address" || input.type === "address payable") {
                    placeholder = "0xabc123...";
                  } else if(input.type === "string") {
                    placeholder = "Letters";
                  }

                  let name = input.prettyName ?? titleCaseSentence(input.name) ?? "Id";

                  //remove the underscore, it's common practice to use in the context of setting a class variable
                  if(name[0] === "_") { name = name.substring(1); }
                  
                  return (
                    <div className='row' key={name}>
                      <div className='label'>
                        <label htmlFor={input.name}>{name}</label> 
                      </div>
                      <div className='input'>
                        <input type="text" name={input.name} placeholder={placeholder} required />
                      </div>   
                    </div>
                  );
                })}

                <div className='row submit'>
                  <div className='input'>
                    {isConnected && <button type="submit" className='submit' disabled={executionStatus===ExecutionStatus.EXECUTING}>
                      {executionStatus===ExecutionStatus.EXECUTING ? <img src="/ethereum_icon48.png" height={24} width={24} className="loadingEthereum" alt="Executing..." /> : "Run"}
                      </button>}
                    {!isConnected && <Web3Button />}
                  </div>
                </div>
                
                {functionOrObject.outputs.map((output) => {
                  return (
                    <div className='row response' key={output.type}>
                      <div className='label'>
                        <></>
                      </div>
                      <div className='input responseCell'>
                        {output.name ? output.name : "Returns"}: {output.type}
                      </div>
                    </div>
                  );
                })}

                {functionOrObject.outputs.length === 0 &&
                    <div className='row response'>
                      <div className='label'>
                        <></>
                      </div>
                      <div className='input responseCell'>
                        Returns information
                      </div>
                    </div>
                }
              </form>
            );
          })}

        </Col>
      </Row>
    </Container>
  );
}
