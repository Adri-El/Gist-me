import {useEffect} from 'react';

export const useScrollToBottom = (trigger, className)=>{
    useEffect(()=>{
        if(!!trigger){
            
            document.getElementsByClassName(className)[0].scrollTop = document.getElementsByClassName(className)[0].scrollHeight
                
        }
    }, [trigger, className])
}