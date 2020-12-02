import React,{useState , useEffect} from "react"
import './App.css';
import Post from "./Post";
import {db, auth} from "./firebase";
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button , Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App() {

  const classes =useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  
  const [posts , setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn , setOpenSignIn] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

    useEffect(()=>{
      const unsubscribe = auth.onAuthStateChanged((authUser) =>{
        if (authUser) {
          //user is logged in
          console.log(authUser);
          setUser(authUser);

        } else {
          //user is logged out
          setUser(null);
        }
      })

      return() => {
        //perform some cleanup action
        unsubscribe(); 
      }

    },[user,username]);
  
    useEffect(() => {
      db.collection("posts").orderBy("timestamp","desc").onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id ,
          post: doc.data()
        })))
      });
    }, []);

    const singUp = (event) => {
      event.preventDefault();
      auth.createUserWithEmailAndPassword(email,password)
      .then((authUser)=>{
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error)=> alert(error.message));
      setOpen(false);
    }

    const signIn = (event) => {
      event.preventDefault();
      auth.signInWithEmailAndPassword(email,password)
      .catch((error)=>alert(error.message));
      setOpenSignIn(false);

    }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
          <center>
            <img className="app_headerImage"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnEYJW-xEz-zU-C81qxgdTHcTToXctChfjw&usqp=CAU" 
            alt="instagram text"
          />
          </center>
          
          <Input 
            placeholder="username"
            type="text"
            value={username}
            onChange={(e)=> setUsername(e.target.value)}
          />
          <Input 
            placeholder="email"
            type="text"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
          />
          <Input 
            placeholder="password"
            type="password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
          />
          <Button type="submit" onClick={singUp} >Sign Up</Button>
          </form>
          
        </div>
      </Modal>

      
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
          <center>
            <img className="app_headerImage"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnEYJW-xEz-zU-C81qxgdTHcTToXctChfjw&usqp=CAU" 
            alt="instagram text"
          />
          </center>
          <Input 
            placeholder="email"
            type="text"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
          />
          <Input 
            placeholder="password"
            type="password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
          />
          <Button type="submit" onClick={signIn} >Sign In</Button>
          </form>
          
        </div>
      </Modal>

     
     <div className="app_header">
        <img className="app_headerImage"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnEYJW-xEz-zU-C81qxgdTHcTToXctChfjw&usqp=CAU" 
          alt="instagram text"
        />
         {user? ( 
                 <Button onClick={() => auth.signOut()} >Logout</Button>
                ):(
                  <div className="app_loginContainer">
                    <Button onClick={() => setOpenSignIn(true)} >Sign In</Button>
                    <Button onClick={() => setOpen(true)} >Sign Up</Button>

                  </div>
      
                 )}
      </div>

      <div className="app_posts">
        {
           posts.map(({id,post}) => 
          (<Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />))
        }
      </div>

      <InstagramEmbed
            url="https://instagr.am/p/Zw9o4/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
     {user?.displayName ? (
        <ImageUpload  username={user.displayName}/>
        ):
      (
        <h3>sorry need to login to upload</h3>
      )}


    </div>
  );
}

export default App;
