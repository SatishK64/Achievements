import React,{useState,useEffect} from 'react'
import styles from './Student.module.css'
import Card from './Card'
import Upload from './Upload'
import { set } from 'mongoose'
const Student = ({ details,back, link, mode }) => {
  const [cards,setCards] = useState([]);
  const [showUpload,setShowUpload] = useState(false);
  const [toggle,setToggle] = useState(false);

  //Fetching all files and seting the cards to all the files
  useEffect(()=>{
    async function fetchData(){
      const response = await fetch(`/api/allfiles/${details.username}`);
      if(!response.ok){
        console.log("Error fetching data");
        return;
      }
      const data = await response.json();
      console.log(data.files);
      if(data.files.length===0){
        console.log("No files found");
        setCards([]);
        return;
      }
      setCards(data.files);

    }
    if(details.username!==''){
      fetchData();
    }
    
  },[details,showUpload,toggle]);


  function handleDelete(id) {
    setToggle((prev)=>{return !prev});
  }
  
  function download(id){
    console.log("Download "+cards[id].title)
  }

  function enable(){
    setShowUpload((prev)=>{return !prev});
  }

  return (
    <div className={styles.student}>
      {showUpload&& <Upload click={enable} link = {link} username={details.username}/>}
      <div className={styles.details}>
        <br />
        <h1 className={styles.big}>{details.username}</h1>
        {/* {mode && <h5>{mode}</h5>} to check if mode is edit */}
        <h5>
          {details.tags.map((tag, index) => (
            <span key={index}>
              {tag}
              {index < details.tags.length - 1 && <span className={styles.separator}> | </span>}
            </span>
          ))}
        </h5>
        {mode !== "edit"&&<button className="glassy-button" onClick={back}><span><i className="fas fa-arrow-left"></i></span></button>}
        {mode === "edit" && <button onClick={enable} className='circular-upload-button'>+</button>}
      </div>
      <div className={styles.parent}>
        {cards.length === 0 ? <p className={styles.errorMsg}>No Files Uploaded</p>: 
        cards.map((card, index) => (
          <Card 
          key={index} 
          id={index} 
          info={card}
          link = {link}
          username={details.username}
          onDelete={handleDelete} 
          child = {styles.child} 
          styling={styles.separator} 
          btn={styles.customButton} 
          mode={mode}
          onDownload={download}/>
        ))}
      </div>
    </div>
  )
}

export default Student;