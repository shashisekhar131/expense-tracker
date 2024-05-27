import { Box, Button, FormHelperText, Grid, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState,useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../config";

export default function Login({setIsLoggedIn}){
    const [email,setEmail]  = useState("arun@gmail.com");
    const [password,setPassword] = useState("arundas");
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [formErrors,setFormErrors] = useState({email:"",password:""});
    const [inValidUser,setInValidUser] = useState(false);
    
    const navigate = useNavigate();
    const validate = () => {

        const errors = {};
        
        if(!/^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/.test(email)){
            errors.email = "Enter valid email";
        }else  errors.email = "";


        if(!/^[a-zA-Z ]{7,}$/.test(password)){
            errors.password = "password should be minimum 7 characters";
        }else errors.password ="";

        setFormErrors(errors);
    };
    const handleSubmit = (e)=>{
        e.preventDefault();
        validate();
        setIsFormSubmitted(true);       
    }
    
    useEffect(()=>{
        

        if(isFormSubmitted && formErrors.password == "" && formErrors.email == ""){
            async function validateUser(){
                const response = await axios.get(`${BASE_URL}/users`);
                
                const users = response.data;                
                const user = users.find(user => user.email === email && user.password === password);

                if(user){
                    localStorage.setItem("loggedInUser",JSON.stringify(user));
                    setIsLoggedIn(true);
                    navigate('/');                    
                }else{
                    setInValidUser(true);
                }
             }
             validateUser();
             setIsFormSubmitted(prev=>!prev); 
        }   
      

    },[formErrors]);
    return(
        <div>
          <Grid container justifyContent="center" alignItems="center" style={{ height: '70vh' }}>
      <Grid item xs={10} sm={6} md={4}>
        <Paper elevation={3} style={{ padding: 20 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
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
              {inValidUser && <FormHelperText error>Please enter a valid email and password</FormHelperText>}

            <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: 20 }}
                type="submit"
            >
                Login
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
       
      </div>
    );
}