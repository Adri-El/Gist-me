import React, {useState, useEffect, useRef} from 'react';
import {Search} from 'semantic-ui-react';
import {addPerson, getOtherPeople} from 'react-chat-engine';

import { useChat } from '../../context'; 
import {useDebounce} from '../../hooks';
import classes from './SearchGistMates.module.css';



const SearchGistMates = ({visible, closeFn})=>{
    let searchRef = useRef();
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(null)
    const debouncedSearchTerm = useDebounce(searchTerm, 500)
    
    

    useEffect(()=>{
        if(visible && searchRef){
            searchRef.focus()
        }
    }, [visible])

    const {
        myChats,
        setMyChats,
        chatConfig,
        selectedChat,
        setSelectedChat
    } = useChat()

    const selectUser = username =>{
        let allUsers;

        getOtherPeople(chatConfig, selectedChat.id, (chatId, data)=>{
           allUsers = data
        })
        
        addPerson(chatConfig, selectedChat.id, username, ()=>{

            const first_name = allUsers.find(u=>u.username === username).first_name
            const last_name = allUsers.find(u=>u.username === username).last_name
            
            const filteredChats = myChats.filter(chat=> chat.id !== selectedChat.id)
            const updatedChat = {
                ...selectedChat,
                people: [...selectedChat.people, {person: {username, first_name, last_name}}]
            }

            setSelectedChat(updatedChat)
            setMyChats([...filteredChats, updatedChat])
            closeFn();
        })
    }

    useEffect(()=>{
        if(debouncedSearchTerm){
            setLoading(true)
            
            
            getOtherPeople(chatConfig, selectedChat.id, (chatId, data)=>{
                
                const userNames = Object.keys(data)
                .map(key=>{ 
                    return data[key].username
                })
                .filter(u=>u.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))

                setSearchResults(userNames.map(u=>({title: u})))
                setLoading(false)
            })
        }
        else{setSearchResults(null)}
    }, [chatConfig, selectedChat, debouncedSearchTerm])

    return(
        <div className={classes.user_search} style={{display: visible ? 'block' : 'none'}}>
            <Search
                fluid
                onBlur={closeFn}
                loading={loading}
                value={searchTerm}
                results={searchResults}
                placeholder='Search gist-mate'
                input={{ref: r => (searchRef = r)}}
                open={!!searchResults && !loading}
                onSearchChange={e=>setSearchTerm(e.target.value)}
                onResultSelect={(e, data)=>{
                    if(data.result?.title){
                        selectUser(data.result.title)
                    }
                }}
            />
        </div>
    )
}

export default SearchGistMates;