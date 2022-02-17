import React from 'react';
import classes from './SignupForm.module.css';


const SignupForm = React.memo((props)=>{

    let validated = props.validationData


    return (
        
        <form className={classes.Signup_form} onSubmit={(event)=>props.submit(event, props.emailValue, props.usernameValue, props.passwordValue, props.firstNameValue, props.lastNameValue)}>
            <h1>Sign-Up </h1>
            <div className={classes.outerDiv}>
                <div className={classes.inputDiv}>
                    {validated.firstName ? <label>&nbsp;</label> : <label>this field should not be empty</label>}
                    <input  
                        type='text' 
                        placeholder='First Name' 
                        onChange={(event)=>props.change(event, 'firstName')}
                        value={props.firstNameValue}
                    />
                </div>
                
            
                <div className={classes.inputDiv}>
                {validated.lastName ? <label>&nbsp;</label> : <label>this field should not be empty</label>}
                    <input  
                        type='text' 
                        placeholder='Last Name'
                        onChange={(event)=>props.change(event, 'lastName')}
                        value={props.lastNameValue}
                        
                    />
                </div>
                
            </div>
            
            <div className={classes.outerDiv}>
                <div className={classes.inputDiv}>
                {validated.username ? <label>&nbsp;</label> : <label>username should be at least 3 characters</label>}
                    <input  
                        type='text' 
                        placeholder='Username'
                        onChange={(event)=>props.change(event, 'username')}
                        value={props.usernameValue}
                    />  
                </div>
                
                <div className={classes.inputDiv}>
                {validated.email ? <label>&nbsp;</label> : <label>input a valid email</label>}
                <input 
                    type='email' 
                    placeholder='Email'
                    onChange={(event)=>props.change(event, 'email')}
                    value={props.emailValue}
                />
                </div>
                
            </div>

            <div className={classes.inputDiv}>
                {validated.password 
                    ? <label>&nbsp;</label> 
                    : <label>password should be at least six characters</label>}
                <input 
                    type='password' 
                    placeholder='Password'
                    onChange={(event)=>props.change(event, 'password')}
                    value={props.passwordValue}
                />
            </div>
            {props.children}

            <p>Already have an account? <span className={classes.loginLink} 
            onClick={props.switchForm}>
                Login here!</span></p>
        </form>
            
    )
})

export default SignupForm