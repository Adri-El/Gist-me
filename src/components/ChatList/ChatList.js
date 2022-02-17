import React from 'react';
import {Icon} from 'semantic-ui-react'

import { useChat } from '../../context';
import { getGistMateName } from '../../helpers/getGistMateName';
import getGistMateUsername from '../../helpers/getGistMateUsername';
import GistMateAvatar from '../GistMateAvatar/GistMateAvatar';
import classes from './ChatList.module.css';


const ChatList = ()=>{

    const {
        setSwitchToChat,
        myChats,
        chatConfig,
        selectedChat,
        selectChatClick,
        deleteChatClick
    } = useChat()


    return (
        
        <div className={classes.ChatList}>
            
            {
                myChats.map((chat, index)=>{
                    
                   return(
                        <div 
                            key={index}
                            className={`${classes.chat_list_item} ${
                                selectedChat?.id === chat.id ? classes.selected_chat_item : '' }`
                            }>
                        
                                <div onClick={()=>{
                                    return selectChatClick(chat, ()=>{
                                        const viewport = window.matchMedia("(max-width: 47.9375em)")
                                
                                       if(viewport.matches){
                                           setSwitchToChat(true)
                                       }
                                    } )
                                     
                                }} className={classes.chat_list_item_content}>
                                    {
                                        chat.people.length === 1 ?
                                        (<>
                                            <Icon size='big' circular inverted color='violet' name='user cancel'/>
                                            <div className={classes.chat_list_preview}>
                                                <div className={classes.preview_username}>No One Added Yet</div>
                                            </div>
                                        </>) :
                                        chat.people.length === 2 ?
                                        (<>
                                            <>
                                                <GistMateAvatar
                                                    username={getGistMateUsername(chatConfig, chat)}
                                                    name={getGistMateName(chatConfig, chat)}
                                                    chat={chat}
                                                />
                                            </>

                                            <div className={classes.chat_list_preview}>
                                                <div className={classes.preview_username}><strong>{getGistMateName(chatConfig, chat)}</strong></div>
                                                <div className={classes.preview_message}>
                                                    {
                                                        chat.last_message.attachments.length ?
                                                        `${chat.last_message.sender.username} sent an attachment` :
                                                        chat.last_message.text.slice(0, 50) + '...'
                                                    }
                                                </div>
                                            </div>

                                        </>) :
                                        (<>
                                            <Icon size='big' circular inverted color='brown' name='users'/>
                                        
                                            <div className={classes.chat_list_preview}>
                                                <div className={classes.preview_username}><strong>{chat.title}</strong></div>

                                                <div className={classes.preview_message}>
                                                    {chat.last_message.attachments.length ?
                                                        `${chat.last_message.sender.username} sent an attachment` :
                                                        chat.last_message.text.slice(0, 50) + '...'
                                                    }
                                                </div>
                                            </div>
                                            
                                        
                                        </>)
                                    }

                                </div>

                                <div onClick={()=> deleteChatClick(chat)} className={classes.chat_item_delete}>
                                    <Icon name='delete'/>
                                </div>


                        </div>
                    )
                })
            }

        </div>
    )

}

export default ChatList;