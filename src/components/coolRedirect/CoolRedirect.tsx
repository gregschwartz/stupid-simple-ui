import React, { useState, useEffect, useRef } from "react";
import "./CoolRedirect.scss";

export default function CoolRedirect() {

  const divRef = useRef<HTMLDivElement>(null);
  let initialCheckState = [false, false, false, false];
  const [checks, setChecks] = useState(initialCheckState);
  const [counter, setCounter] = useState(0);

  useEffect(() => {

    console.log(divRef.current?.childNodes);
    let newState = checks;   

    const interval = setInterval(() => {
      // do something         
      newState[counter?counter:0] = true;
      setChecks(newState);
      setCounter(counter+1);
    }, 2200)      

    return () => {
        clearInterval(interval);
    }
  
 }, [checks, counter]);

  return (
    <div className='CoolRedirectContainer'>
    <div className='CoolRedirectContainer'>
      <div className="spinner-container">
        <div className="loading-spinner">
        </div>
      </div>
    </div>
    <style>
      footer .licenses {"{"}display: none;{"}"}
    </style>
    <div className='CoolRedirectContainer'>
      <div className="checkListContainer" ref={divRef}>
        <div className="checkListItem">
          <div className={`checkboxItem  ${checks[0] ? "visible" : "unvisible"}`}>✅</div>
          <div className="textItem">Fetching contract address through a series of tubes</div>
        </div>
        <div className="checkListItem">
          <div className={`checkboxItem ${checks[1] ? "visible" : "unvisible"}`}>✅</div>
          <div className="textItem">Making an offering to Vitalik </div>
        </div>
        <div className="checkListItem">
          <div className={`checkboxItem ${checks[2] ? "visible" : "unvisible"}`}>✅</div>
          <div className="textItem">Analyzing ABI for methods and data</div>
        </div>
        <div className="checkListItem">
          <div className={`checkboxItem ${checks[3] ? "visible" : "unvisible"}`}>✅</div>
          <div className="textItem">Generating your brand new UI</div>
        </div>
        {/* <div className="checkListItem">
          <div className={`checkboxItem ${checks[1] ? "visible" : "unvisible"}`}></div>
          <div className="textItem"></div>
        </div> */}
      </div>
    </div>
    </div>
  );
}