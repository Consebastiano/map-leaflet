import React from "react";
import Map from './Map';
import "./App.css";

export default function App() {
    const [number, setNumber] = React.useState(25);
    return (
            <div className="app-container">
                <div className="input-container">
                    <div className="input-label-group" onClick={() => setNumber(25)} >
                    <input type="radio" id="25points" checked={number === 25} readOnly/>
                    <label htmlFor="25points">25 points</label>
                    </div>
                    <div className="input-label-group" onClick={() => setNumber(250)}>
                    <input type="radio" id="250points" checked={number === 250} readOnly/>
                    <label htmlFor="250points">250 points</label>
                    </div>
                    <div className="input-label-group" onClick={() => setNumber(1000)}>
                    <input type="radio"id="1000points"  checked={number === 1000} readOnly/>
                    <label htmlFor="1000points">1000 points</label>
                    </div>
                </div>
                <Map numberSelected={number} />/
            </div>
    );
}
