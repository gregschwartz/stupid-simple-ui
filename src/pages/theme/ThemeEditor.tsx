'use client';
import React, { useState } from 'react';
import { FormEvent } from 'react';
import './ThemeEditor.css';
import { useAccount, useEnsName, useNetwork } from 'wagmi';
import { useMutation } from '../../convex/_generated/react';
import { Web3Button } from "@web3modal/react";
import CoolLoading from '../../components/coolLoading/CoolLoading';

interface Theme {
    id?: String,
    name: String,
    backgroundColor: String,
    formBackgroundColor: String,
    textColor: String,
    buttonBackgroundColor: String,
    buttonTextColor: String
}

export default function ThemeEditor() {
    
    const addFunction = useMutation("themes:add");

    const showError = async (text: String) => {
        alert(text);
      };

    //wagmi for wallet interactions
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork()
    const { data: ensName } = useEnsName({ address });

    const [isWritingToDb, setIsWritingToDb] = useState(false);
    const [name, setName] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('');
    const [formBackgroundColor, setFormBackgroundColor] = useState('');
    const [textColor, setTextColor] = useState('');
    const [buttonBackgroundColor, setButtonBackgroundColor] = useState('');
    const [buttonTextColor, setButtonTextColor] = useState('');

    function wait(timeout) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
      }

    const handleSubmit = async (event: FormEvent) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault();

        setIsWritingToDb(false);

        const ownerAddress = address ?? ensName;
        const blockchainName = chain.name;

        if(!ownerAddress || !blockchainName){
            //show error
            showError("Please connect your wallet first.");
            return;
        }

        if (!name || !backgroundColor || !formBackgroundColor || !textColor || !buttonBackgroundColor || !buttonTextColor){
            showError("All the fields are required");
            return;
        }

        if(backgroundColor.indexOf("#") === -1 || formBackgroundColor.indexOf("#") === -1 || textColor.indexOf("#") === -1 
            || buttonBackgroundColor.indexOf("#") === -1 || buttonTextColor.indexOf("#") === -1 ){
            showError("Color fields need to be hexadecimal");
            return;
        }

        setIsWritingToDb(true);
        const failureTimer = setTimeout(() => {
        setIsWritingToDb(false);
        alert("😭 Couldn't write to the database. (Are you connected to the Internet?) Please try again, and let us know if it still doesn't work.");
        }, 10*1000);
        
        const response = await addFunction(
            name,
            backgroundColor,
            formBackgroundColor,
            textColor,
            buttonBackgroundColor,
            buttonTextColor
        );

        if(response !== undefined && response.id && response.tableName) {
            clearTimeout(failureTimer);
      
            //TODO: send to a sexy "building UI" screen instead
            await wait(10000);
            setIsWritingToDb(false);
            window.location.pathname=`/theme`;            
          }
    }

    return (
        isWritingToDb?  <CoolLoading /> :
        <div className='container'>            
            <form onSubmit={handleSubmit} className='themeEditorForm'>
                <div className='formTitle'>
                    <h1>Define your theme</h1>
                </div>
                <div className=' formRow'>
                    <div className='formLabel'>
                        <Web3Button /><br />
                        {chain ? `Network: ${chain.name}` : ""}
                    </div>
                    <div className='formInput'>
                        <></>
                    </div>
                </div>
                <div className='formRow'>
                    <div className='formLabel'>
                        <label htmlFor="name">Name</label> 
                    </div>
                    <div className='formInput'>
                        <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                </div>
                <div className='formRow'>
                    <div className='formLabel'>
                        <label htmlFor="backgroundColor">Background Color</label> 
                    </div>
                    <div className='formInput'>
                        <input type="text" id="backgroundColor" name="backgroundColor" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)}/>
                    </div>
                </div>
                <div className='formRow'>
                    <div className='formLabel'>
                        <label htmlFor="formBackgroundColor">Form Background Color</label> 
                    </div>
                    <div className='formInput'>
                        <input type="text" id="formBackgroundColor" name="formBackgroundColor" value={formBackgroundColor} onChange={(e) => setFormBackgroundColor(e.target.value)}/>
                    </div>
                </div>
                <div className='formRow'>
                    <div className='formLabel'>
                        <label htmlFor="textColor">Text Color</label> 
                    </div>
                    <div className='formInput'>
                        <input type="text" id="textColor" name="textColor" value={textColor} onChange={(e) => setTextColor(e.target.value)}/>
                    </div>
                </div>
                <div className='formRow'>
                    <div className='formLabel'>
                        <label htmlFor="buttonBackgroundColor">Button Background Color</label> 
                    </div>
                    <div className='formInput'>
                        <input type="text" id="buttonBackgroundColor" name="buttonBackgroundColor" value={buttonBackgroundColor} onChange={(e) => setButtonBackgroundColor(e.target.value)}/>
                    </div>
                </div>
                <div className='formRow'>
                    <div className='formLabel'>
                        <label htmlFor="">Button Text Color</label> 
                    </div>
                    <div className='formInput'>
                        <input type="text" id="buttonTextColor" name="buttonTextColor" value={buttonTextColor} onChange={(e) => setButtonTextColor(e.target.value)}/>
                    </div>
                </div>
                <div className='submitSection formRow'>
          <div className='formLabel'>
            <></>
          </div>
          <div className='formInput'>
            {isConnected ? (
              <button id="submitButton" type="submit" className='submit' disabled={isWritingToDb}>Save my theme</button>
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