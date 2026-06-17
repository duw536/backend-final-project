import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Card from '../component/cardComponent/Card.jsx'
import Login from '../component/Login.jsx'
import ProfileMenu from '../component/ProfileMenu.jsx'
import Archive from './Archive.jsx'
import '../css/Intro.css'

function Intro() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem('isLoggedIn') === 'true'
  );

  return (
    <Routes>
      <Route path="/" element={
        <div>
          <title>정보글</title>
          <div className='intro-toolbar'>
            <div className='intro-left-menu'>
              <button className='intro-menu-item'>전체</button>
              <button className='intro-menu-item'>즐겨찾기</button>
            </div>
            <div className='intro-middle-menu'>
              <input className="intro-search-box" type="text" placeholder='저장소 검색' />
              <button className='intro-menu-item'>검색</button>
            </div>
            <div className='intro-right-menu'>
              <select className='intro-select'>
                <option>최신순서</option>
              </select>
              <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              {isLoggedIn && <ProfileMenu />}
            </div>
          </div>
          <div>
            <h2 className='intro-h2'>저장소</h2>
          </div>
          <Card isLoggedIn={isLoggedIn} />
        </div>
      } />
      <Route path="/archive/:aid" element={<Archive />} />
    </Routes>
  )
}

export default Intro;