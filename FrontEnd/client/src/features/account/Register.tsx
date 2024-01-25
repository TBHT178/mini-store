import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert, AlertTitle, List, ListItem, ListItemText, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch } from "../../app/store/configureStore";
import { signInUser } from "./accountSlice";
import agent from "../../app/api/agent";
import { useState } from "react";

export default function Register() {
    const [validationErrors, setvalidationErrors] = useState([]);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {register, handleSubmit, formState:{isSubmitting, errors, isValid}} = useForm({
        mode: 'all'
    });


    return (
        <Container
        component={Paper}
        maxWidth="sm"
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 4,
        }}
        >
        <CssBaseline />
        <Box
            sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Register
            </Typography>
            <Box component="form"
             onSubmit={handleSubmit(data=> agent.Account.register(data).catch(error => setvalidationErrors(error)))} 
             noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                fullWidth
                label="Username"
                autoFocus
                {...register('username', {required:'Username is required'})}
                error={!!errors.username}
                helperText={errors?.username?.message?.toString()}
            />
             <TextField
                margin="normal"
                fullWidth
                label="Email"
                {...register('email', {required:'Email is required'})}
                error={!!errors.email}
                helperText={errors?.email?.message?.toString()}
            />
            <TextField
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                {...register('password', {required:'Password is required'})}
                error={!!errors.password}
                helperText={errors?.password?.message?.toString()}
            />

            {validationErrors.length > 0 && 
                <Alert severity="error">
                    <AlertTitle>Validation Errors</AlertTitle>
                    <List>
                        {validationErrors.map(error =>(
                            <ListItem key={error}>
                                <ListItemText>{error}</ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Alert>
            }

            <LoadingButton loading={isSubmitting}
                disabled={!isValid}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Register
            </LoadingButton>
            <Grid container>
                <Grid item>
                <Link to="/login">{"Don't have an account? Sign Up"}</Link>
                </Grid>
            </Grid>
            </Box>
        </Box>
        </Container>
    );
}
