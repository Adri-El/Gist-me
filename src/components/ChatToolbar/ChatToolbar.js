import React, {useState} from 'react';
import {editChat} from 'react-chat-engine'
import {useChat} from '../../context';
import {Icon} from 'semantic-ui-react';
import classes  from './ChatToolbar.module.css';
import SearchGistMates from '../SearchGistMates/SearchGistMates';
import { getGistMateName } from '../../helpers/getGistMateName';
import { getRoomMatesNames } from '../../helpers/getRoomMatesNames';


const ChatToolbar = ()=>{
    const {selectedChat, setSelectedChat, chatConfig, setSwitchToChat, setMyChats, myChats} = useChat()
    const [inputValue, setInputValue] = useState('')
    const [searching, setSearching] = useState(false)
    const viewport = window.matchMedia("(max-width: 47.9375em)")

    const setGistRoomName = ()=>{
        const roomName = {title: inputValue}
        editChat(chatConfig, selectedChat.id, roomName, (data)=>{
            const updatedChat = {
                ...selectedChat,
                title: data.title
            }
            const filteredChats = myChats.filter(chat=> chat.id !== selectedChat.id)
            setSelectedChat(updatedChat)
            setMyChats([...filteredChats, updatedChat])   
        })

        setInputValue('')
    }

    return(
        <>
        <div>
            <div className={classes.chat_toolbar}>

                {
                    viewport.matches  ?  <div>
                        <Icon name='arrow left' size='large' color='grey'  onClick={()=>{
                            setSelectedChat()
                            return setSwitchToChat(false)
                        }}/>
                    </div>: null
                }
                <div className={classes.chat_header_text}>
                    {
                        selectedChat.people.length === 2 ?
                        <div>
                            <span><strong>{getGistMateName(chatConfig, selectedChat)}</strong></span>
            
                        </div>:
                        
                        <div>
                            {getRoomMatesNames(selectedChat.people, chatConfig).slice(0, 33)}
                            
                        </div>
    
                    }
                    
                    
                </div>

                

                <div className={classes.add_gist_mate_icon}>
                    <Icon
                        color='grey'
                        name= 'user plus'
                        size='large'
                        onClick={()=>setSearching(true)}
                    />

                </div>
            </div>

            {
                    selectedChat.people.length !== 2 && selectedChat.admin.username === chatConfig.userName ?
                    <div className={classes.room_name_input}>
                        <input type='text' placeholder='choose group name' value={inputValue} onChange={(event)=>setInputValue(event.target.value)}/>
                        <span><Icon name='arrow right' onClick={()=>setGistRoomName()} /></span>
                    </div>: null

                }
            </div>

            <SearchGistMates visible={searching} closeFn={()=>setSearching(false)}/>

        </>
    )
}

export default ChatToolbar;