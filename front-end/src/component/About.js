import {React ,useEffect} from "react";
import Goal from "./home/Goal";
import { Container } from "react-bootstrap";
import Header from "./navbar/Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const About = ()=>{
    const navigate = useNavigate()
    useEffect(()=>{
        const auth = localStorage.getItem("user")
    if(auth){
      navigate("/dashboard")
    }
    })

    return(
         
        <>
        <Header/>
        
        <div className="row align-items-center about-bio">
            <div className="col-lg-5 col-12">
                <h1>Contribution</h1>
                <p className="">This project, a Photo Sharing Website with Powerful Face Recognition, was developed by Azeem Khan and Abdul Kareem as part of our final year project.
                <br/><br/>Together, we collaborated on testing, debugging, and refining the system to ensure it meets user requirements and delivers an efficient photo-sharing platform enhanced with face recognition capabilities.

                </p>
            </div>
            <div className="col-lg-5 col-12 about-bio-img">
                <img src="/person/we.jpg"></img>
            </div>
        
        </div>

        <Goal/>

        <Footer/>
        </>
        
    )
}

export default About;