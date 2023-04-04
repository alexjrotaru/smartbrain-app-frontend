import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
   return(
    <div className='ma4 mt0 w4'>
        <Tilt className='Tilt br2 shadow-2' >
            <div style={{height: '100px', margin: '20px'}}>
                <div className='Tilt-inner pa3'>
                    <img style = {{paddingTop:'5px'}} alt='logo' src={brain}/>
                </div>
            </div>
        </Tilt>
    </div>
   ); 
}

export default Logo;