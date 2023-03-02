import Container from '@mui/material/Container';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';
import { Header } from './components';
import { Home, HomePages, FullPost, Registration, AddPost, Login } from './pages';

function App() {
  const [filterTagvalue, setFilterTagvalue] = React.useState('');
  const [tabsValue, setTabsValue] = React.useState(null);

  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);
  return (
    <>
      <Header setFilterTagvalue={setFilterTagvalue} setTabsValue={setTabsValue} />
      <Container maxWidth="lg">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                filterTagvalue={filterTagvalue}
                setFilterTagvalue={setFilterTagvalue}
                tabsValue={tabsValue}
                setTabsValue={setTabsValue}
              />
            }
          />
          <Route
            path="/tags/:id"
            element={
              <Home
                filterTagvalue={filterTagvalue}
                setFilterTagvalue={setFilterTagvalue}
                tabsValue={tabsValue}
                setTabsValue={setTabsValue}
              />
            }
          />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route
            path="/pages"
            element={
              <HomePages
                filterTagvalue={filterTagvalue}
                setFilterTagvalue={setFilterTagvalue}
                tabsValue={tabsValue}
                setTabsValue={setTabsValue}
              />
            }
          />

          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
