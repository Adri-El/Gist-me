import React, {useEffect} from 'react';
import {getChats, ChatEngine} from 'react-chat-engine';

import LeftRail from '../../components/LeftRail/LeftRail';
import PointLeft from '../../images/wink.png';
import { useChat } from '../../context';
import classes from './ChatPage.module.css';
import ChatToolbar from '../../components/ChatToolbar/ChatToolbar';
import ChatInput from '../../components/ChatInput/ChatInput';
import MessageList from '../../components/MessageList/MessageList';


const ChatPage =  () =>{

    const {
            switchToChat,
            myChats, 
            setMyChats,
            selectedChat, 
            selectChatClick, 
            chatConfig,
            setSelectedChat
        } = useChat()


    useEffect(()=>{

    }, [myChats])

    return (
        <>
            {!!chatConfig && (
                <div className={classes.chat_engine}>
                    <ChatEngine 
                        hideUI={true}
                        userName={chatConfig.userName}
                        projectID={chatConfig.projectID}
                        userSecret={chatConfig.userSecret}
                        onConnect={()=>{
                            getChats(chatConfig, setMyChats)
                        }}
                        onNewChat={chat=>{
                            if(chat.admin.username === chatConfig.userName){
                                selectChatClick(chat)
                            }
                            setMyChats([chat, ...myChats])
                        }}

                        onDeleteChat={chat=>{
                            if(selectedChat?.id === chat.id){
                                setSelectedChat(null)
                            }
                            setMyChats(
                                myChats.filter(c=> c.id !== chat.id)
                            )
                        }}

                        onNewMessage={(chatId, message) =>{
                
                            if(selectedChat && chatId === selectedChat.id){
                                setSelectedChat({
                                    ...selectedChat,
                                    newMessage: [selectedChat.newMessage, message],
                                    messages: [...selectedChat.messages, message],
                                    last_message: message
                                })
                            }
                            const chatThatMessageBelongsTo = myChats.find(c=>c.id===chatId)
                            const filteredChats = myChats.filter(c=> c.id !== chatId)
                            const updatedChat = {
                                ...chatThatMessageBelongsTo,
                                last_message: message
                            }
                            setMyChats(
                                [updatedChat, ...filteredChats]
                            )
                            
                        }}
                    /> 
                </div>
            )}

            <div className={classes.Chat_container}>

                <LeftRail/>

                <div className={switchToChat ? classes.current_chat_on_switch : classes.current_chat}>
                    {
                        selectedChat ? 
                        (
                            <div className={classes.chat}>
                                <ChatToolbar/>
                                <MessageList/>
                                <ChatInput/>
                               {window.matchMedia("(max-width: 47.9375em)").matches ? <div className={classes.padder}></div> : null} 
                            </div>
                        ) : 
                        <div className={classes.no_chat_selected}>
                            <img
                                src={PointLeft}
                                className={classes.point_left}
                                alt="point left"
                            />
                            Select A Gist
                        </div>
                    }
                </div>
            </div>
        </>
    )
    
}


export default React.memo(ChatPage);