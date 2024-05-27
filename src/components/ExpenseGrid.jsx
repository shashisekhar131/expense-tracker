
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, IconButton, Modal, Grid, Card, CardContent, Typography, TextField, CircularProgress, Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { Delete, Edit } from "@mui/icons-material";
import { BASE_URL } from "../../config";

const cardStyle = {
    backgroundColor: '#ffffff', 
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)',    
};

function ExpenseGrid({ openModal,expenseList, setExpenseList, setCurrentExpense, setModalOpen }) {

    // delete, edit btn related states
    const [deleteBtnClicked,setDeleteBtnClicked] = useState(false);
    const [editBtnClicked,setEditBtnClicked] = useState(false);
    // store ids of expense that user is chaning
    const [deleteId,setDeleteId] = useState(0);
    const [editId,setEditId] = useState(0);
    const [pageNumber,setPageNumber]  = useState(1);
    const [totalPages,setTotalPages] = useState(2);
    const [searchText,setSearchText] = useState("");

    const handleEdit = (expenseId)=>{
            setEditId(expenseId);                                                      
            setEditBtnClicked(true);    
    }
    const handleDelete = (expenseId) =>{
        setDeleteId(expenseId);    
        setDeleteBtnClicked(true);     
    }

    const getExpenseList = async () => {
        const userId = JSON.parse(localStorage.getItem("loggedInUser")).id;  

        const res = await axios.get(
          `${BASE_URL}/expenses?userId=${userId}&_per_page=7&_page=${pageNumber}`
        );
        setTotalPages(res.data.pages);
        const data = res.data.data;
        if(res.data.next !=  null){
        console.log(pageNumber)
        setExpenseList((prev) => [...prev, ...data]);
        }
      };
      
    useEffect(()=>{
        let filteredList=  expenseList.filter(
            (expense) =>                  
                expense.title.toLowerCase().includes(searchText) 
            )
        setExpenseList(filteredList);
        if(filteredList.length == 0 || searchText == ''){
            getExpenseList();
        } 
        
    },[searchText])

    useEffect(() => {
        if(pageNumber <=totalPages){
          setTimeout(function(){
            getExpenseList();
        },3000) 
        }  
      }, [pageNumber]);
    
    const handelInfiniteScroll = async () => {
    try {
        if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
        ) {
        setPageNumber((prev) => prev + 1);
        }
    } catch (error) {
        console.log(error);
    }
    };
    
      useEffect(() => {
        window.addEventListener("scroll", handelInfiniteScroll);
        return () => window.removeEventListener("scroll", handelInfiniteScroll);
      }, []);   
    

    useEffect(()=>{
        async function deleteExpense(){
            const response = await axios.delete(`${BASE_URL}/expenses/${deleteId}`);
            setExpenseList(prev=>prev.filter(expense=> expense.id != deleteId));
            setDeleteBtnClicked(false);
        }
        if(deleteBtnClicked && confirm("sure to delete")) {
            deleteExpense();           
        }else setDeleteBtnClicked(false);
    },[deleteBtnClicked]);

    useEffect(()=>{
        if(editBtnClicked){
            const expense = expenseList.find(expense => expense.id == editId);
            setCurrentExpense(expense);
            setModalOpen(true);
            setEditBtnClicked(false);
        }   
        
    },[editBtnClicked]);

    return (
        <>
         <Grid container spacing={2} alignItems="center" marginBottom="10px">
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <Button
                    color='primary'
                    variant="contained"
                    style={{ color: 'white', padding: '15px 20px', marginTop: '15px' }}
                    onClick={openModal}
                    startIcon={<AddIcon />}
                    fullWidth
                >
                    Add Expense
                </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>

            <TextField
                label="Search"
                variant="outlined"
                value={searchText}
                onChange={e => setSearchText(e.target.value.trim().toLowerCase())}
                style={{marginTop: '15px'}}
                fullWidth
             />
            </Grid>

            
        </Grid>

            <Grid container spacing={2}>
                {(expenseList.length>0) && expenseList.map((expense,index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={`${expense.id}-${index}`}>
                        <Card style={cardStyle}>
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    {expense.title}
                                </Typography>
                                <Typography color="textSecondary">
                                    {expense.description}
                                </Typography>
                                <Typography>
                                    Amount: {expense.amount}
                                </Typography>
                                <Typography>
                                    Date: {expense.date}
                                </Typography>
                                <Typography>
                                    Category: {expense.category}
                                </Typography>
                                <IconButton onClick={() => handleDelete(expense.id)}>
                                    <Delete />
                                </IconButton>
                                <IconButton onClick={() => handleEdit(expense.id)}>
                                    <Edit />
                                </IconButton>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box
                display="flex"
                justifyContent="center"
                style={{marginTop:'15px'}}
            >
            {(pageNumber > totalPages) || (expenseList.length == 0) ? (
            
            <Typography variant="body1">No more data</Typography>
            ) : (                
            <CircularProgress size={80} thickness={4} /> 
            )}
            </Box>
        
         </>
    );
}

export default ExpenseGrid;
