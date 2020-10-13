import React, { useState } from "react";
import SearchResult from "./SearchResult"
import "../../App.css"
const Search  = ()=>{
    const [img, setImg] = useState('');

    const inputValue = (e)=>{
        const data = e.target.value
        setImg(data)
    }

    return(
        <>
        <div className = "topnav">
<input type = "text" placeholder = "search the pic you want" value={img} 
onChange={inputValue}/>
{img===""?"":<SearchResult name = {img}/>}
        </div>
        </>
    )
}
export default Search;