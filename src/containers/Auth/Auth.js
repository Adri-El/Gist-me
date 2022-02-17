import React, {Component} from 'react';

import {fb} from '../../service';
import classes from './Auth.module.css';
import SignupForm from '../../components/SignupForm/SignupForm';
import LoginForm from '../../components/LoginForm/LoginForm';
import Logo from '../../components/Logo/Logo';
import Button from '../../components/UI/Button/Button';


class Auth extends Component{
    backgroundTimer = null;
    backgroundArray = [classes.bg1, classes.bg2, classes.bg3, classes.bg4];
    backgroundCount = 0;


    state = {
        haveAccount: true,
        backgroundImage: this.backgroundArray[0],
        errorMessage: '',
        login: {
            email: '',
            password: ''
        },
        signup: {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: ''
        },

        validation: {
            firstName: false,
            lastName: false,
            username: false,
            email: false,
            password: false,
            total: false
        },
        btnDisabled: true
    }
    

    componentDidMount(){

        const viewport = window.matchMedia("(min-width: 48em)")

        if(viewport.matches){

            this.backgroundTimer = setInterval(()=>{
        
                if(this.backgroundCount < this.backgroundArray.length - 1){
                    
                    this.backgroundCount +=1
                    
                }
                else{ this.backgroundCount = 0 
                }
    
                this.setState( {backgroundImage: this.backgroundArray[this.backgroundCount]} )
               
            }, 10000)

        }
        else{
            this.setState( {backgroundImage: 'transparent'} )
        }
     
        
    }

    componentWillUnmount(){
        const viewport = window.matchMedia("(min-width: 48em)")

        if(viewport.matches){
            clearInterval(this.backgroundTimer)
        }
        

    }


    switchFormHandler = ()=>{
        this.setState((prevState)=>{
           return {
            haveAccount: !prevState.haveAccount
           } 
        })
    }
    validationHandler = ()=>{

        let validationFields = {...this.state.validation}

        if(this.state.signup.firstName){
            validationFields.firstName = true 
        }
        else{
            validationFields.firstName = false
        }
        

        if(this.state.signup.lastName){
            validationFields.lastName = true 
        }
        else{
            validationFields.lastName = false
        }

        if(this.state.signup.username){

            const usernameRegex = /^[\w-]{3,}$/g
            const username = this.state.signup.username

            if(usernameRegex.test(username)){
                validationFields.username = true
            }
            else{
                validationFields.username = false
            }
             
        }
        

        if(this.state.signup.email){

            const emailRegex = /[\w.\-%$*]+@[\w]+\.[a-z]+$/g
            const email = this.state.signup.email

            if(emailRegex.test(email)){
                validationFields.email = true
            }
            else{
                validationFields.email = false
            }
        }

        if(this.state.signup.password){
            const passwordRegex = /^[^\s]{6,20}$/g
            const password = this.state.signup.password

            if(passwordRegex.test(password)){
                validationFields.password = true
            }
            else{
                validationFields.password = false
            }

        }

        if(Object.values(validationFields)
        .slice(0, -1)
        .every((value)=> value === true)){

            validationFields.total = true
            this.setState(
                {validation: validationFields,
                    btnDisabled: false
                }
            )
            return
        }
        else{
            validationFields.total = false
            this.setState(
                {validation: validationFields,
                    btnDisabled: true
                }
            )
            return
            
        }

    } 

    changeSignupHandler = (event, data)=>{
        let signup = {...this.state.signup}
        
        this.setState( 
            {signup: {...signup, [data]:event.target.value}},
            ()=> this.validationHandler()
        )
               
    }

    changeLoginHandler = (event, data)=>{
        let login = {...this.state.login}

        this.setState(
            {login: {...login, [data]:event.target.value}}
        )
    }

    submitSignupHandler = (event, email, userName, password, first_name, last_name)=>{
        event.preventDefault()

        fb.auth.createUserWithEmailAndPassword(email, password)
            .then(res=>{

                

                if(res?.user?.uid){
                    console.log('works')
                    var myHeaders = new Headers()
                    myHeaders.append("PRIVATE-KEY", "28779216-955e-4974-b194-68cd29184cbc")
                    myHeaders.append('Content-Type', 'application/json')
                    var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: JSON.stringify({
                            first_name,
                            last_name,
                            username: userName,
                            secret: res.user.uid
                        }) ,
                        redirect: 'follow'
                    };

                    fetch("https://api.chatengine.io/users/", requestOptions)
                    .then(response => response.text())
                    .then(result => console.log(result))
                    .then(()=>{
                        
                        fb.firestore
                            .collection('chatUsers')
                            .doc(res.user.uid)
                            .set({firstName: first_name, lastName: last_name, userName, avatar: ''})
                    })
                    .catch(error => console.log('error', error));
                    
                }
                else{
                    this.setState({
                        errorMessage: 'We are having trouble signing you up please try again'
                    })
                }

                
            })
            .catch(error=>{



                
                if(error.code === 'auth/email-already-in-use'){
                    this.setState({
                        errorMessage: 'An account with this Email already exists'
                    })
                }
                else{
                    this.setState({
                        errorMessage: 'We are having trouble signing you up please try again'
                    })
                }
            })

        
    }

    submitLoginHandler = (event, email, password)=>{
        event.preventDefault()

        fb.auth.signInWithEmailAndPassword(email, password)
            .then(res=>{
               this.props.history.push('/chat-page')
            })
            .catch(error=>{
                if(error.code === 'auth/user-not-found'){
                    this.setState({errorMessage: 'There is no user record corresponding to this email adress'})
                }
                else if(error.code === 'auth/network-request-failed'){
                    this.setState({errorMessage: 'Network error, check internet connection'})
                }
                else if(error.code === 'auth/wrong-password'){
                    this.setState({errorMessage: 'Invalid credentials'})
                }
                else{
                    this.setState({errorMessage: 'Something went wrong'})
                }
            })

        

    }

    switchToLoginHandler = ()=>{
        this.setState({
            haveAccount: true,
        })
    }


    render(){
        

        let form = <LoginForm 
                        switchForm={this.switchFormHandler}
                        submit={this.submitLoginHandler}
                        change={this.changeLoginHandler}
                        emailValue={this.state.login.email}
                        passwordValue={this.state.login.password}
                        errorMessage={this.state.errorMessage}
                    />

        if(!this.state.haveAccount){
            form =  <SignupForm 
                        switchForm={this.switchFormHandler}
                        change={this.changeSignupHandler}
                        validationData={this.state.validation}
                        submit={this.submitSignupHandler}
                        firstNameValue={this.state.signup.firstName}
                        lastNameValue={this.state.signup.lastName}
                        usernameValue={this.state.signup.username}
                        emailValue={this.state.signup.email}
                        passwordValue={this.state.signup.password} 
                        >

                        <Button disabled={this.state.btnDisabled} btnType='Button_auth'>
                            Create an Account
                        </Button>
                    </SignupForm>
        }

        
        return (
            <div className={[classes.Auth, this.state.backgroundImage].join(' ')}>
                <Logo/>
               
                {form}
   
            </div>
        )
    }
}

export default Auth;


/* 
fetch(
                        '/api/createUser',
                        {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                first_name,
                                last_name,
                                userName,
                                userId: res.user.uid
                            }) 
)                        }
*/