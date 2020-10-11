import React from "react";
import { useState } from 'react';
import M from 'materialize-css'
import {Link, useHistory} from "react-router-dom";
 

const Signup=()=> {
    const history = useHistory();

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        loading: false,
        message: '',
        showForm: true
    });
    const { name, email, password, url} = values;
    
    const handleSubmit = e => {
        e.preventDefault();
        console.table({ name, email });

        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
           if(data.error){
              M.toast({html: data.error,classes:"#c62828 red darken-3"})
           }
           else{
               M.toast({html:data.message,classes:"#43a047 green darken-1"})
               history.push('/signin')
           }
        }).catch(err=>{
            console.log(err)
        })
    }

    

    const handleChange = name => e => {
        setValues({ ...values, error: false, [name]: e.target.value });
    };



    return (
        <div className="mycard">
           
        <div className="card auth-card input-field">
        <form onSubmit={handleSubmit}
        className = "home-card">
            <h2>Instagram</h2>
                <div className = "mycard">
                <input
                    value={name}
                    onChange={handleChange('name')}
                    type="text"
                    className="form-control"
                    placeholder="Type your name"
                />
            </div>

            <div className="form-group">
                <input
                    value={email}
                    onChange={handleChange('email')}
                    type="email"
                    className="form-control"
                    placeholder="Type your email"
                />
            </div>

            <div className="form-group">
                <input
                    value={password}
                    onChange={handleChange('password')}
                    type="password"
                    className="form-control"
                    placeholder="Type your password"
                />
            </div>

            <div>
                <button className="btn #64b5f6 blue darken-1">Signup</button>
                <h5>
                <Link to="/signin">Already have an account ?</Link>
            </h5>
            </div>
        </form>
        </div>
        </div>
    );
};

export default Signup;










    

   