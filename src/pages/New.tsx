'use client';
import React from 'react';
import { FormEvent, useRef } from 'react'
import { ethers } from "ethers";
import { useQuery, useMutation } from '../convex/_generated/react';

export default function Home() {
  //wrap the db function
  const addFunction = useMutation("contracts:add");

  const handleSubmit = async (event: FormEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const abi = form.contractAbi.value as string;
    const contractAddress = form.contractAddress.value as string;

    console.log("ready to handle it", abi, contractAddress);
    if(!abi || !contractAddress){

      //show error
      alert("Please provide address and ABI");

      return;
    }
    console.log("passed the check", abi, contractAddress);

    const response = await addFunction(
      "my new contract", //TODO: add
      "chain name here", //TODO: add
      "this user's address should go here", //TODO: add
      abi,
      contractAddress,
      "contract code here coming soon", //TODO: add
      0
    );
    console.log("db insert response", response);
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