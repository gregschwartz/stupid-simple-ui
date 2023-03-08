'use client';
import React, { useState } from 'react';
import { FormEvent } from 'react'
import { useMutation } from '../convex/_generated/react';
import { Web3Button } from "@web3modal/react";
import { useAccount, useEnsName, useNetwork } from 'wagmi';
import CoolRedirect from '../components/coolRedirect/CoolRedirect';
import { useWagmi } from '../hooks/useWagmi';
import { titleCaseSentence } from '../helpers/titleCase';

import './New.css';

export default function Home() {

  const { wagmiClient, ethereumClient /*, chains */ } = useWagmi()
  console.log({ wagmiClient, ethereumClient })
  //wrap the db function
  const addFunction = useMutation("contracts:add");

  //wagmi for wallet interactions
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork()
  const { data: ensName } = useEnsName({ address });

  //statuses
  const [isWritingToDb, setIsWritingToDb] = useState(false);
  const [isRedirecting, setIRedirecting] = useState(false);
 
  const showError = async (text: String) => {
    alert(text);
  };

  function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
  }

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
    const contractName = (abiAsJson["contractName"]?.length > 0 ? titleCaseSentence(abiAsJson["contractName"]) : contractAddress);

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
      null,
      "default",
      0 //times it has been viewed
    );

    if(response !== undefined && response.id && response.tableName) {
      clearTimeout(failureTimer);

      //TODO: send to a sexy "building UI" screen instead
      setIRedirecting(true);
      await wait(10000);
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
    isRedirecting ? <CoolRedirect /> :
    <>
    <div className='descriptionHeader'>
      <div className='logo'>
        <img src="/logo.png" alt="Stupid Simple UI logo" />
      </div>
      <div className='content'>
        <h2>Automagic UI & Hosting for Smart Contracts</h2>
        <p>
          Provide your smart contract.<br />
          We make and host a beautiful customizable UI that you can immediately share.<br />
          No need to learn React, or even CSS!<br />
          <strong style={{"color": "rgb(203,77,140)"}}>Free until June 30, thanks to EthDenver!</strong>
        </p>
      </div>
    </div>
    <div className='descriptionBullets'>
      <div className='num1'>
        1. Input Contract Details
      </div>
      <div className='num2'>
        2. Connect Wallet
      </div>
      <div className='num3'>
        3. Share your new UI!
      </div>
    </div>
    <div className='newFormWrapper prettyBackground'>
      <h2>Host My Contract</h2>
      {/* <p className='description'>
        There are very skilled devs that make smart contracts and hate making the UI, often things launch and people have to use etherscan.io to interact with them (either initially or forever). This allows devs to just focus on the contract for their dapp.
      </p> */}
      <form onSubmit={handleSubmit} className='solidityForm'>
        <div className='addressSection row'>
          <div className='label'>
            <label htmlFor="contractAddress">Contract Address</label> 
          </div>
          <div className='input'>
            <input type="text" id="contractAddress" name="contractAddress" className='contractAddress' required minLength={5} size={52} placeholder='0xa4e4745a1066ac0faebe4e005793b172c69cc9c4' />
            <span className='chainName'>
              {chain ? `${chain.name}` : ""}
            </span>
          </div>
        </div>
        <div className='codeSection row'>
          <div className='label'>
            <label htmlFor="contractCode">Contract Code</label>
          </div>
          <div className='input'>
            <textarea name="contractCode" id="contractCode" className='contractCode' rows={20} required placeholder={placeholderContractCode} spellCheck='false' autoCapitalize='false' autoCorrect='false' />
          </div>
        </div>
        <div className='codeSection row'>
          <div className='label'>
            <label htmlFor="contractAbi">Contract ABI</label>
          </div>
          <div className='input'>
            <textarea name="contractAbi" id="contractAbi" className='contractAbi' rows={20} required placeholder={placeholderAbi} spellCheck='false' autoCapitalize='false' autoCorrect='false' />
          </div>
        </div>
        <div className='submitSection row'>
          <div className='label'>
            <></>
          </div>
          <div className='input'>
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
    </>
  )
}