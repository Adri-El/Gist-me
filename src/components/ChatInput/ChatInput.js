import React, {useState, useRef} from 'react';
import { useChat } from '../../context';
import {Icon} from 'semantic-ui-react';
import {sendMessage} from 'react-chat-engine';
import ImageUpload from '../ImageUpload/ImageUpload';
import classes from './ChatInput.module.css';


const ChatInput = ()=>{
    const {chatConfig, selectedChat, setSelectedChat} = useChat();
    const [chatInputText, setChatInputText] = useState('')
    const [imageModalOpen, setImageModalOpen] = useState(false)
    const inputRef = useRef(null);
    const [image, setImage] = useState()

    const onFileAttach = file =>{
        setImage(file);
        setImageModalOpen(true)
    }

    const sendChatMessage = () =>{
        if(setSelectedChat && chatInputText){
            setChatInputText('')
            sendMessage(chatConfig, selectedChat.id, {
                text: chatInputText,
                files: []
            })
        }
    }

    return (
        <>
            <div className={classes.chat_controls}>
                <div 
                    onClick={
                        ()=>{
                            const input = inputRef.current
                            if(input){
                                input.value = ''
                                input.click()
                            }
                        }
                    }
                    className={classes.attachment_icon}>

                        <Icon size='large' name='attach' color='grey' />

                </div>

                <textarea 
                    value={chatInputText}
                    className={classes.chat_input}
                    placeholder='Send a message'
                    onKeyPress={e=>{
                        if(e.key === 'Enter'){
                            e.preventDefault()
                            setChatInputText(chatInputText + "\n");
                        }
                    }}
                
                    onChange={e=>setChatInputText(e.target.value)}
                ></textarea>

                <div onClick={sendChatMessage} className={classes.send_message_icon}>
                    <Icon size='large' name='send' color='grey'/>
                </div>
            </div>

            <input
                type='file'
                ref={inputRef}
                className={classes.file_input}
                accept='image/jpeg,image/png'
                onChange={e=>{
                    const file = e.target?.files?.[0];
                    if(file){
                        onFileAttach(file)
                    }
                }}
            />

            {
                imageModalOpen && !!image && (
                    <ImageUpload
                        file={image}
                        onSubmit={()=>{
                            sendMessage(chatConfig, selectedChat.id, {text: chatInputText, files: [image]}, ()=>{
                                setImage(null)
                                setChatInputText('')
                            })
                        }}
                        close={()=> setImageModalOpen(false)}
                    />
                )
            }
        </>
    )

}

export default ChatInput;