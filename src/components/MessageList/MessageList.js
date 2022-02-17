import React from 'react';

import { useChat } from '../../context';
import GistMateAvatar from '../GistMateAvatar/GistMateAvatar';
import { useScrollToBottom } from '../../hooks/useScrollToBottom';
import classes from './MessageList.module.css';
import { getGistMateName } from '../../helpers/getGistMateName';

const MessageList = ()=>{

    const {selectedChat, chatConfig} = useChat()

    useScrollToBottom(selectedChat, classes.chat_messages)

    return(
        <div className={classes.chat_messages}>
            {
                !!selectedChat.messages.length ?
                ( 
                    selectedChat.messages.map((msgs, index)=>{
                    
                        return(
                            <div key={index} className={
                                index < selectedChat.messages.length -1 ?
                                     (selectedChat.messages[index].sender.username === selectedChat.messages[index+1].sender.username ? classes.chat_message_same : classes.chat_message_diff):
                                  classes.chat_message_same
                            }>
                                <div className={chatConfig.userName === msgs.sender.username ? 
                                        classes.chat_message_header_sender : 
                                        classes.chat_message_header_receiver}>

                                    {
                                        chatConfig.userName !== msgs.sender.username ?
                                        <GistMateAvatar
                                        className={classes.message_avatar_receiver}
                                        username={msgs.sender.username}
                                        name={getGistMateName(chatConfig, selectedChat)}
                                        chat={selectedChat}
                                        /> :
                                        null
                                    }

                                    <div className={chatConfig.userName === msgs.sender.username ?
                                            classes.message_details_sender :
                                            classes.message_details_receiver}>

                                        <div className={classes.message_author}><strong>{msgs.sender.username}</strong></div>
                                        {
                                            !!msgs.attachments.length ?
                                            <div className={classes.message_image_container}>
                                                <img
                                                className={classes.message_image}
                                                src={msgs.attachments[0].file}
                                                alt={msgs.id + '-attachment'}
                                            />
                                            </div> :
                                            <div className={classes.message_text}>{msgs.text}</div>
                                        }
                                    </div>

                                    {
                                        chatConfig.userName === msgs.sender.username ?
                                        <GistMateAvatar
                                        className={classes.message_avatar_sender}
                                        username={msgs.sender.username}
                                        name={chatConfig.firstName}
                                        chat={selectedChat}
                                        /> :
                                        null
                                    }

                                
                                </div>
                            </div>

                            
                        )
                    })
                ) :
                (
                    <div className={classes.no_messages_yet}> No Messages Yet</div>
                )

            }

            
            
        </div>

    )
    

}

export default MessageList;