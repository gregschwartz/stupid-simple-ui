import React, { useState, useEffect, FormEvent, useRef } from "react";
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
//   return <div className='formInput'>
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
  numViews: number;
}

export default function Contract() {
  const { wagmiClient, chains } = useWagmi()
  const { address, isConnected } = useAccount();
  const { theme, setTheme } = useWeb3ModalTheme();

  const { chainName, contractAddress } = useParams();
  
  const [isEditing, setEditing] = useState(false);
  const [isLoading, setIsloading] = useState(true);

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
      //set color in WalletConnect
      if(result[0].themeNameForWalletConnect?.length > 0) {
        const c = result[0].themeNameForWalletConnect;
        console.log("set walletConnect button to ", c);

        //🤢 have to use this lunatic method because of the way WalletConnect coded it to only allow specific color values!
        if(c == "blackWhite") {
          setTheme({themeColor: "blackWhite"});
        } else if(c == "blue") {
          setTheme({themeColor: "blue"});
        } else if(c == "green") {
          setTheme({themeColor: "green"});
        } else if(c == "magenta") {
          setTheme({themeColor: "magenta"});
        } else if(c == "orange") {
          setTheme({themeColor: "orange"});
        } else if(c == "purple") {
          setTheme({themeColor: "purple"});
        } else if(c == "teal") {
          setTheme({themeColor: "teal"});
        }
      }
    }

    if(!isEditing){
      loadContract();
    }    

  }, [chainName, contractAddress, record.name, getByFunc, isEditing]);

  

  //TODO: add support for an ID in the URL, and then use that one instead!
  //const record = result[0];
  //setRecord(result[0]);
  const abi = JSON.parse(record.contractAbi);
  //const contractName = record.name;
  //setContractName(record.name);

  //connect to contract
  let provider = ethers.getDefaultProvider(process.env.REACT_APP_ALCHEMY_URL, {"alchemy": process.env.REACT_APP_ALCHEMY_API_KEY});
  let contract = new ethers.Contract(contractAddress, abi.abi, provider);

  
  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();
    // console.log(`connectWallet address '${walletAddress}'`);
    return contract.connect(signer);
  };

  function showResult(form: HTMLFormElement, result: any) {
    let responseCells = form.getElementsByClassName("responseCell");
    if(responseCells.length > 0) {
      let cell = responseCells[0] as HTMLDivElement;
      var html;

      console.log(result);

      //check if it is a transaction in-progress hash instead of data
      if(Array.isArray(result)) {
        html = `
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
    }

  }

  return (
    isLoading? <CoolLoading/> :
    <div>
      <h1 onClick={() => setEditing(true)}>
        {/* {contractName} */}
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
      <div className='container'>
        <div className='formSection'>
          {abi.abi.map((functionOrObject) => {
            if (!functionOrObject.name || functionOrObject.type==="event") { return ""; }
      
            return (
              <form onSubmit={handleSubmit} className='solidityForm' name={functionOrObject.name} key={functionOrObject.name}>
                <h2 style={{"color":"Black"}}>{functionOrObject.name}</h2>

                {(functionOrObject.stateMutability === "payable" ? (
                  <div className='addressSection formRow'>
                    <div className='formLabel'>
                      <label htmlFor="contractAddres">Amount</label> 
                    </div>
                    {/* <Field name="Amount" type="uint256" internalType="uint256" /> */}
                    <input type="number" id="amount" name="amount" className='amount' required />   
                  </div>
                ) : "")}

                {functionOrObject.inputs.map((input) => {
                  return (
                    <div className='addressSection formRow' key={input.name}>
                      <div className='formLabel'>
                        <label htmlFor="contractAddres">{input.name}</label> 
                      </div>
                      <div className='formInput'>
                        <input type="text" id="contractAddres" name="contractAddres" className='contractAddress' required />   
                      </div>                                          
                    </div>
                  );
                })}

                <div className='formRow'>
                  <div className='formLabel'>
                    <></>
                  </div>
                  <div className='formInput'>
                    {isConnected && <button type="submit" className='submit'>Submit</button>}
                    {!isConnected && <Web3Button />}
                  </div>
                </div>
                
                {functionOrObject.outputs.map((output) => {
                  return ( 
                    <div className='formRow response' key={output.type}>
                      <div className='formLabel'>
                        <></>
                      </div>
                      <div className='formInput responseCell'>
                        {output.name ? output.name : "Returns"}: {output.type}
                      </div>
                    </div>
                  );
                })}

                {functionOrObject.outputs.length === 0 &&
                    <div className='formRow response'>
                      <div className='formLabel'>
                        <></>
                      </div>
                      <div className='formInput responseCell'>
                        Returns a value
                      </div>
                    </div>
                }
              </form>
            );
          })}
        </div>
      </div>
    </div>
  );
}
