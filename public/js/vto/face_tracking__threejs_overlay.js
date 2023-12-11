/**
 * BRFv5 - ThreeJS Example
 *
 * This example loads a 3D model and an occlusion model (to hide the end of each bow
 * behind an invisible head's ears).
 *
 * In these examples we always use 68l type models,
 * 68l_max (4.9MB) on desktop, 68l_min (2.4MB) on mobile.
 *
 * But we provide smaller 42l type models for 3d placement/Augmented Reality as well.
 * 42l_max (3.5MB) on desktop, 42l_min (2.4MB) on mobile.
 *
 * See: js/threejs folder
 */

// export function moh(arf)
// {
//   console.log("arg is:",arf);
// }


import { error }                            from '../vto/utils/utils__logging.js'

import { setupExample }                     from '../vto/setup__example.js'
import { trackCamera, trackImage }          from '../vto/setup__example.js'

import { SystemUtils }                      from '../vto/utils/utils__system.js'
import { drawCircles }                      from '../vto/utils/utils__canvas.js'
import { drawFaceDetectionResults }         from '../vto/utils/utils__draw_tracking_results.js'

import { brfv5 }                            from '../vto/brfv5/brfv5__init.js'

import { configureNumFacesToTrack }         from '../vto/brfv5/brfv5__configure.js'
import { setROIsWholeImage }                from '../vto/brfv5/brfv5__configure.js'

import { colorPrimary }                     from '../vto/utils/utils__colors.js'

import { render3DScene, setNumFaces, prepareModelNodes,
  hideAllModels, turnIntoOcclusionObject, add3DModel,
  set3DModelByName }                        from '../vto/threejs/threejs__setup.js'

import { load3DModelList, getModelInstance } from './threejs/threejs__loading.js'

import { hide3DModels, updateByFace }       from '../vto/ui/ui__overlay__threejs.js'
let numFacesToTrack       = 1;// set be run()
let models = [];
//let t3dobj;


function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;domain=.lenskart.com";
  //document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

/* FUnction open the facewidth calculation div*/
function openFacewidthCalculationScreen(){
  displayAnimationDiv('block','face-scan-loader');
}

/* Function to toggle(hide/show) animation div */
 
function displayAnimationDiv(mode,divid,time = 0){
  if(time == 0){
    document.getElementById(divid).style.display = mode;
  }else{
    setTimeout(function(){
      document.getElementById(divid).style.display = mode;
    },time);
  }
}

/* Function to calculate Facewidth */
function calculateFaceWidth(t3dobj,models,callbackmethod){
  displayAnimationDiv('none','face-scan-loader');
  displayAnimationDiv('block','face-scan-loader-analysing');
  displayAnimationDiv('block','face-scan-gif-loader');
  var canvas = $('#customcanvas');
  var video = $('video');
  const context = canvas[0].getContext('2d');
  const aspectRatio = video[0].videoWidth / video[0].videoHeight;
  const height = 480;
  const width = 480 * aspectRatio;
  canvas[0].width = width;
  canvas[0].height = height;
  context.drawImage(video[0], 0, 0, width, height);
  const base64Image = canvas[0].toDataURL('image/png');

  setTimeout(function(){
    displayAnimationDiv('block','analysingfaceSize');
    displayAnimationDiv('none','analysingfaceShape');
    displayAnimationDiv('none','analysingfaceForehead');
    displayAnimationDiv('none','analysingfacialPoints');
  },1000);

  setTimeout(function(){
    displayAnimationDiv('none','analysingfaceSize');
    displayAnimationDiv('block','analysingfaceShape');
    displayAnimationDiv('none','analysingfaceForehead');
    displayAnimationDiv('none','analysingfacialPoints');
  },2000);

  setTimeout(function(){
    displayAnimationDiv('none','analysingfaceSize');
    displayAnimationDiv('none','analysingfaceShape');
    displayAnimationDiv('block','analysingfaceForehead');
    displayAnimationDiv('none','analysingfacialPoints');
  },3000);

  setTimeout(function(){
    displayAnimationDiv('none','analysingfaceSize');
    displayAnimationDiv('none','analysingfaceShape');
    displayAnimationDiv('none','analysingfaceForehead');
    displayAnimationDiv('block','analysingfacialPoints');
    getFacewidthApiResult(base64Image,t3dobj,models,callbackmethod);
  },4000);
  
}

