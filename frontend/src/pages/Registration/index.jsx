import React from 'react';
import axios from '../../axios';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import styles from './Login.module.scss';

export const Registration = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const [avatarUrl, setAvatarUrl] = React.useState('');
  const inputFileRef = React.useRef(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: 'Lara Croft',
      email: 'ant3o5ny1@gmail.com',
      password: '1wedrtgy',
    },
    // mode: 'onChange',
  });
  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/avatar', formData);
      setAvatarUrl(data.url.replace('/uploads/avatars/', ''));
    } catch (err) {
      console.warn(err);
      alert('Upload illustration error');
    }
  };
  const onClickRemoveAvatar = (e) => {
    setAvatarUrl('');
  };
  const onSubmit = async (values) => {
    if (avatarUrl) {
      values.avatarUrl = avatarUrl;
    }
    console.log('values register form', values);

    const data = await dispatch(fetchRegister(values));
    if (!data.payload) {
      return alert('Register failed!');
    }
  };
  if (isAuth) {
    return <Navigate to="/" />;
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Account creation
      </Typography>
      <div className={styles.avatar}>
        <Avatar
          onClick={() => inputFileRef.current.click()}
          src={
            avatarUrl
              ? `http://localhost:3001/uploads/avatars/${avatarUrl}`
              : './noavatar.png'
          }
          sx={{ width: 100, height: 100 }}
        />
        <input
          ref={inputFileRef}
          type="file"
          onChange={handleChangeFile}
          hidden
        />
      </div>

      {avatarUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveAvatar}
          >
            Delete
          </Button>
          {/* <img
            className={styles.image}
            src={`http://localhost:3001/uploads/${avatarUrl}`}
            alt="Uploaded"
          />  */}
        </>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Full name required' })}
          label="Full name"
          fullWidth
        />

        <TextField
          className={styles.field}
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: 'email required' })}
          label="E-Mail"
          type="email"
          fullWidth
        />
        <TextField
          className={styles.field}
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Password required' })}
          label="Password"
          type="password"
          fullWidth
        />

        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Register
        </Button>
      </form>
    </Paper>
  );
};
