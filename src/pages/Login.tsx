import {
  Button,
  // Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  // useTheme
} from "@mui/material";
import * as yup from 'yup';
import { useFormik } from "formik";
import { Icon } from "@iconify/react";
import { useState } from "react";
// import { LoginSocialGoogle, IResolveParams } from 'reactjs-social-login';
import { Link as RouterLink } from 'react-router-dom';
import useAuth from "../hooks/useAuth";

const validSchema = yup.object().shape({
  email: yup.string().email('Invaild email style.').required('Please input your email address.'),
  password: yup.string().required('Please input your password.')
});

export default function Login() {
  // const theme = useTheme()
  const { signinByEmailAct } = useAuth()
  const [visiblePassword, setVisiblePassword] = useState(false)
  const [userType, setUserType] = useState('individual')

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validSchema,
    onSubmit: (values) => {
      signinByEmailAct({ ...values }, userType)
    }
  })

  const handleVisiblePassword = () => {
    setVisiblePassword(!visiblePassword)
  }

  const handleUserType = (_userType: string) => {
    setUserType(_userType)
  }

  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={900} textAlign="center">Log in</Typography>
      <Stack spacing={3} mt={4}>
        <TextField
          type="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={
            formik.touched.email && formik.errors.email ? (
              <Typography
                component="span"
                sx={{ display: 'flex', alignItems: 'center', mx: 0 }}
              >
                <Icon icon="bxs:error-alt" />&nbsp;
                {formik.touched.email && formik.errors.email}
              </Typography>
            ) : (<></>)
          }
        />

        <TextField
          type={visiblePassword ? 'text' : 'password'}
          name="password"
          label="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={
            formik.touched.password && formik.errors.password ? (
              <Typography
                component="span"
                sx={{ display: 'flex', alignItems: 'center', mx: 0 }}
              >
                <Icon icon="bxs:error-alt" />&nbsp;
                {formik.touched.password && formik.errors.password}
              </Typography>
            ) : (<></>)
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => handleVisiblePassword()}>
                  {
                    visiblePassword ? (
                      <Icon icon="ant-design:eye-invisible-filled" />
                    ) : (
                      <Icon icon="ant-design:eye-filled" />
                    )
                  }

                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {/* Set user type */}
        <Stack direction="row" justifyContent="center">
          <RadioGroup
            row
            value={userType}
            onChange={e => handleUserType(e?.target?.value)}
          >
            <FormControlLabel value="individual" control={<Radio />} label="I'm individual." />
            <FormControlLabel value="company" control={<Radio />} label="I'm a company." />
          </RadioGroup>
        </Stack>

        {/* <Stack direction="row" alignItems="center" justifyContent="space-between">
          <FormControlLabel
            control={<Checkbox />}
            label="Remember me"
          />
          <Link component={RouterLink} to="/reset-password" sx={{ textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </Stack> */}

        <Stack spacing={2}>
          <Button variant="contained" onClick={() => formik.handleSubmit()}>
            Login
          </Button>

          {/* <LoginSocialGoogle
            client_id={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID || ''}
            onLoginStart={() => { console.log('start') }}
            onResolve={({ provider, data }: IResolveParams) => {
              console.log('>>>>>> provider => ', provider)
              console.log('>>>>>> data => ', data)
            }}
            onReject={(err) => {
              console.log(err)
            }}
          >
            <Button
              variant="contained"
              startIcon={<Icon icon="akar-icons:google-fill" />}
              fullWidth
              sx={{ bgcolor: theme.palette.error.main }}
            >
              Continue with Google
            </Button>
          </LoginSocialGoogle> */}
        </Stack>

        <Typography variant="body1">
          No account? <Link component={RouterLink} to="/signup" sx={{ textDecoration: 'none' }}>
            Create a new one.
          </Link>
        </Typography>
      </Stack>
    </Container>
  )
}