function getFaceSizeValue(width){
  var sizevalue = 'Medium';
  if(width > -1 && width <= 129.9999){
    sizevalue = 'Extra Narrow';
  }

  if(width >= 130 && width <= 133.9999){
    sizevalue = 'Narrow';
  }

  if(width >= 134 && width <= 137.9999){
    sizevalue = 'Medium';
  }

  if(width >= 138 && width <= 141.9999){
    sizevalue = 'Wide';
  }

  if(width >= 142 && width <= 1000){
    sizevalue = 'Extra Wide';
  }
  return sizevalue;
}
  

function getFacewidthApiResult(imgObj,t3dobj,models,callback){
  var formData = new FormData();
  const binaryImage = dataURItoBlob(imgObj);
  formData.append('webphoto', binaryImage);
  //formData = '';
  $.ajax({
      url: 'https://xface.lenskart.com/converter/faceparameters/',
      data: formData,
      contentType: false,
      processData: false,
      type: 'POST',
      success: function ( res ) {
          var faceParamas = {
            'facewidth':0,
            'pd': 0,
            'faceshape':'',
            'facewidthTitle' : ''
          };
          displayAnimationDiv('none','analysingfacialPoints');
          if(typeof res.faces != 'undefined'){
            if(typeof res.faces.attributes != 'undefined'){
              if(typeof res.faces.attributes.facewidth != 'undefined'){
                  if(typeof res.faces.attributes.facewidth.value != 'undefined'){
                    faceParamas.facewidth = res.faces.attributes.facewidth.value;
                    $('#detectedFrame').text('Detected frame width: '+parseInt(faceParamas.facewidth)+' mm');
                    var sizevalue = getFaceSizeValue(faceParamas.facewidth);
                    faceParamas.facewidthTitle = sizevalue;
                    $('#detectedframeSize').text('Detected frame size: '+sizevalue);

                    setTimeout(function(){
                      displayAnimationDiv('block','detectedFrame');
                    },1000);

                    setTimeout(function(){
                      displayAnimationDiv('block','detectedframeSize');
                    },2000);
                    }
              }
          
              if(typeof res.faces.attributes.faceshape != 'undefined'){
                if(typeof res.faces.attributes.faceshape.value != 'undefined'){
                  faceParamas.faceshape = res.faces.attributes.faceshape.value;
                  setTimeout(function(){
                    displayAnimationDiv('block','detectedShape');
                  }, 3000);
                }
              }

              setCookie('facewidthcookie',JSON.stringify(faceParamas),1);
              if (typeof callback == "function")
                callback(t3dobj,models);
            }
          }
      },
      error:function ( res ) {
        displayAnimationDiv('none','analysingfacialPoints');
        setTimeout(function(){
            $('#detectedShape').text('Something went wrong');
            displayAnimationDiv('block','detectedShape');
            if (typeof callback == "function")
              callback(t3dobj,models);
          }, 1000);
      }
    });
}

function showtime(){
  var dt = new Date();
      var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
      console.log(time);
}

function loadModels(t3d,models){
  showtime();
  setTimeout(function(){
    displayAnimationDiv('none','detectedFrame');
    displayAnimationDiv('none','detectedframeSize');
    displayAnimationDiv('none','detectedShape');
    displayAnimationDiv('none','face-scan-loader-analysing');
    displayAnimationDiv('none','face-scan-gif-loader');
    displayAnimationDiv('block','frame-scan-loader-analysing-2');
    load3DModelList({ fileList: models, onProgress: null }).then(() => {
      prepareModelNodes(t3d);
      hideAllModels(t3d);
      for(let i = 0; i < models.length; i++) {
  
        const model = models[i];
        const obj3d = getModelInstance(t3d, model.pathToModel);
  
        if(model.isOcclusionModel) {
          turnIntoOcclusionObject(obj3d);
        }
  
        if(!model.isMaterialCollection && obj3d) {
          add3DModel(t3d, obj3d);
        }
      }
      for(let i = 0; i < models.length; i++) {
        const model = models[i];
        if(!model.isMaterialCollection) {
          set3DModelByName(t3d, model.pathToModel, model.nameModel, (url, name) => {
            error('SETTING_3D_MODEL_NAME_FAILED:', name, url);
          });
        }
        if(!models[i].isOcclusionModel){
          displayAnimationDiv('none','frame-scan-loader-analysing-2');
          window.parent.postMessage("frameloadevent", '*');
        }
      }
    }).catch((e) => { error(e) })
  },4000);
}

