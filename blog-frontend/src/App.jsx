import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { FeedPostProvider } from './context/FeedPostContext';
import { PostProvider } from './context/PostContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SinglePost from './components/SinglePost';
import { NotifyContainer } from './components/Notify';
function App() {


  return (
    <>
      <div className='w-full'>
        <AuthProvider>
          <PostProvider>
            <FeedPostProvider>
              <BrowserRouter>
                <Navbar />
                <NotifyContainer />
                <Routes>

                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Homepage />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path="/post/:postId" element={<SinglePost />} />
                  </Route>
                </Routes>
                <Footer />
              </BrowserRouter>
            </FeedPostProvider>
          </PostProvider>
        </AuthProvider>
      </div>
    </>
  )
}

export default App
