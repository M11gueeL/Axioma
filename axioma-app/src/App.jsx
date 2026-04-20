import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { HelloWorld } from './pages/HelloWorld';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HelloWorld />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