function urlpass(url){
  let models = [
                  {
                    pathToModel:          '/css/assets/3d/occlusion_head.artov5',
                    pathToTextures:       '/css/assets/3d/textures/',
                    nameModel:            null,
                    isOcclusionModel:     true,
                    isMaterialCollection: false,
                    isOccluder:           true,
                    isAvoid:              true,
                  },

                  // The actual 3d model as exported from ThreeJS editor.
                  // either rayban.json or earrings.json
                  // Textures might be embedded or set as file name in a certain path.

                  {
                    pathToModel:         url,
                    pathToTextures:       '/css/assets/3d/textures/',
                    nameModel:            'black',
                    isOcclusionModel:     false,
                    isMaterialCollection: false,
                    isOccluder:           false,
                    isAvoid:              false,
                  },

                  {
                    pathToModel:           '/css/assets/3d/occluder.glb',
                    pathToTextures:       '/css/assets/3d/textures/',
                    nameModel:            'black',
                    isOcclusionModel:     true,
                    isMaterialCollection: false,
                    isOccluder:           true,
                    isAvoid:              false,
                  }
    ];

  run(1,models);

}
window.urlpass = urlpass;
window.setCookie = setCookie;
window.getCookie = getCookie;
window.calculateFaceWidth = calculateFaceWidth;
window.loadModels = loadModels;
window.openFacewidthCalculationScreen = openFacewidthCalculationScreen;
window.displayAnimationDiv = displayAnimationDiv;
window.getFaceSizeValue = getFaceSizeValue;
window.getFacewidthApiResult = getFacewidthApiResult;



 

export const configureExample = (brfv5Config, t3d) => {
  document.getElementById('capture-btn').addEventListener('click', function() {
    calculateFaceWidth(t3d,models,loadModels);
  });

  configureNumFacesToTrack(brfv5Config, numFacesToTrack)

  if(numFacesToTrack > 1) {
    setROIsWholeImage(brfv5Config);
  }

  brfv5Config.faceTrackingConfig.enableFreeRotation = false;
  brfv5Config.faceTrackingConfig.maxRotationZReset  = 34.0;

  setNumFaces(t3d, numFacesToTrack);
  hide3DModels(t3d);
  if(isfaceAnalysisEnable == 1){
    $('#frame-scan-loader-analysing-2').hide();
    var facewidthCookieValue = getCookie('facewidthcookie');
    if(facewidthCookieValue == ''){
      openFacewidthCalculationScreen();
    }else{
      loadModels(t3d,models);
    }
  }else{
    loadModels(t3d,models);
  }
}
export const handleTrackingResults = (brfv5Manager, brfv5Config, canvas, t3d) => {

  const ctx   = canvas.getContext('2d')
  const faces = brfv5Manager.getFaces()

  let doDrawFaceDetection = false

  setNumFaces(t3d, numFacesToTrack)

  hide3DModels(t3d)

  for(let i = 0; i < faces.length; i++) {

    const face = faces[i];

    if(face.state === brfv5.BRFv5State.FACE_TRACKING) {

      // drawCircles(ctx, face.landmarks, colorPrimary, 2.0);

      // Update the 3d model placement.

      updateByFace(t3d, ctx, face, i, true)

      if(window.selectedSetup === 'image') {

        updateByFace(t3d, ctx, face, i, true)
        updateByFace(t3d, ctx, face, i, true)
        updateByFace(t3d, ctx, face, i, true)
      }

    } else {

      // Hide the 3d model, if the face wasn't tracked.
      updateByFace(t3d, ctx, face, i, false)

      doDrawFaceDetection = true;
    }

    // ... and then render the 3d scene.
    render3DScene(t3d)
  }

  if(doDrawFaceDetection) {

    drawFaceDetectionResults(brfv5Manager, brfv5Config, canvas)
  }

  return false
}

const exampleConfig = {

  // See face_tracking__choose_model.js for more info about the models.

  modelName:                '42l',
  numChunksToLoad:          SystemUtils.isMobileOS ? 4 : 8,

  // If true, numTrackingPasses and enableFreeRotation will be set depending
  // on the apps CPU usage. See brfv5__dynamic_performance.js for more insights.

  enableDynamicPerformance: window.selectedSetup === 'camera',

  onConfigure:              configureExample,
  onTracking:               handleTrackingResults
}

// run() will be called automatically after 1 second, if run isn't called immediately after the script was loaded.
// Exporting it allows re-running the configuration from within other scripts.

let timeoutId = -1
export const run = (_numFacesToTrack = 1,configs=[]) => {
  models=configs

  numFacesToTrack = _numFacesToTrack

  clearTimeout(timeoutId)
  setupExample(exampleConfig)

  if(window.selectedSetup === 'image') {

    trackImage('./assets/tracking/' + window.selectedImage)

  } else {
      trackCamera();
  }
}






timeoutId = setTimeout(() => { run() }, 1000)

export default { run }

//location.reload()