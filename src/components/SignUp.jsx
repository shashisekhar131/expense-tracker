import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp(){
    const [userName,setUserName] = useState("");
    const [email,setEmail]  = useState("");
    const [password,setPassword] = useState("");
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [formErrors,setFormErrors] = useState({email:"",password:"",userName:""});

    const navigate = useNavigate();

     const validate = () => {

        const errors = {};
        
        if(!/^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/.test(email)){
            errors.email = "Enter valid email";
        }else  errors.email = "";

        if(!/^[a-zA-Z]{4,}$/.test(userName)){
            errors.userName = "Minimum 4 characters needed";
        }else  errors.userName = "";


        if(!/^[a-zA-Z ]{7,}$/.test(password)){
            errors.password = "password should be minimum 7 characters";
        }else errors.password ="";

        setFormErrors(errors);
    };
    const handleSubmit = (e)=>{
        e.preventDefault();
        validate();
        setIsFormSubmitted(true); 
        console.log(formErrors);      
    }
    
    useEffect(()=>{
        
        
        if(isFormSubmitted && formErrors.password == "" && formErrors.email == "" && formErrors.userName ==""){
            async function x(){
                const response = await axios.post(`${BASE_URL}/users`,{userName,email,password});
                if(response.status == 201){
                    navigate('/Login');
                }
             }
             x();
             setIsFormSubmitted(prev=>!prev); 
        }   
      

    },[formErrors]);
    return(
        <div>
          <Grid container justifyContent="center" alignItems="center" style={{ height: '80vh' }}>
      <Grid item xs={10} sm={6} md={4}>
        <Paper elevation={3} style={{ padding: 20 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit}>
          <TextField
                label="username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                error={formErrors.userName !== ''}
                helperText={formErrors.userName}
            />
            <TextField
                label="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={formErrors.email !== ''}
                helperText={formErrors.email}
            />
            <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={formErrors.password !== ''}
                helperText={formErrors.password}

            />

            <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: 20 }}
                type="submit"
            >
                Sign Up
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
       
      </div>
    );
}