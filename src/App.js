import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  TextareaAutosize,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Alert,
  Box,
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";

function App() {
  const [ingredientsText, setIngredientsText] = useState("");
  const [ingredientsData, setIngredientsData] = useState([
    { quantity: "", unit: "", ingredient: "" },
  ]);
  const [newIngredientsData, setNewIngredientsData] = useState([]);
  const containerRef = useRef(null);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  // Scroll to the bottom of the page after each update
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [newIngredientsData]);

  // Parse text input into array of new ingredient objects
  const parseTextIntoNewIngredients = (text) => {
    const parsedIngredients = text
      .split("\n")
      .map((line) => {
        const parts = line.split(" ").filter(Boolean);
        if (parts.length === 3) {
          return {
            quantity: parts[0],
            unit: parts[1],
            ingredient: parts[2],
          };
        }
        return null;
      })
      .filter(Boolean);

    setNewIngredientsData(parsedIngredients);
  };

  // Real-time update on text input changes
  const handleIngredientsChange = (event) => {
    const text = event.target.value;
    setIngredientsText(text);
    parseTextIntoNewIngredients(text);
  };

  // Paste content from the clipboard into text area
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setIngredientsText(text);
      parseTextIntoNewIngredients(text);
    } catch (err) {
      console.error("Failed to read clipboard contents:", err);
    }
  };

  // Clear the text area and reset new ingredients data
  const handleClear = () => {
    setIngredientsText("");
    setNewIngredientsData([]);
  };

  // Add ingredients from new data to main data
  const handleAddIngredients = () => {
    setIngredientsData([...ingredientsData, ...newIngredientsData]);
    setNewIngredientsData([]);
    setIngredientsText("");
    setOpen(true);
  };

  // Handle deleting a row
  const handleDeleteRow = (index) => {
    const updatedData = ingredientsData.filter((_, idx) => idx !== index);
    setIngredientsData(updatedData);
  };

  // Handle adding a new row above the specified index
  const handleAddRowAbove = (index) => {
    const newRow = { quantity: "", unit: "", ingredient: "" };
    const updatedData = [
      ...ingredientsData.slice(0, index),
      newRow,
      ...ingredientsData.slice(index),
    ];
    setIngredientsData(updatedData);
  };

  const handleFieldChange = (index, field, value, isNew = false) => {
    if (isNew) {
      // Modify the newIngredientsData state when it's a new row
      const updatedNewData = [...newIngredientsData];
      updatedNewData[index][field] = value;
      setNewIngredientsData(updatedNewData);
      
      // Update ingredientsText to reflect new ingredient data
      const updatedText = updatedNewData
        .map((item) => `${item.quantity} ${item.unit} ${item.ingredient}`)
        .join("\n");
      setIngredientsText(updatedText); // Update the text field with the latest data
      console.log('new')
    } else {
      // Modify ingredientsData for already confirmed rows
      const updatedData = [...ingredientsData];
      updatedData[index][field] = value;
      setIngredientsData(updatedData);
      console.log('old')
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f1f2f6",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          mt: 2,
          mb: 2,
        }}
        ref={containerRef}
      >
        <Box>
          <Typography sx={{ mt: 6 }} variant="h4" gutterBottom align="center">
            Create New Recipe
          </Typography>

          <TableContainer component={Paper} sx={{ mb: 2, mt: 8 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#4361EE' }}>
                <TableCell sx={{ color: 'white' }}>
                    <strong>Ingredient</strong>
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    <strong>Quantity</strong>
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    <strong>Unit</strong>
                  </TableCell>
                  
                  <TableCell sx={{ color: 'white' }}>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Display confirmed ingredients */}
                {ingredientsData.map((row, index) => (
                  <TableRow key={`confirmed-${index}`}>
                    <TableCell sx={{ backgroundColor: '#f5f5f5' }}>
                      <TextField
                        value={row.ingredient}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            "ingredient",
                            e.target.value, false
                          )
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell sx={{ backgroundColor: '#f5f5f5' }}>
                      <TextField
                        value={row.quantity}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            "quantity",
                            e.target.value, false
                          )}
                        onBlur={(e) =>
                          handleFieldChange(
                            index,
                            "quantity",
                            e.target.value, false
                          )
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell sx={{ backgroundColor: '#f5f5f5' }}>
                      <TextField
                        value={row.unit}
                        onChange={(e) =>
                          handleFieldChange(index, "unit", e.target.value, false)
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    
                    <TableCell sx={{ position: "relative", backgroundColor: '#f5f5f5' }}>
                      {ingredientsData.length > 1 && (
                        <IconButton
                          onClick={() => handleDeleteRow(index)}
                          sx={{ color: "red" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}

                      <Tooltip title="Add Row Above" arrow>
                        <IconButton onClick={() => handleAddRowAbove(index)}>
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Display new, unconfirmed ingredients with green border */}
                {newIngredientsData.map((row, index) => (
                  <TableRow
                    key={`new-${index}`}
                    sx={{ backgroundColor: "#d8f3dc" }}
                  >
                    <TableCell>
                      <TextField
                        value={row.ingredient}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            "ingredient",
                            e.target.value,
                            true
                          )
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={row.quantity}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            "quantity",
                            e.target.value,
                            true
                          )
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={row.unit}
                        onChange={(e) =>
                          handleFieldChange(index, "unit", e.target.value, true)
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    
                    <TableCell
                      sx={{ position: "relative" }}
                    ></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Textarea and Paste / Clear Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <TextareaAutosize
              minRows={4}
              placeholder="Enter ingredients (Quantity Unit Ingredient)"
              value={ingredientsText}
              onChange={handleIngredientsChange}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 2,
                ml: 2,
              }}
            >
              <Button
                variant="contained"
                sx={{ backgroundColor: "#4361ee" }}
                onClick={handlePaste}
              >
                Paste
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ mt: 1 }}
                onClick={handleClear}
              >
                Clear
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Add Ingredients Button */}
        <Button
          variant="contained"
          color="success"
          sx={{ mb: 6 }}
          onClick={handleAddIngredients}
          disabled={newIngredientsData.length === 0}
        >
          Add Ingredients
        </Button>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Ingredients added successfully
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default App;
