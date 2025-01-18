// 0. Clone gestures repo DONE
// 0. Install packages DONE
// 1. Create new gesture definition DONE
// 2. Import gesture into handpose DONE


///////// NEW STUFF ADDED USE STATE
import React, { useRef, useState, useEffect } from "react";
///////// NEW STUFF ADDED USE STATE

// import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "./App.css";
import { drawHand } from "./utilities";

import {loveYouGesture} from "./LoveYou"; 
import {gunGesture} from "./gun";

///////// NEW STUFF IMPORTS
import * as fp from "fingerpose";
import victory from "./victory.png";
// import thumbs_up from "./thumbs_up.png";
import gun from "./gun.png";
import shoot from "./shoot.png"; 

///////// NEW STUFF IMPORTS


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  ///////// NEW STUFF ADDED STATE HOOK
  const [emoji, setEmoji] = useState(null);
  const [isShooting, setIsShooting] = useState(false); // Track shooting state
  const images = {  
                    // thumbs_up: thumbs_up, 
                    victory: victory,
                    gun: gun
                  };
  ///////// NEW STUFF ADDED STATE HOOK

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const hand = await net.estimateHands(video);
      // console.log(hand);

      ///////// NEW STUFF ADDED GESTURE HANDLING

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          // fp.Gestures.ThumbsUpGesture,
          loveYouGesture,
          gunGesture
        ]);
        const gesture = await GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          console.log(gesture.gestures);

          const confidence = gesture.gestures.map(
            (prediction) => prediction.confidence
          );
          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          );
          // console.log(gesture.gestures[maxConfidence].name);
          setEmoji(gesture.gestures[maxConfidence].name);

          // Flash shooting image when gun gesture is detected
          if (gesture.gestures[maxConfidence].name === "gun") {
            setIsShooting(true);
          } else {
            setIsShooting(false);
          }

          console.log(emoji);
        }
      }

      ///////// NEW STUFF ADDED GESTURE HANDLING

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  useEffect(()=>{runHandpose()},[]);

  // Handle shooting image flash
  useEffect(() => {
    if (isShooting) {
      const interval = setInterval(() => {
        setIsShooting((prev) => !prev); // Toggle visibility
      }, 100); // Flash every second

      return () => clearInterval(interval); // Cleanup on unmount or change
    }
  }, [isShooting]);
  

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 8,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />

        {emoji !== null && (
          <img
            src={images[emoji]}
            alt="gesture emoji"
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 400,
              bottom: 500,
              right: 0,
              textAlign: "center",
              height: 100,
            }}
          />
        )}

        {/* Flash the shooting image when gun gesture is detected */}
        {isShooting && (
          <img
            src={shoot}
            alt="shooting emoji"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)", // Center the image
              height: 1000,
              width: 1000,
              zIndex: 10, // Ensure it's on top of webcam and canvas
              }}
          />
        )}
      </header>
    </div>
  );
}

export default App;
