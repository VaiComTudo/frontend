import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Resgister'
import Explore from './pages/Explore'
import MyListings from './pages/MyListings'
import ListingDetails from './pages/ListingDetails'
import Checkout from './pages/Checkout'
import EditListing from './pages/EditListing'
import { UserProvider } from './context/UserContext'

function App() {
  return (
    <UserProvider>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/listing/:id" element={<ListingDetails />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/edit-listing/:id" element={<EditListing />} />

            <Route path="*" element={<Navigate to={'/'} replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </UserProvider>
  )
}

export default App
