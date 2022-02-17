import React from 'react';

import ChatList from '../ChatList/ChatList';
import Spinner from '../UI/Spinner/Spinner'
import {useChat} from '../../context';
import {useResolved} from '../../hooks';
import SadEmoji from '../../images/sad-emoji.png';
import RailHeader from '../RailHeader/RailHeader';
import classes from './LeftRail.module.css';

const LeftRail = ()=>{
    const {myChats, createChatClick, switchToChat} = useChat()
    const chatsResolved = useResolved(myChats)


    return (
        <div className={switchToChat ? classes.leftRail_on_switch : classes.LeftRail}>
            <RailHeader/>
            { 
                chatsResolved ?
                (myChats.length === 0 ?
                <div className={ classes.no_gist_yet}>
                    <h2>No Gist yet</h2>
                        <img
                            src={SadEmoji}
                            alt='sad emoji'
                        />
                </div>:
                null):
                null

            }
            <button className={classes.create_gist_button} onClick={createChatClick}>
                Create Gist
            </button>
            {chatsResolved ? (
                <>
                    {!!myChats.length ? 
                        <div className={classes.chat_list_container}>
                            <ChatList/>
                        </div> :
                        null
                    }

                   
                </>
            ) 
              :
            (
                <div className={classes.chats_loading}>
                    <Spinner/>
                </div>
            )}
        </div>
    )

}

export default LeftRail;

