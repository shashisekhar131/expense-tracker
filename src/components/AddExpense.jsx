import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Paper, Typography, responsiveFontSizes, IconButton, Icon } from "@mui/material";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import { BASE_URL } from "../../config";

function AddExpense({ setExpenseList,setModalOpen,currentExpense,setCurrentExpense}) {
  const [formValues, setFormValues] = useState(currentExpense);
  const [formErrors, setFormErrors] = useState({});
  const [isFormSubmitted,setIsFormSubmitted] = useState(false);

  const handleSubmit = (e)=>{
    e.preventDefault();
    validate(formValues);
    setIsFormSubmitted(true);             
};

const validate = (values) => {
 
    const errors = {};
    for (let key in values) {
        if (typeof values[key] === 'string' && values[key].trim() === "") {
            errors[key] = "This field is required";
        }else{
            errors[key] = "";
        }
    }
    setFormErrors(prevErrors => ({
        ...prevErrors,
        ...errors
    }));
};



const handleInputChange = (e)=>{
  const {type,name,value} = e.target;
  if(type == 'number'){
    setFormValues({...formValues,[name]:parseInt(Math.abs(value))});
  }else{
    setFormValues({...formValues,[name]:value});
  }
};

const insertExpense = async (expense) => {
  const response = await axios.post(`${BASE_URL}/expenses`,expense);
  if(response.status == 201){
    expense.id = response.data.id;
    setExpenseList(prev=>prev.concat(expense));
    setModalOpen(false);
  }              
}

const editExpense = async (expense) =>{
  const response = await axios.put(`${BASE_URL}/expenses/${expense.id}`,expense);
  
  if(response.status == 200){
    setExpenseList(prev =>{
      return prev.map(expense=>{
        if(expense.id == currentExpense.id){
          console.log(formValues);
          return formValues;
        }
        return expense;
       })
     });
     setModalOpen(false);
    }  
}

useEffect(()=>{
    var isAnyError = false;
    for(let key in formErrors){
        if(formErrors[key] != ''){
           isAnyError = true;
        }
    }

    // no errors and form submitted if currentExpense is new then insert otherwise update
    if(!isAnyError && isFormSubmitted){    
        const expense = {
            title: formValues.title,
            description: formValues.description,
            amount: Math.abs(formValues.amount),
            date: formValues.date,
            category: formValues.category,
            userId:JSON.parse(localStorage.getItem("loggedInUser")).id
          } 
          console.log(expense);
 
         if(currentExpense.id){
           //update
           expense.id = currentExpense.id;
           editExpense(expense);
         }else insertExpense(expense);
         // clear the form 
        setCurrentExpense({
          title: "",
          description: "",
          amount: "",
          date: "",
          category: ""
        });
        setIsFormSubmitted(false);   
    }  

},[formErrors]);


  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
    <Grid item xs={10} sm={6} md={4}>
      <Paper elevation={3} style={{ padding: 20,position:'relative' }}>
         <IconButton
            onClick={() => {setModalOpen(false)}}
            style={{ position: 'absolute', top: 0, right: 0 }}
          >
            <CloseIcon fontSize="large" />
          </IconButton> 
       <Typography variant="h4" align="center" gutterBottom>
          Add Expense
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            name="title"
            value={formValues.title}
            onChange={handleInputChange}
            error={!!formErrors.title}
            helperText={formErrors.title}
            margin="normal"
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            name="description"
            value={formValues.description}
            onChange={handleInputChange}
            error={!!formErrors.description}
            helperText={formErrors.description}
            margin="normal"
          />
          <TextField
            label="Amount"
            variant="outlined"
            fullWidth
            name="amount"
            type="number"
            value={formValues.amount}
            onChange={handleInputChange}
            error={!!formErrors.amount}
            helperText={formErrors.amount}
            margin="normal"
          />
          <TextField
            label="Date"
            variant="outlined"
            fullWidth
            type="date"
            name="date"
            value={formValues.date}
            onChange={handleInputChange}
            error={!!formErrors.date}
            helperText={formErrors.date}
            margin="normal"
            InputLabelProps={{
              shrink: true,
          }}
          />
          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            name="category"
            value={formValues.category}
            onChange={handleInputChange}
            error={!!formErrors.category}
            helperText={formErrors.category}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: 20 }}
          >
            Add Expense
          </Button>
          
          
        </form>
      </Paper>
    </Grid>
  </Grid>
  

  );
}

export default AddExpense;
