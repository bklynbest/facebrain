import React, { Component } from 'react';
import './App.css';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
// eslint-disable-next-line
import SignIn from './Components/SignIn/SignIn';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
 apiKey: 'fee6ad442d6b49a7acc4436f717c02ef'
});

const particlesOptions= {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl: '',
      box: {},
      route: 'signin'
    };
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
  }
  
  
  
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
      app.models
        .predict(
          Clarifai.FACE_DETECT_MODEL, this.state.input)
          .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
          .catch(err => console.log(err));
  }
  
  onRouteChange = () => {
    this.setState({route: 'home'})
  }
  
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  
  render() {
    return (
      <div className="App">
        <Particles className="particles" 
                params={particlesOptions}
        />
        <Navigation />
        { this.state.route === 'signin' 
        ?<SignIn onRouteChange = {this.onRouteChange}/>
        :<div>
          <Logo />
          <Rank />
          <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit} 
          />
          <FaceRecognition box={this.state.box} imageUrl= {this.state.imageUrl}/>
        </div>
        }
      </div>
    );
  }
}

export default App;
