import React from 'react';

import classes from './LoginForm.module.css';
import Button from '../UI/Button/Button';

const LoginForm = React.memo((props)=>{
    
    return (
        <form className={classes.Login_form} onSubmit={(event)=>props.submit(event, props.emailValue, props.passwordValue)}>
            <h1>Login</h1>
            <div>
                <label></label>
                <input 
                    onChange={(event)=>props.change(event, 'email')} 
                    type='email' 
                    placeholder='Email'
                    value={props.emailValue}
                />
            </div>
            
            <div>
                <label></label>
                <input 
                    onChange={(event)=>props.change(event, 'password')} 
                    type='password' 
                    placeholder='Password'
                    value={props.passwordValue}
                />
            </div> 
            

            <Button btnType='Button_auth'>Login</Button>

            <p className={classes.errorMessage}>{props.errorMessage}</p>

            <p>Don't have an account? <span className={classes.signupLink} 
            onClick={props.switchForm}>
                Signup here!</span>
            </p>
        </form>
            
    )
})

export default LoginForm;