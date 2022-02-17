import { useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import {Image, Modal} from 'semantic-ui-react';
import classes from './ImageUpload.module.css';

const ImageUpload = ({file, close, onSubmit, crop = false, header= 'send this image?'})=>{
    const [imageSrc, setImageSrc] = useState('')
    const cropRef = useRef()

    useEffect(()=>{
        const fr = new FileReader();
        fr.onload = ()=> setImageSrc(fr.result);
        fr.readAsDataURL(file)
    }, [file])

    return (
        <Modal open={true}>
            <Modal.Header>{header}</Modal.Header>
            <Modal.Content image>
                {
                    crop ?
                    (
                        <AvatarEditor
                            ref={cropRef}
                            width={200}
                            height={200}
                            border={50}
                            image={imageSrc}
                        />
                    ) :
                    (
                        <Image size='medium' src={imageSrc} alt='preview'/>
                    )
                }
            </Modal.Content>

            <Modal.Actions>
                <div className={classes.image_upload_actions}>
                    <button className={classes.cancel} onClick={close}>Cancel</button>
                    <button 
                        className={classes.submit}
                        onClick={
                            ()=>{
                                if(crop && cropRef){
                                    const canvas = cropRef.current
                                        .getImageScaledToCanvas()
                                        .toDataURL();
                                    fetch(canvas)
                                        .then(res=> res.blob())
                                        .then(blob=> onSubmit(blob))
                                }
                                else{
                                    onSubmit()
                                }
                            }
                        }>
                            Upload
                    </button>
                </div>
            </Modal.Actions>
        </Modal>
    )
}

export default ImageUpload;