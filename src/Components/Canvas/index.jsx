import CanvasDraw from "react-canvas-draw";
import React, { useState, useEffect } from 'react';

import styles from "./main.module.scss";

function Canvas() {

  const canvasSize = 400
  const [saveableCanvas, setSaveableCanvas] = useState()
  const [output, setOutput] = useState("")
  const [totalString, setTotalString] = useState("")

  const saveImage = () => {
    var stringified = saveableCanvas.getSaveData()
    console.log(stringified)
    setTotalString(drawDots(stringified))
  }

  const drawDots = (stringified) => {
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
      var fontPointString = window.getComputedStyle(outputBox, null).getPropertyValue('font-size')
      var fontPoint = parseInt(fontPointString.substring(0,2))
      var numSlices = (max_y-min_y)/fontPoint
      var midpoint = 0
      var oldMidpoint = 0
      var startPoint = 0
      var tempTotalString = ""

      for (var i = 0; i < numSlices; i++) {
        min_x = 400
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
        tempTotalString = tempTotalString + spaceString + output.substring(startPoint, (startPoint + numChars)) + "\n"
        console.log(tempTotalString)
        console.log(output.substring(startPoint, (startPoint + numChars)))
        startPoint += numChars
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
  }

  return (
    <div>
      <CanvasDraw style={{border:"1px solid #000000"}} canvasWidth={canvasSize} canvasHeight={canvasSize} ref={canvasDraw => setSaveableCanvas(canvasDraw)}/>
      {/* <canvas id="canvas" width={canvasSize} height={canvasSize} style={{border:"1px solid #000000"}}></canvas> <br /> */}
      <button onClick={() => saveImage()}>Save</button> <br />
      <input onChange = {(e) => handleInput(e)}></input>
      <div className={styles.testFont} id="outputBox">{totalString.split("\n").map((i,key) => {
            return <div className={styles.display} key={key}>{i}</div>;
      })}</div>
    </div>

  );
}

export default Canvas;
