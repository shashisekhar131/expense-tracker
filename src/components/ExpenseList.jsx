import { useEffect,useState } from "react";
import axios from "axios";
import AddExpense from "./AddExpense";
import { Button, IconButton, InputLabel, MenuItem, Modal, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { Delete, Edit } from "@mui/icons-material";
import { BASE_URL } from "../../config";
import ExpenseTable from "./ExpenseTable";
import ExpenseGrid from "./ExpenseGrid";
import { FormControl } from '@mui/material';


export default function ExpenseList(){
    const [expenseList,setExpenseList] = useState([]);
    const [showGrid,setShowGrid] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    
    //expense to be edited or new expense is stored in this state and passed to expense form
    const [currentExpense,setCurrentExpense]= useState({
        title: "",
        description: "",
        amount: "",
        date: "",
        category: ""
      });
    // expense table columns
    
    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };
    const handleResize = () => {
        setShowGrid(window.innerWidth <= 560);
    };

    // Effect to add resize event listener
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    },[]);

    return(
        <div>

            <Modal
                open={modalOpen}
                onClose={closeModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >  
            <div>                          
            <AddExpense
                currentExpense={currentExpense}
                setExpenseList={setExpenseList}                        
                setCurrentExpense={setCurrentExpense}
                setModalOpen ={setModalOpen}
            /> 
            </div>             
            </Modal>
            
            
            {!showGrid && (<FormControl style={{float:'right',margin:'15px'}}>
                <InputLabel id="select-label">View</InputLabel>
                <Select
                    labelId="select-label"
                    value={showGrid ? 'grid' : 'table'}
                    label="View"
                    onChange={e=>setShowGrid(e.target.value === 'grid')}
                >
                    <MenuItem value="table">Table</MenuItem>
                    <MenuItem value="grid">Grid</MenuItem>
                </Select>
            </FormControl>)} 
                
            <div>
               {showGrid?
                (  
                <ExpenseGrid
                openModal={openModal} 
                setModalOpen={setModalOpen} 
                setCurrentExpense={setCurrentExpense} 
                expenseList={expenseList} 
                setExpenseList={setExpenseList}/>
                ):
                (
                
                <ExpenseTable 
                openModal={openModal} 
                setModalOpen={setModalOpen} 
                setCurrentExpense={setCurrentExpense} 
                expenseList={expenseList} 
                setExpenseList={setExpenseList}
                />
                )} 

                 
            </div>

           
        
        </div>
    );
}
