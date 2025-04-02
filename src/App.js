import logo from './logo.svg';
import './App.css';
import Index from './components/Index';
import Image from './components/Image';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";

function App() {
  return (

    <Router> 
      <Routes>
      <Route path="/" element={<Index></Index>}></Route>
      <Route path="/Image" element={<Image></Image>}></Route>
       </Routes>
       </Router>
   
  );
}

export default App;
