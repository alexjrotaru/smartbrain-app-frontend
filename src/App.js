import 'tachyons';
import './App.css';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import ParticlesBg from 'particles-bg';
import React, {Component} from 'react';
import SignIn from './components/SignIn/SignIn.js';
import Register from './components/Register/Register';
// import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';



class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  
  
  calculateFaceLocation = (data) => {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      } 
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
    console.log(box);
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});

  }

  onRouteChange = (route) => {

    if(route === 'signout') {
      this.setState({isSignedIn: false})
    } else if(route === 'home') {
      this.setState({isSignedIn: true})
    }

    this.setState({route: route});
  }

  onButtonSubmit = () => {
    console.log('button clicked');
    this.setState({imageUrl: this.state.input});
    
      const PAT = '655a3251b0a54017b7ea7762f8584025';
      const USER_ID = 'alexjrotaru';       
      const APP_ID = 'my-first-application';
      const MODEL_ID = 'face-detection';
      const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
      const IMAGE_URL = this.state.input;
    
      const raw = JSON.stringify({
          "user_app_id": {
              "user_id": USER_ID,
              "app_id": APP_ID
          },
          "inputs": [
              {
                  "data": {
                      "image": {
                          "url": IMAGE_URL
                      }
                  }
              }
          ]
      });
    
      const requestOptions = {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Authorization': 'Key ' + PAT
          },
          body: raw
      };
  
  
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    .then(response => response.text())
    .then(response => {
      const parser = JSON.parse(response)
      this.displayFaceBox(this.calculateFaceLocation(parser))
    })
    .catch(err => console.log(err));
    
  
  }
  // http://nolimitlandscaping.com/wp-content/themes/land3.images/sliders/slide1.jpg
  render() {
    const {route, input, imageUrl, box, isSignedIn} = this.state; 
    return (
      <div className="App">
        <Navigation isSignedIn = {isSignedIn} onRouteChange={this.onRouteChange} />
        <ParticlesBg className='particles' num={120} type="cobweb" bg={true} />
        { route === 'home' 
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit} />      
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : ( 
              route === 'signin' 
              ? <SignIn onRouteChange={this.onRouteChange} />
              : <Register onRouteChange={this.onRouteChange} />
            ) 
       }   
      </div>
    );
  }
}

export default App;
