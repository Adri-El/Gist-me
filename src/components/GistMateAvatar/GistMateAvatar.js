import { useEffect, useState } from "react"
import { Image } from "semantic-ui-react"
import { useChat } from "../../context"
import { fb } from "../../service"
import classes from './GistMateAvatar.module.css';


const GistMateAvatar = ({chat, username, name, className})=>{
    const {chatConfig} = useChat()
    const [avatar, setAvatar] = useState('')
    
    useEffect(()=>{
        fb.firestore
            .collection('chatUsers')
            .where('userName', '==', username)
            .get()
            .then(snap=>{
                const data = snap.docs[0]?.data()
                if(data?.avatar){
                    setAvatar(data.avatar)
                }
            })
    }, [chat, chatConfig, username])

    return avatar ? (
        <Image className={className || classes.gist_mate_avatar} src={avatar}/>
    ):
    (
        <div className={className || classes.empty_avatar}>
            <h1>
            {
                name[0].toUpperCase()
                
            }
            </h1>
        </div>
    )
}

export default GistMateAvatar;