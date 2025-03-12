import React from 'react';
import user_img from '../assets/auth_img/users.png';
import shop_owner from '../assets/auth_img/seller.png';
import '../css/Options.css';
import { useNavigate } from "react-router-dom";
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import img1 from '../assets/slide_img/slide1.jpg';
import img2 from '../assets/slide_img/slide2.png';
import img3 from '../assets/slide_img/slide3.jpg'

export default function Options() {
  const navigate = useNavigate();

  const handle_link = (type) => {
    navigate(`/Register?type=${type}`);
  }

  const slideImages = [img1, img2 , img3];

  return (
    <>  
      <div className="slideshow-container">
        <Slide autoplay={true} duration={1000} transitionDuration={1000} arrows={false}>
          {slideImages.map((each, index) => (
            <div key={index} className="each-slide">
              <img src={each} alt={`slide-${index}`} />
            </div>
          ))}
        </Slide>
      </div>
      <div className='full-page'>
        <div className='shop-name'>
          <h1 className='optionh1'>EASY</h1>
          <h1 className='optionh1'>SHOPPING</h1>
        </div>
        <h1 className='enter-as'>ENTER AS</h1>
        <div className='main-block'>
          <img onClick={() => handle_link('customer')} className='images' src={user_img} />
          
          <img onClick={() => handle_link('shop_owner')} className='images' src={shop_owner} />
        </div>
        <div className='option-name'>
          <h2>Customers</h2>
          <h2>Shop Owners</h2>
        </div>
      </div>
    </>
  );
}
