import React,{useState} from 'react'
import { Button } from "@material-ui/core";
import {storage , db} from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function Imageupload({username}) {

    const [caption , setCaption] = useState("");
    const [image , setImage] = useState(null);
    const [progress , setProgress] = useState(0);

    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = (e) => {
        const uploadTask = storage.ref(`image/${image.name}`).put(image);

        uploadTask.on(
            "state change", (snapshot) => {
                //progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes)*100);
                    setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                //complete function
                storage.ref("image")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    //post image inside data base
                    db.collection("posts").add({
                        timestamp : firebase.firestore.FieldValue.serverTimestamp(),
                        caption : caption,
                        imageUrl : url,
                        username : username
                    });
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                })
            }
        );
    };

    return (
        <div className="imageupload"> 
            <progress className="imageupload_progress" value={progress} max="100" />
            <input type="text" placeholder="Enter a caption....." value={caption}  onChange={(event)=> setCaption(event.target.value)}/>
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload} >
                Upload
            </Button>
        </div>
    )
}

export default Imageupload;
