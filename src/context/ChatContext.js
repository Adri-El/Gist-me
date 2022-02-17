import React, {createContext, useState, useEffect, useContext} from 'react';
import {deleteChat, getMessages, leaveChat, newChat} from 'react-chat-engine';

import {fb} from '../service';

export const ChatContext = createContext()

export const ChatProvider = ({children, authUser})=>{
    const [myChats, setMyChats] = useState();
    const [chatConfig, setChatConfig] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [switchToChat, setSwitchToChat] = useState(false);
    const [roomTitle, setRoomTitle] = useState('')

    const createChatClick = () => {
        newChat(chatConfig, {title: ''})
    }


    const deleteChatClick = chat=>{
        const isAdmin = chat.admin.username === chatConfig.userName;

        if(isAdmin ){
            if(window.confirm('Are you sure you want to delete this chat?')){
                deleteChat(chatConfig, chat.id);

            }
            
        }
        else if(window.confirm('Are you sure you want to leave this chat?')){
            leaveChat(chatConfig, chat.id, chatConfig.userName)
        }
    }



    const selectChatClick = (chat, cb) =>{
        getMessages(chatConfig, chat.id, (newMessage, messages) =>{
            setSelectedChat({
                ...chat,
                messages,
                newMessage
            }, cb())
        })
    }

    useEffect(()=>{
        if(authUser){
            fb.firestore
                .collection('chatUsers')
                .doc(authUser.uid)
                .onSnapshot(snap=>{
                    setChatConfig({
                        userSecret: authUser.uid,
                        avatar: snap.data().avatar,
                        userName: snap.data().userName,
                        firstName: snap.data().firstName,
                        lastName: snap.data().lastName,
                        projectID: '1ff4d032-533c-44bd-abc8-6e38e8c9d578'
                    }) 
                })
        }
    }, [authUser])


    return (
        <ChatContext.Provider 
        value={{
            roomTitle,
            setRoomTitle,
            switchToChat,
            setSwitchToChat,
            myChats,
            setMyChats,
            chatConfig,
            selectedChat,
            setChatConfig,
            setSelectedChat,
            selectChatClick,
            deleteChatClick,
            createChatClick
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () =>{
    const {
            roomTitle,
            setRoomTitle,
            switchToChat,
            setSwitchToChat,
            myChats,
            setMyChats,
            chatConfig,
            selectedChat,
            setChatConfig,
            setSelectedChat,
            selectChatClick,
            deleteChatClick,
            createChatClick
    } = useContext(ChatContext)

    return {
        roomTitle,
        setRoomTitle,
        switchToChat,
        setSwitchToChat,
        myChats,
        setMyChats,
        chatConfig,
        selectedChat,
        setChatConfig,
        setSelectedChat,
        selectChatClick,
        deleteChatClick,
        createChatClick
    }
}