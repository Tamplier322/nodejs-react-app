import React from "react";
import './App.css';
import { Link } from "react-router-dom";

const Nav = () => {
    return (
        <div >
            <ul className="nav-js">
                <li><Link to="/home">MainPage</Link></li>
                <li><Link to="/about">About page</Link></li>
            </ul>
        </div >
    )
}

export default Nav;