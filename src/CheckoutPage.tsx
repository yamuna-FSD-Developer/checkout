import React, { useState } from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  TextareaAutosize,
  Button,
  IconButton,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface Product {
  id: number;
  name: string;
  quantity: number;
  discount: number;
  subtotal: number;
  price: number;
}

const CheckoutPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Product 1", quantity: 1, discount: 0, subtotal: 10.0, price: 10.0 },
    { id: 2, name: "Product 2", quantity: 1, discount: 0, subtotal: 20.0, price: 20.0 },
    { id: 3, name: "Product 3", quantity: 1, discount: 0, subtotal: 30.0, price: 30.0 },
  ]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string }>({});

  const updateSubtotal = (index: number) => {
    const updatedProducts = [...products];
    const product = updatedProducts[index];
    product.subtotal = product.quantity * (product.price * (1 - product.discount / 100));
    setProducts(updatedProducts);
  };

  const handleIncrement = (index: number) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index].quantity += 1;
      updateSubtotal(index);
      return updatedProducts;
    });
  };

  const handleDecrement = (index: number) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      if (updatedProducts[index].quantity > 1) {
        updatedProducts[index].quantity -= 1;
        updateSubtotal(index);
      }
      return updatedProducts;
    });
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const total = products.reduce((sum, product) => sum + product.subtotal, 0);

  const validateFields = () => {
    const newErrors: { firstName?: string; lastName?: string; email?: string } = {};
    if (!firstName) newErrors.firstName = 'First Name is required';
    if (!lastName) newErrors.lastName = 'Last Name is required';
    if (!email) newErrors.email = 'Email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      // Proceed with form submission or further actions
      console.log("Form Submitted", { firstName, lastName, email });
    }
  };

  const handleGenerateRequest = () => {
    if (validateFields()) {
      const requestDetails = {
        customer: {
          firstName,
          lastName,
          email,
        },
        products,
        total,
      };

      console.log("Generated Request:", requestDetails);
      alert(JSON.stringify(requestDetails, null, 2)); // Display as formatted JSON
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FAF7F1', minHeight: '100vh' }}>
      <Box sx={{
        padding: { xs: '10px', sm: '20px', md: '30px', lg: '50px' },
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        <Box sx={{
          border: '2px solid black',
          marginBottom: '20px',
          width: 'fit-content',
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: '#c0c0c0',
          },
        }}>
          <Button
            href="/catalog"
            className="productLink"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                color: 'black',
              },
              fontSize: '20px',
              fontFamily: 'sans-serif',
            }}
          >
            RETURN TO PRODUCT CATALOG
          </Button>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ marginBottom: '20px', backgroundColor: '#FAF7F1' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: '950', paddingTop: '10px' }}></TableCell>
                <TableCell sx={{ fontWeight: '950', fontFamily: 'sans-serif', paddingTop: '10px' }}>Product</TableCell>
                <TableCell sx={{ fontWeight: '950', paddingTop: '10px' }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: '950', paddingTop: '10px' }}>Discount(%)</TableCell>
                <TableCell sx={{ fontWeight: '950', paddingTop: '10px' }}>Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <IconButton aria-label="delete" onClick={() => handleDelete(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', paddingRight: '10px' }}>
                      <IconButton
                        aria-label="decrease quantity"
                        onClick={() => handleDecrement(index)}
                        size="small"
                        sx={{ paddingLeft: '2px' }}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        value={product.quantity}
                        inputProps={{ min: 1 }}
                        variant="outlined"
                        size="small"
                        sx={{ width: '70px', minWidth: '60px', textAlign: 'center', backgroundColor: 'white' }}
                        InputProps={{
                          sx: {
                            padding: '0 8px',
                          },
                        }}
                      />
                      <IconButton
                        aria-label="increase quantity"
                        onClick={() => handleIncrement(index)}
                        size="small"
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={product.discount}
                      onChange={(e) => {
                        const newDiscount = Number(e.target.value);
                        setProducts((prevProducts) => {
                          const updatedProducts = [...prevProducts];
                          updatedProducts[index].discount = newDiscount;
                          updateSubtotal(index);
                          return updatedProducts;
                        });
                      }}
                      variant="outlined"
                      size="small"
                      sx={{ width: '90px', backgroundColor: 'white', textAlign: 'center' }}
                      InputProps={{
                        sx: {
                          padding: '0 8px',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ marginRight: '4px' }}>$</Typography>
                      <TextField
                        value={product.subtotal.toFixed(2)}
                        variant="outlined"
                        size="small"
                        sx={{ width: '95px', backgroundColor: 'white', textAlign: 'center' }}
                        InputProps={{
                          sx: {
                            padding: '0 8px',
                          },
                          readOnly: true,
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              {/* Total Row */}
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'right', fontWeight: 'bold' }}>Total:</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ marginRight: '4px' }}>$</Typography>
                    <TextField
                      value={total.toFixed(2)}
                      variant="outlined"
                      size="small"
                      sx={{ width: '95px', backgroundColor: 'white', textAlign: 'center', marginBottom: '10px' }}
                      InputProps={{
                        sx: {
                          padding: '0 8px',
                        },
                        readOnly: true,
                      }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ marginBottom: '45px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                <Typography variant="body1" sx={{ alignSelf: 'flex-start', marginRight: '10px' }}>First Name<span style={{ color: 'red' }}>*</span></Typography>
                <TextField type="text" fullWidth variant="outlined" required value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                <Typography variant="body1" sx={{ alignSelf: 'flex-start', marginRight: '10px' }}>Last Name<span style={{ color: 'red' }}>*</span></Typography>
                <TextField type="text" fullWidth variant="outlined" value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={!!errors.lastName}
                  helperText={errors.lastName} />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                <Typography variant="body1" sx={{ alignSelf: 'flex-start', marginRight: '10px' }}>Email<span style={{ color: 'red' }}>*</span></Typography>
                <TextField type="email" fullWidth variant="outlined" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
            <Typography variant="body1" sx={{ alignSelf: 'flex-start', marginBottom: '5px' }}>Message</Typography>
            <TextareaAutosize
              style={{ width: '75%', padding: '8px', minHeight: '20px' }}
              aria-label="empty textarea"
              placeholder="Enter your message here..."
              minRows={4}
              maxRows={10}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: '10px' }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#C0C0C0', color: 'white', '&:hover': { backgroundColor: '#a6a6a6' } }}
            onClick={handleGenerateRequest}
          >
            Generate Request
          </Button>

          <Button
            variant="contained"
            sx={{ backgroundColor: '#C0C0C0', color: 'white', '&:hover': { backgroundColor: '#a6a6a6' } }}
            onClick={handleSubmit}
          >
            Send Request
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
