

import { useEffect,useState } from "react";
import axios from "axios";
import { Button, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { Delete, Edit } from "@mui/icons-material";
import { BASE_URL } from "../../config";

 function ExpenseTable({openModal,expenseList,setExpenseList,setCurrentExpense,setModalOpen}){

    // delete, edit btn related states
    const [deleteBtnClicked,setDeleteBtnClicked] = useState(false);
    const [editBtnClicked,setEditBtnClicked] = useState(false);
    // store ids of expense that user is chaning
    const [deleteId,setDeleteId] = useState(0);
    const [editId,setEditId] = useState(0);

    const [pageNumber,setPageNumber] = useState(0);
    const [pageLength,setPageLength] = useState(4);
    const [totalCount,setTotalCount] = useState(0);
    const [sortBy, setSortBy] = useState('amount');
    const [sortOrder, setSortOrder] = useState('asc');
    const [minAmount,setMinAmount] = useState(10);
    const [maxAmount,setMaxAmount]  = useState(1000000);
    const [searchText,setSearchText] = useState("");

    const handleChangePageNumber = (event,newPage)=>{
        setPageNumber(parseInt(newPage))
    }
    const handleChangePageLength = (event)=>{
        setPageLength(parseInt(event.target.value));
        setPageNumber(0);
    }

    const columns = [
        {id:'title',name:'Title'},
        {id:'description',name:'Description'},
        {id:'amount',name:'Amount'},
        {id:'date',name:'Date'},
        {id:'category',name:'Category'},
        {id:'actions',name:'Actions'}
    ]

    const handleEdit = (expenseId)=>{
        setEditId(expenseId);                                                      
        setEditBtnClicked(true);    
    }
    const handleDelete = (expenseId) =>{
        setDeleteId(expenseId);    
        setDeleteBtnClicked(true);     
    }
    const handleSort = (columnId) => {
        const newSortOrder = sortBy === columnId && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(columnId);
        setSortOrder(newSortOrder);
    }


    useEffect(() => {
        setExpenseList([]);
        async function getSortedPagedExpenseList() {
        const userId = JSON.parse(localStorage.getItem("loggedInUser")).id;

        // constructing this type of url http://localhost:3006/expenses?userId=f064&_sort=id&_start=0&_end=2
        // json-server doesn't supportsJSON Server does not natively support combined filtering using both _gte and _lte operators in a single query.
        // so filtering separeatly 

        const start = pageNumber * pageLength;
        const end = start + pageLength;
        const sortParam = (sortOrder === 'asc')?sortBy:( '-' + sortBy);

        const response = await axios.get(`${BASE_URL}/expenses?userId=${userId}&_sort=${sortParam}&amount_gte=${minAmount}&_start=${start}&_end=${end}`);
        
        const filteredExpenses = response.data.filter(expense => expense.amount <= maxAmount);
        let finalfilteredExpenses;
        if(searchText.trim() != ''){
            finalfilteredExpenses = filteredExpenses.filter(
                (expense) =>                  
                    expense.title.toLowerCase().includes(searchText) ||
                    expense.description.toLowerCase().includes(searchText) 
                )
         }else{
            finalfilteredExpenses = filteredExpenses;
         }

        const totalExpenses = await axios.get(`${BASE_URL}/expenses?userId=${userId}`);
        

        setTotalCount(totalExpenses.data.length);
        setExpenseList(finalfilteredExpenses);
        }
        getSortedPagedExpenseList();
    }, [pageNumber, pageLength, sortBy, sortOrder,minAmount,maxAmount,searchText]);
  
    
    useEffect(()=>{
          setSortBy('amount');          
    },[minAmount,maxAmount])

    useEffect(()=>{
        async function deleteExpense(){
            const response = await axios.delete(`${BASE_URL}/expenses/${deleteId}`);
            setExpenseList(prev=>prev.filter(expense=> expense.id != deleteId));
            setDeleteBtnClicked(false);
        }
        if(deleteBtnClicked && confirm("sure to delete")) {
            deleteExpense(); 
            setPageNumber(0);          
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

    return(
        
        <>
        <div style={{  marginBottom: '10px' }}>            
            <Button color='primary' variant="contained" style={{ color:'white',padding:'15px 20px',marginTop:'15px'}} onClick={openModal} startIcon={<AddIcon/>}>
                Add Expense                
            </Button>   

             <TextField
                label="min"
                value={minAmount}
                onChange={e => setMinAmount(e.target.value.trim().toLowerCase())}                    
                style={{ margin: '15px',width:'100px' }}
                type="number"
                
                />
            <span>-</span>
            <TextField
                label="max"
                value={maxAmount}
                onChange={e => setMaxAmount(e.target.value.trim().toLowerCase())}                    
                style={{ margin: '15px',width:'100px' }}
                type="number"
                /> 
             <TextField
                label="Search"
                variant="outlined"
                value={searchText}
                onChange={e => setSearchText(e.target.value.trim().toLowerCase())}
                style={{marginTop: '15px',width:'150px'}}
             />
           
        </div>            

        <TableContainer sx={{maxHeight:450}}>
            <Table stickyHeader>
            <TableHead>
            <TableRow>
                {columns.map((column) => (
                    <TableCell key={column.id}>
                    <TableSortLabel
                        active={sortBy === column.id}
                        direction={sortBy === column.id ? sortOrder : 'asc'}
                        onClick={() => handleSort(column.id)}
                    >
                        {column.name}
                    </TableSortLabel>
                </TableCell>
                ))}
            </TableRow>
        </TableHead>
        <TableBody>
            {(expenseList.length >0)?(expenseList
            .map((expense)=>{
                return(
                <TableRow key={expense.id}>
                    {columns && columns.map((column)=>{
                        let value = expense[column.id];                     
                        if(column.id == 'actions') {
                            return (
                            <TableCell key={column.id} >
                                    <IconButton onClick={() => handleDelete(expense.id)}>
                                    <Delete /> 
                                </IconButton>
                                <IconButton onClick={() => handleEdit(expense.id)}>
                                    <Edit />
                                </IconButton>
                                
                            </TableCell>
                            )
                        }else{
                        return <TableCell key={column.id}>{value}</TableCell>                            
                        }
                        
                    })}
                </TableRow>
                )
            })):(
            <TableRow>
                <TableCell colSpan={columns.length} align="center">
                    No expenses found.
                </TableCell>
            </TableRow>
        )}
        </TableBody>
            </Table>
        </TableContainer>
        
        {(expenseList.length >0) &&(<TablePagination
        rowsPerPageOptions={[4,5,10]}
        page={pageNumber}
        rowsPerPage={pageLength}
        count={totalCount}
        component="div"
        onPageChange={handleChangePageNumber}
        onRowsPerPageChange={handleChangePageLength}>
        </TablePagination>)}
      </>
    )
}

export default ExpenseTable;
