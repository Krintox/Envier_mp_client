import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {formatISO9075} from "date-fns";
import {UserContext} from "../UserContext";
import {Link} from 'react-router-dom';

export default function PostPage() {
  const [postInfo,setPostInfo] = useState(null);
  const {userInfo} = useContext(UserContext);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');  
  const [accept, setAccept] = useState(true);
  const [pending, setPending] = useState("");

  const acceptPost = () => {
    setAccept(false);
    setPending("true");
  }

  const pendingPost = () => {
    setPending("false");
  }

  useEffect(() => {
      navigator.geolocation.getCurrentPosition((position) => {
          console.log(position.coords)
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
      })
  }, [])
  const {id} = useParams();
  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`)
      .then(response => {
        response.json().then(postInfo => {
          setPostInfo(postInfo);
        });
      });
  }, []);

  if (!postInfo) return '';

  const iFrameLink = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=es;&output=embed`

  return (
    <div className="post-page">
      <h1 className="head1">{postInfo.title}</h1>
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">by @{postInfo.author.username}</div>
      {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Edit this post
          </Link>
        </div>
      )}
      <div className="image">
        <img src={`http://localhost:4000/${postInfo.cover}`} alt=""/>
      </div>
      <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}} />
        <h3>Epicenter:</h3>
        <div>
          <iframe className="iframeclass" src={iFrameLink} height="500px" width="100%"></iframe>
        </div>

      {/* <Link style={{textAlign:'center'}} className="edit-btn">
          {
            accept
            ?
            <button style={{background:'none'}} onClick={acceptPost}>
              Accept This Post
            </button>
            :
            <button style={{background:'none'}} onClick={pendingPost}>
              Completed
            </button>                        
          }
      </Link> */}

      <h1>
          {
            pending == ""
            ?
            ""
            :
              pending == "true"
              ?
              "🟥Pending"
              :
              "🟩 Completed"
          } 
      </h1>       

    </div>
  );
}