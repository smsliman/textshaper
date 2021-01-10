import CanvasDraw from "react-canvas-draw";
import React, { useState, useEffect } from 'react';
import {Container, Row, Col, Button, ButtonGroup, ToggleButton} from 'react-bootstrap'

import styles from "./main.module.scss";

import arrow from "../../Assets/Icons/arrow.svg"
import flip1 from "../../Assets/Icons/flip1.svg"
import flip2 from "../../Assets/Icons/flip2.svg"
import copy from "../../Assets/Icons/copy.svg"

function Canvas() {

  const canvasSize = 600
  const [saveableCanvas, setSaveableCanvas] = useState()
  const [output, setOutput] = useState("")
  const [totalString, setTotalString] = useState("")
  const [invert, setInvert] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const [secondScreen, setSecondScreen] = useState(false)

  const saveImage = () => {
    var stringified = saveableCanvas.getSaveData()
    console.log(stringified)
    setTotalString(drawDots(stringified))
    setShowOutput(true)
  }

  const drawDots = (stringified, outputTest) => {

      outputTest = outputTest.replace(/([ ]{3,})|([\n])+/g, "")
      // var mainCanvas = document.getElementById('canvas');
      // var ctx = mainCanvas.getContext("2d")
      console.log(JSON.parse(stringified)["lines"][0]["points"])
      var max_x = 0
      var max_y = 0
      var min_x = canvasSize
      var min_y = canvasSize
      var count = 0

      JSON.parse(stringified)["lines"][0]["points"].forEach((item) =>{
        if (count == 0){
          var firstPoint = [item["x"], item["y"]]
        }
        if (count == JSON.parse(stringified)["lines"][0]["points"].length-1){
          var lastPoint = [item["x"], item["y"]]
        }
        var x = item["x"]
        var y = item["y"]
        if (y > max_y){
          max_y = y
        }
        if (y < min_y){
          min_y = y
        }
        // ctx.fillRect(x, y, 10, 10);
        count += 1
      })
      
      var outputBox = document.getElementById("outputBox")
      //var fontPointString = window.getComputedStyle(outputBox, null).getPropertyValue('font-size')
      //var fontPoint = parseInt(fontPointString.substring(0,2))
      var fontPoint  = 12;
      var numSlices = (max_y-min_y)/fontPoint
      var totalSlices = (canvasSize)/fontPoint
      var midpoint = 0
      var oldMidpoint = 0
      var startPoint = 0
      var tempTotalString = ""

      if (!invert){
        for (var i = 0; i < numSlices; i++) {
          min_x = canvasSize
          max_x = 0
          oldMidpoint = midpoint
          midpoint = min_y+((fontPoint/2) * ((2*i)+1))
          JSON.parse(stringified)["lines"][0]["points"].forEach((item) =>{
            var x = item["x"]
            var y = item["y"]

            if (y < midpoint && y > oldMidpoint && x>max_x){
                max_x = x
            }
            if (y < midpoint && y > oldMidpoint && x<min_x){
                min_x = x
            }
          })

          var characterWidth = getTextWidth("abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz1234567890", "test")/108
          var spaceWidth =     getTextWidth("                                                                                                            ", "test")/108
          var numChars = 2*(max_x-min_x)/characterWidth
          var numSpaces = (min_x)/spaceWidth

          var spaceString = ""
          for (var j = 0; j < numSpaces; j++){
            spaceString += " "
          }
          tempTotalString = tempTotalString + spaceString + outputTest.substring(startPoint, (startPoint + numChars)) + "\n"
          console.log(tempTotalString)
          console.log(outputTest.substring(startPoint, (startPoint + numChars)))
          startPoint += numChars
        }
        var extraSlices = min_y/fontPoint
        for (var j = 0; j < extraSlices; j++){
          tempTotalString = "\n" + tempTotalString
        }
    }
    else{
      for (var i = 0; i < totalSlices; i++) {
        min_x = canvasSize
        max_x = 0
        oldMidpoint = midpoint
        midpoint = ((fontPoint/2) * ((2*i)+1))
        JSON.parse(stringified)["lines"][0]["points"].forEach((item) =>{
          var x = item["x"]
          var y = item["y"]

          if (y < midpoint && y > oldMidpoint && x>max_x){
              max_x = x
          }
          if (y < midpoint && y > oldMidpoint && x<min_x){
              min_x = x
          }
        })

        if (min_x == canvasSize && max_x == 0){
          var characterWidth = getTextWidth("abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz1234567890                       ", "test")/130
          var numChars = 2*(canvasSize/characterWidth)
          tempTotalString = tempTotalString + outputTest.substring(startPoint, (startPoint + numChars)) + "\n"
          startPoint += numChars
        }
        else{

          var characterWidth = getTextWidth("abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz1234567890                       ", "test")/130
          var spaceWidth =     getTextWidth("                                                                                                            ", "test")/108
          var numSpaces = 2*(max_x-min_x)/spaceWidth
          var numChars1 = 2*(min_x)/characterWidth
          var numChars2 = 2*(canvasSize - max_x)/characterWidth
          console.log(max_x)
          console.log(numChars2)
          console.log(characterWidth)

          var spaceString = ""
          for (var j = 0; j < numSpaces; j++){
            spaceString += " "
          }
          tempTotalString = tempTotalString + outputTest.substring(startPoint, (startPoint + numChars1)) + spaceString
          startPoint += numChars1
          tempTotalString = tempTotalString + outputTest.substring(startPoint, (startPoint + numChars2)) + "\n"
          console.log(tempTotalString)
          startPoint += numChars2
      }
      }
    }
      return tempTotalString
  }

  function getTextWidth(text, font){

    //temp
    font = "12pt arial"

    var testCanvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = testCanvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
  }

  const handleInput = (e) => {
    setOutput(e.target.value)
    console.log(e.target.value)
    var stringified = saveableCanvas.getSaveData()
    console.log(stringified)
    setTotalString(drawDots(stringified, e.target.value))
    setShowOutput(true)
  }

  const handleInvert = (e) => {
    setInvert(!invert)
    var stringified = saveableCanvas.getSaveData()
    setTotalString(drawDots(stringified, output))
    setShowOutput(true)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(totalString).then(function() {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });

  }

  const handleSecondScreen = () => {
    setSecondScreen(true)
  }

  return (
    <Container fluid>
      <Row>
        <Col className={styles.colCenter1}>
          {!secondScreen &&
          <div className={styles.header}>
          Welcome to Textshaper.io!
          </div>
          }
          {secondScreen &&
          <div className={styles.header}>
          Now, paste your text in the box on the right
          </div>
          }
        </Col>
      </Row>
      <Row>
        <Col className={styles.colCenter1}>
          {!secondScreen &&
          <div className={styles.subHeader}>
          Draw your shape, slowly, below
        </div>
        }
        {secondScreen &&
          <div className={styles.subHeader}>
          And that's all!
        </div>
        }
        </Col>
      </Row>
      <Row className={styles.bigRow}>
      <Col lg={secondScreen ? 1 : 3}>
      </Col>
      <Col className={styles.colCenter}>
      < CanvasDraw className = {styles.mainCanvas} style={{border:"1px solid #000000"}} canvasWidth={canvasSize} canvasHeight={canvasSize} ref={canvasDraw => setSaveableCanvas(canvasDraw)}/>
      </Col>

      
        <Col className={styles.colCenter1} lg={secondScreen ? 5 : 1}>
        {!secondScreen &&
          <button className={styles.circleButton} onClick={() => handleSecondScreen()}><img src={arrow}></img></button>
        }
        {showOutput && secondScreen &&
          <div>
          <textarea className={styles.inputField} onChange = {(e) => handleInput(e)}  value={totalString}></textarea>
          <br />
          <button className={styles.invertButton} onClick = {() => handleCopy()}><img src={copy}></img>Copy to Clipboard</button>
          <button className={styles.invertButton} onClick = {() => handleInvert()}><img src={invert ? flip1 : flip2}></img>Invert</button>
          </div>
        }
        {!showOutput && secondScreen &&
          <textarea className={styles.inputField} onChange = {(e) => handleInput(e)}></textarea>
        }
        </Col>
        <Col lg={secondScreen ? 1 : 2}>
      </Col>
      {/* <canvas id="canvas" width={canvasSize} height={canvasSize} style={{border:"1px solid #000000"}}></canvas> <br /> */}
      {/* <div className={styles.testFont} id="outputBox">{totalString.split("\n").map((i,key) => {
            return <div className={styles.display} key={key}>{i}</div>;
      })}</div> */}
    </Row>
  
    
  
    </Container>

  );
}

export default Canvas;
