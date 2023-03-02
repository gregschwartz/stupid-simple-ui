'use client';
import React, { useState } from 'react';
import { FormEvent } from 'react'
import { useMutation } from '../convex/_generated/react';
import { Web3Button } from "@web3modal/react";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useConnect, useEnsName, useNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export default function Home() {
  //wrap the db function
  const addFunction = useMutation("contracts:add");

  //wagmi for wallet interactions
  const { address, isConnected } = useAccount();
  const { chain, chains } = useNetwork()
  const { data: ensName } = useEnsName({ address });
  const [isWritingToDb, setIsWritingToDb] = useState(false);
 
  const showError = async (text: String) => {
    alert(text);
  };

  const handleSubmit = async (event: FormEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();
    
    setIsWritingToDb(false);

    //from connected wallet
    const ownerAddress = address ?? ensName;
    const blockchainName = chain.name;

    if(!ownerAddress || !blockchainName){
      //show error
      showError("Please connect your wallet first.");
      return;
    }

    //from form
    const form = event.target as HTMLFormElement;
    const abiAsString = form.contractAbi.value as string;
    const contractAddress = form.contractAddress.value as string;
    const contractCode = form.contractCode.value as string;

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

    setIsWritingToDb(true);
    const failureTimer = setTimeout(() => {
      setIsWritingToDb(false);
      alert("😭 Couldn't write to the database. (Are you connected to the Internet?) Please try again, and let us know if it still doesn't work.");
    }, 10*1000);

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
      clearTimeout(failureTimer);

      //TODO: send to a sexy "building UI" screen instead
      window.location.pathname=`/contracts/${blockchainName}/${contractAddress}`;
      setIsWritingToDb(false);
    }
  }

  //ignore the weird indenting, it's so the placeholder looks right in browser
  const placeholderContractCode = `// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Escrow {
address public ...`;

  const placeholderAbi = `{
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
        <div className=' formRow'>
          <div className='formLabel'>
            <Web3Button /><br />
            {chain ? `Network: ${chain.name}` : ""}
          </div>
        </div>
        <div className='addressSection formRow'>
          <div className='formLabel'>
            <label htmlFor="contractAddress">Contract Deployment Address</label> 
          </div>
          <div className='formInput'>
            <input type="text" id="contractAddress" name="contractAddress" className='contractAddress' required minLength={5} size={52} placeholder='0xa4e4745a1066ac0faebe4e005793b172c69cc9c4' />
          </div>
        </div>
        <div className='codeSection formRow'>
          <div className='formLabel'>
            <label htmlFor="contractCode">Contract Code:</label>   
          </div>
          <div className='formInput'>
            <textarea name="contractCode" id="contractCode" className='contractCode' rows={20} required placeholder={placeholderContractCode} />
          </div>
        </div>
        <div className='codeSection formRow'>
          <div className='formLabel'>
            <label htmlFor="contractAbi">Contract ABI:</label>   
          </div>
          <div className='formInput'>
            <textarea name="contractAbi" id="contractAbi" className='contractAbi' rows={20} required placeholder={placeholderAbi} />
          </div>
        </div>
        <div className='submitSection formRow'>
          <div className='formLabel'>
            <></>
          </div>
          <div className='formInput'>
            {isConnected ? (
              <button id="submitButton" type="submit" className='submit' disabled={isWritingToDb}>Host My Contract</button>
              ) : (
              <Web3Button />
            )}
            {isWritingToDb && <i>Writing to database...</i>}
          </div>
        </div>
      </form>

    </div>
  )
}