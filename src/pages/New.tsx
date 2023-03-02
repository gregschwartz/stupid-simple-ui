'use client';
import React from 'react';
import { FormEvent } from 'react'
import { ethers } from "ethers";
import { useMutation } from '../convex/_generated/react';

export default function Home() {
  //wrap the db function
  const addFunction = useMutation("contracts:add");

  const showError = async (text: String) => {
    alert(text);
  };

  const handleSubmit = async (event: FormEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    //from connected wallet
    const ownerAddress = "0x0";
    const blockchainName = "goerli";

    //from form
    const form = event.target as HTMLFormElement;
    const abiAsString = form.contractAbi.value as string;
    const contractAddress = form.contractAddress.value as string;
    const contractCode = "contract code here coming soon";

    if(!abiAsString || !contractAddress){
      //show error
      showError("Please provide address and ABI");
      return;
    }

    let abiAsJson = {};
    try {
      abiAsJson = JSON.parse(abiAsString);
    } catch (exception) {
      console.log("Exception converting ABI to JSON", exception);
      //below check will catch that the ABI is empty, so just drop through
    }

    if(abiAsJson["abi"] === undefined || abiAsJson["abi"]?.length === 0) {
      showError("ABI is not valid, please make sure you're copy and pasting it correctly. Particularly make sure it includes the subsection `abi` array.");
      return;
    }

    //parse the name from the ABI
    const contractName = (abiAsJson["contractName"]?.length > 0 ? abiAsJson["contractName"] : contractAddress);

    //remove the big chunks of data from the JSON, so it doesn't hit Convex's storage limit
    abiAsJson["bytecode"] = "removed";
    abiAsJson["deployedBytecode"] = "removed";

    const response = await addFunction(
      contractName,
      blockchainName,
      ownerAddress,
      JSON.stringify(abiAsJson),
      contractAddress,
      contractCode,
      0 //times it has been viewed
    );

    if(response !== undefined && response.id && response.tableName) {
      //TODO: send to a sexy "building UI" screen instead
      window.location.pathname=`/contracts/${blockchainName}/${contractAddress}`;
    }
  }

  //ignore the weird indenting, it's so the placeholder looks right in browser
  const abiPlaceholder = `{
  "_format": "hh-sol-artifact-1",
  "contractName": "GregToken",
  "sourceName": "contracts/GregToken.sol",
  "abi": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      ...etc
    }
  ],
  "bytecode": "NOT NEEDED",
  "deployedBytecode": "NOT NEEDED",
  "linkReferences": {},
  "deployedLinkReferences": {}
}`;


  return (
    <div className='container'>
      <h1>Host My Contract</h1>

      <form onSubmit={handleSubmit} className='solidityForm'>
        <div className='addressSection formRow'>
          <div className='formLabel'>
            <label htmlFor="contractAddress">Contract Deployment Address</label> 
          </div>
          <div className='formInput'>
            <input type="text" id="contractAddressRef" name="contractAddress" className='contractAddress' required minLength={5} size={52} placeholder='0xa4e4745a1066ac0faebe4e005793b172c69cc9c4' />
          </div>
        </div>
        <div className='codeSection formRow'>
          <div className='formLabel'>
            <label htmlFor="contractAbi">Contract ABI:</label>   
          </div>
          <div className='formInput'>
            <textarea name="contractAbi" id="contractAbiRef" className='contractAbi' rows={30} required placeholder={abiPlaceholder} />
          </div>
        </div>
        <div className='submitSection formRow'>
          <div className='formLabel'>
            <></>
          </div>
          <div className='formInput'>
            <button type="submit" className='submit'>Host</button>
          </div>
        </div>
      </form>

    </div>
  )
}