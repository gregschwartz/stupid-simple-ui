import * as React from "react";
import { useParams } from "react-router-dom";
import { FormEvent, useState } from 'react';
import { ethers } from "ethers";
import { useMutation, useQuery } from "../convex/_generated/react";

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

//prevent error: Property 'ethereum' does not exist on type Window 
declare global {
  interface Window{
    ethereum?:any
  }
}


export default function Contract() {
  const { chain, contractAddress } = useParams();
  const [address, setAddress] = useState();

  // const incrementNumViews = useMutation("contracts:incrementNumViews");
  const result = useQuery("contracts:getBy", chain, contractAddress);

  if(!result || result.length === 0) {
    return (
      <div>
        <h1>Error, contract not found</h1>
        <h3>
          Sorry, no one has made a UI for that contract. If you're the developer,{" "}
          <a href={`/?chain=${chain}&contractAddress=${contractAddress}`}>go create it!</a>
        </h3>
        <h6>
          Chain: {chain}<br />
          Address: {contractAddress}
        </h6>
      </div>
    );
  }

  //TODO: add support for an ID in the URL, and then use that one instead!
  const record = result[0];
  const abi = JSON.parse(record.contractAbi);
  const contractName = record.name;

  //connect to contract
  let provider = ethers.getDefaultProvider(process.env.REACT_APP_ALCHEMY_URL, {"alchemy": process.env.REACT_APP_ALCHEMY_API_KEY});
  let contract = new ethers.Contract(contractAddress, abi.abi, provider);
  // console.log("contract", contract);
  
  const connectWallet = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    console.log("Account:", await signer.getAddress());
    contract.connect(signer);
    console.log("connected with that account");
  };

  function showResult(form: HTMLFormElement, message: string) {
    let responseCells = form.getElementsByClassName("responseCell");
    if(responseCells.length > 0) {
      let cell = responseCells[0] as HTMLDivElement;
      cell.innerHTML = message;
    } else {
      alert("Cannot find where to show result, which is: " + message);
    }
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
      let result = await contract[`${form.name}`](...params);
      console.log("result", result);
      showResult(form, result);
    } catch(x) {
      console.log("caught", x);

      let reason = "";

      if(x.reason === "sending a transaction requires a signer") {
        reason = "Please click Connect Wallet at the top of the screen.";
      } else {
        reason = (x.reason !== undefined ? x.reason : (
          x.message !== undefined ? x.message : x
        ))
      }

      showResult(form, reason);
    }

  }

  //removed becaues it just counts up endlessly
  // incrementNumViews(record._id);

  return (
    <div>
      <h1>{contractName}</h1>
      <div className='container'>
        <div className='header'>
          {/* {record.numViews} views <br /> */}
          <button id="connectWallet" onClick={connectWallet}>Connect Wallet</button>
        </div>

        <div className='formSection'>
          {abi.abi.map((functionOrObject) => {
            if (!functionOrObject.name || functionOrObject.type==="event") { return ""; }
      
            return (
              <form onSubmit={handleSubmit} className='solidityForm' name={functionOrObject.name} key={functionOrObject.name}>
                <h2 style={{"color":"Black"}}>{functionOrObject.name}</h2>

                {(functionOrObject.stateMutability === "payable" ? (
                  <div className='addressSection formRow'>
                    <div className='formLabel'>
                      <label htmlFor="contractAddres">boldAmount</label> 
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
                    <button type="submit" className='submit'>Submit</button>
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
              </form>
            );
          })}
        </div>
      </div>
    </div>
  );
}
