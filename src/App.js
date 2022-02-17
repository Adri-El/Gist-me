import React, {useEffect} from 'react';
import {Route, Switch, useHistory} from 'react-router-dom';

import { ChatProvider} from './context';
import Spinner from './components/UI/Spinner/Spinner';
import {useAuth, useResolved} from './hooks';
import Auth from './containers/Auth/Auth'
import ChatPage from './containers/ChatPage/ChatPage';



const App = ()=>{
  const history = useHistory()
  const {authUser} = useAuth();
  const authResolved = useResolved(authUser)

  useEffect(()=>{
    if(authResolved){
      history.push(!!authUser ? '/chat-page' : '/')
    }

  }, [authResolved, authUser, history]) 


  return (
    authResolved ? <ChatProvider authUser={authUser}>
      <div>
        <Switch>
          <Route path='/' exact component={Auth}/>
          <Route path='/chat-page' component={ChatPage}/>
        </Switch>
        
      </div>
    </ChatProvider> : <Spinner/>
  );

}

export default App;





/*class App extends Component{
  componentDidMount(){
   // const {boy} = useAuth()
   // console.log('AUTH USER:', boy )

  }
  componentDidUpdate(){
    //const {authUser} = useAuth()
    //console.log('AUTH USER:', authUser)

  }

  render(){
    
    return (
      <div className= {classes.App}>
        <Switch>
          <Route path='/' exact component={Auth}/>
          <Route path='/chat-page' component={ChatPage}/>
        </Switch>
          
      </div>
    );
  }
}

export default App;*/
