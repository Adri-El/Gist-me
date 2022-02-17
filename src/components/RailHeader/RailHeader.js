import React, {useState, useRef} from 'react'
import {fb} from '../../service';
import {useChat} from '../../context';
import {useResolved} from '../../hooks';
import ImageUpload from '../ImageUpload/ImageUpload';
import {Icon, IconGroup, Image, Loader} from 'semantic-ui-react';
import classes from './RailHeader.module.css';


const RailHeader = ()=>{
    const {chatConfig} = useChat()
    const configResolved = useResolved(chatConfig)
    const inputRef = useRef(null)
    const [image, setImage] = useState()


    return (
        <>
            <input
                type='file'
                className={classes.file_input}
                ref={inputRef}
                accept='image/jpeg,image/png'
                onChange={e=>{
                    const file = e.target?.files?.[0]
                    if(file){
                        setImage(file)
                    }
                }}
            />

            {!!image && (
                <ImageUpload
                    crop
                    file={image}
                    header='Set Your Avatar'
                    close={()=>setImage(null)}
                    onSubmit={croppedImage =>{
                        const storageRef = fb.storage.ref()
                        const uploadRef = storageRef.child(`${chatConfig.userSecret}_avatar.jpg`)
                        uploadRef.put(croppedImage)
                            .then(()=>{
                                return uploadRef.getDownloadURL()
                            })
                            .then(url=>{
                                fb.firestore
                                    .collection('chatUsers')
                                    .doc(chatConfig.userSecret)
                                    .update({avatar: url})
                                    .then(()=> setImage(null))
                            })
                    }}
                />
            )}

            <div className={classes.left_rail_header}>
                

                {
                    configResolved && chatConfig ? 
                    (
                        <div className={classes.current_user_info}>
                            <IconGroup
                                onClick={()=>{
                                    const input = inputRef.current
                                    if(input){
                                        input.value = ''
                                        input.click()
                                    }
                                }}
                                className={classes.user_avatar}
                                size='large'
                            >
                                {
                                    chatConfig.avatar ?
                                    (<Image src={chatConfig.avatar} avatar/>) :
                                    <div className={classes.empty_avatar}>
                                        <h1>
                                            {chatConfig.firstName[0].toUpperCase()}
                                        </h1>
                                        
                                    </div>
                                }

                                <Icon
                                    corner
                                    name='camera'
                                    inverted
                                    circular
                                />

                            </IconGroup>
                            <div className={classes.user_details}>
                                <span className={classes.span1}><h2>{`${chatConfig.firstName.toUpperCase()} ${chatConfig.lastName.toUpperCase()}`}</h2></span> 
                                <span className={classes.span2}>{'@' + chatConfig.userName}</span>
                            </div>
                        </div>
                    ) :
                    (
                        <div className={classes.user_loading}>
                            <Loader active size='small'/>
                        </div>
                    ) 
                }
                <div className={classes.sign_out}>
                    <Icon
                        color='red'
                        size='large'
                        onClick={()=>fb.auth.signOut()}
                        name='sign out'
                    />
                </div>
                
            </div>
        </>
    )
}

export default RailHeader;