import React from 'react'
import { Link } from "react-router-dom";
import "./Header.css";
import { useState } from 'react';
import {
    Home, 
    HomeOutlined,
    Add, AddOutlined,
    Search,
    SearchOutlined,
    AccountCircle,
    AccountCircleOutlined,
} from "@mui/icons-material";



const Header = () => {
    const [tab, setTab] = useState(window.location.pathname);
  return (
    <div className="header">
        <Link to="/" onClick = {() => setTab("/")}>
            { tab === "/" ? <Home style={{ color: "black" }} /> : <HomeOutlined /> }
        </Link>

        <Link to="/newpost" onClick = {() => setTab("/newpost")}>
            { tab === "/newpost" ? <Add style={{ color: "black" }} /> : <AddOutlined /> }
        </Link>

        <Link to="/search" onClick = {() => setTab("/search")}>
            { tab === "/search" ? <Search style={{ color: "black" }} /> : <SearchOutlined /> }
        </Link>

        <Link to="/account" onClick = {() => setTab("/account")}>
            { tab === "/account" ? <AccountCircle style={{ color: "black" }} /> : <AccountCircleOutlined /> }
        </Link>
    </div>
  )
}

export default Header;
