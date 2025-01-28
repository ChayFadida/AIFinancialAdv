import React, { useState } from 'react';
import { 
    Container, 
    Typography, 
    TextField, 
    Button, 
    Box, 
    Paper, 
    Alert, 
    Snackbar 
} from '@mui/material';
import axios from 'axios';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/contact', formData);
            setSnackbar({
                open: true,
                message: 'Message sent successfully!',
                severity: 'success'
            });
            // Clear form after successful submission
            setFormData({
                name: '',
                email: '',
                message: ''
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to send message. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const isFormValid = formData.name && formData.email && formData.message;

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 8 }}>
                <Typography 
                    variant="h2" 
                    component="h1" 
                    align="center" 
                    gutterBottom
                    sx={{ fontWeight: 'bold', mb: 4 }}
                >
                    Get In Touch
                </Typography>
                
                <Typography 
                    variant="body1" 
                    align="center" 
                    sx={{ mb: 6 }}
                >
                    We value your feedback and are committed to continuously improving our application. 
                    Your insights help us push boundaries and deliver the best possible experience. 
                    Whether you have suggestions, questions, or just want to share your thoughts, 
                    we're here to listen and grow together.
                </Typography>

                <Paper elevation={3} sx={{ p: 4, border:'0.5px solid white' }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            sx={{ mb: 3 }}
                        />
                        
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            sx={{ mb: 3 }}
                        />
                        
                        <TextField
                            fullWidth
                            label="Message"
                            name="message"
                            multiline
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                            required
                            sx={{ mb: 4 }}
                        />
                        
                        <Button 
                            type="submit"
                            variant="contained" 
                            size="large"
                            fullWidth
                            disabled={!isFormValid}
                            sx={{ 
                                py: 1.5,
                                fontSize: '1.1rem'
                            }}
                        >
                            Send Message
                        </Button>
                    </form>
                </Paper>
            </Box>
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}