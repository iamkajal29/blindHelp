// 'use strict';
// import React, { Component, useRef, PureComponent } from 'react';
// import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { RNCamera } from 'react-native-camera';
// import Scanner from 'react-native-rectangle-scanner';
// class App extends PureComponent {
//   render() {
//     return (
//       <View style={styles.container}>
//         <RNCamera
//           ref={ref => {
//             this.camera = ref;
//           }}
//           style={styles.preview}
//           type={RNCamera.Constants.Type.back}
//           flashMode={RNCamera.Constants.FlashMode.on}
//           androidCameraPermissionOptions={{
//             title: 'Permission to use camera',
//             message: 'We need your permission to use your camera',
//             buttonPositive: 'Ok',
//             buttonNegative: 'Cancel',
//           }}
//           androidRecordAudioPermissionOptions={{
//             title: 'Permission to use audio recording',
//             message: 'We need your permission to use your audio',
//             buttonPositive: 'Ok',
//             buttonNegative: 'Cancel',
//           }}
//         />
//         <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
//           <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
//             <Text style={{ fontSize: 14 }}> SNAP </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   takePicture = async () => {
//     if (this.camera) {
//       const options = { quality: 0.5, base64: true };
//       const data = await this.camera.takePictureAsync(options);
//       console.log(data.uri);
//     }
//   };
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     backgroundColor: 'black',
//   },
//   preview: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   capture: {
//     flex: 0,
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     padding: 15,
//     paddingHorizontal: 20,
//     alignSelf: 'center',
//     margin: 20,
//   },
// });



///////////////////////////////RECTANGLE SCANNER/////////////////////////////////////////////
// 
/////////////////////////////////////RECTANGLE SCANNER END/////////////////////////////////////////

////////////////////////////////DOCUMENT SCANNER////////////////////////////////////////
import React, { useRef, useState, useEffect } from "react"
import { View, StyleSheet, Text, TouchableOpacity, Image, Platform } from "react-native"
import Permissions from 'react-native-permissions';
import PDFScanner from "@woonivers/react-native-document-scanner"
import { RNPhotoEditor } from 'react-native-photo-editor';
import RNTesseractOcr from 'react-native-tesseract-ocr';
import Tts from 'react-native-tts';

//Tts.engines().then(engines => console.log(engines));
//Tts.voices().then(voices => console.log(voices));

Tts.setDefaultLanguage('en-IN')
Tts.setDefaultVoice('en-in-x-cxx#female_1-local')

export default function App() {
  const pdfScannerElement = useRef(null)
  const [data, setData] = useState({})
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    async function requestCamera() {
      const result = await Permissions.request(Platform.OS === "android" ? "android.permission.CAMERA" : "ios.permission.CAMERA")
      if (result === "granted") setAllowed(true)
    }
    requestCamera()
  }, [])

  function handleOnPressRetry() {
    setData({})
  }
  
  function handleOnPress() {
    pdfScannerElement.current.capture()
    const imgPath = (data.croppedImage).replace('file://', '');

    console.log("Image",imgPath)
    RNPhotoEditor.Edit({
      path: imgPath,
      //hiddenControls: [],
      //colors: undefined,
    });
  }

   function ocrRecognize() {
        const tessOptions = {
                whitelist: 'qwertyuiopasdfghjklzxcvbnm1234567890/-\.ABCDEFGHIJKLMNOPQRSTUVWXY()',
                blacklist: '\'!"#$%&()={}[]+*_:;<>@\.\\'
                // blacklist:null
              };

        const imgPath = (data.croppedImage).replace('file://', '');
              // const imgPath = '/storage/emulated/0/Download/menu_cropped.png'

              RNTesseractOcr.recognize(imgPath, 'LANG_ENGLISH', tessOptions)
                .then((result) => {
//                  this.setState({ ocrResult: result });
                  console.log("OCR Result: ", result);
//                  Tts.setDefaultLanguage('en-IN');
//                  Tts.setDefaultVoice('en-in-x-ahp#female_1-local');
                    Tts.getInitStatus().then( Tts.speak(result, {
                                                                 androidParams: {
                                                                   KEY_PARAM_PAN: -1,
                                                                   KEY_PARAM_VOLUME: 0.5,
                                                                   KEY_PARAM_STREAM: 'STREAM_MUSIC',
                                                                 },
                                                               })
                 )
                  // .then(voices => console.log(voices));
                })
                .catch((err) => {
                  console.log("OCR Error: ", err);
                })
                .done();
   }
  if (!allowed) {
    console.log("You must accept camera permission")
    return (<View style={styles.permissions}>
      <Text>You must accept camera permission</Text>
    </View>)
  }
  
      
  if (data.croppedImage) {
    console.log("data", data);
    
    const imgPath = (data.croppedImage).replace('file://', '');
    console.log("Image",imgPath)

    RNPhotoEditor.Edit({
      path: imgPath,
      hiddenControls: [],
      colors: undefined,
    });
    ocrRecognize();
    //setData({});
    return (
      <React.Fragment>
        <Image source={{uri: 'file://' + imgPath}} style={styles.preview} />
        
        <TouchableOpacity onPress={handleOnPressRetry} style={styles.button}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </React.Fragment>
    )
  }
  
  return (
    <React.Fragment>
      <PDFScanner
        ref={pdfScannerElement}
        style={styles.scanner}
        onPictureTaken={setData}
        overlayColor="rgba(255,130,0, 0.7)"
        enableTorch={false}
        quality={0.5}
        detectionCountBeforeCapture={5}
        detectionRefreshRateInMS={50}
        //saveInAppDocument={true}
      />
      <TouchableOpacity onPress={handleOnPress} style={styles.button}>
        <Text style={styles.buttonText}>Take picture</Text>
      </TouchableOpacity>
    </React.Fragment>
  )


}

const styles = StyleSheet.create({
  scanner: {
    flex: 1,
    aspectRatio: undefined
  },
  button: {
    alignSelf: "center",
    position: "absolute",
    bottom: 32,
  },
  buttonText: {
    backgroundColor: "rgba(245, 252, 255, 0.7)",
    fontSize: 32,
  },
  preview: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
  },
  permissions: {
    flex:1,
    justifyContent: "center",
    alignItems: "center"
  }
})
///////////////////////////////DOCUMENT SCANNER END///////////////////////////////////////////////////
