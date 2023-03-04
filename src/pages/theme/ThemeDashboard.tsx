'use client';
import React, { useState, useEffect} from 'react';
import { FormEvent } from 'react';
import './ThemeEditor.css';
import { useAccount, useEnsName, useNetwork } from 'wagmi';
import { useMutation, useQuery } from '../../convex/_generated/react';
import { Web3Button } from "@web3modal/react";
import CoolLoading from '../../components/coolLoading/CoolLoading';
import Theme from './Theme';

export default function ThemeDashboard() {

    let theThemes: Theme[];
    const getAllFunction = useQuery("themes:getAll");

    const [themes, setThemes] = useState(theThemes);
    
    useEffect(() => {

        const loadThemes = async() => {
            console.log('Loading Themes');
            
        }
      
     }, []);

    return (
        <div className='container'>

        </div>
    )
}