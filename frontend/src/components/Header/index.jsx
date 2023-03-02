import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { UserInfo } from '../UserInfo';

import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';
import { fetchPosts } from '../../redux/slices/posts';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { placeFilter } from '../../redux/slices/filter';

export const Header = ({ setFilterTagvalue, setTabsValue }) => {
  const userData = useSelector((state) => state.auth.data);
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  if (isAuth) {
  }

  const onClickLogout = () => {
    if (window.confirm('Are you shure you want to logout?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link
            className={styles.logo}
            to="/"
            onClick={() => {
              setFilterTagvalue('');
              dispatch(placeFilter(''));
              setTabsValue(null);
              dispatch(fetchPosts())
            }}
          >
            <div>MERN BLOG</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <div className={styles.rowdirection}>
                  <UserInfo {...userData} />
                  <Link to="/add-post">
                    <Button variant="contained">Add article</Button>
                  </Link>
                  <Button onClick={onClickLogout} variant="contained" color="error">
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
