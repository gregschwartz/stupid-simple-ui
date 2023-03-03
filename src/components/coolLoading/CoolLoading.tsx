import React, { useState, useEffect, useRef } from "react";
import "./coolloading.css";

export default function CoolLoading() {

  return (
    <div className='container'>
        <div className='container'>
        <div className="spinner-container">
            <div className="loading-spinner">
            </div>
        </div>
        </div>
    </div>
  );
}