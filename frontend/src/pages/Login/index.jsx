import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import styles from './Login.module.scss';
import { fetchAuth, selectIsAuth } from '../../redux/slices/auth';

export const Login = () => {
console.log("Login")
debugger
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: 'ant3o5ny@gmail.com',
      password: 'wedrtgy',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));
        if (!data.payload) {
      return alert('Login failed!');
    }
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };
  if (isAuth) {
    return <Navigate to="/" />;
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Enter account
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          type="email"
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: `Please input email` })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Password"
          type="password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: `Please input password` })}
          fullWidth
        />
        <Button disabled={!isValid}  type="submit" size="large" variant="contained" fullWidth>
          Enter
        </Button>
      </form>
    </Paper>
  );
};