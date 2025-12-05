import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { MovieDetail } from './pages/MovieDetail';
import { Login } from './pages/Login';
import { SessionSeats } from './pages/SessionSeats';
import { SelectTickets } from './pages/SelectTickets';
import { Payment } from './pages/Payment';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/session/:sessionId" element={<SessionSeats />} />
        <Route path="/session/:sessionId/tickets" element={<SelectTickets />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;