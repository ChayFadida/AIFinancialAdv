import { Box, Typography, Link, Stack } from '@mui/material';
import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function About() {
    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 4 }}>
            {/* Introduction */}
            <Typography variant="h4" mb={4}>
                About AI Financial Advisor
            </Typography>
            
            <Typography variant="body1" mb={4}>
                AI Financial Advisor is a final project developed as part of our Bachelor's degree in Software Engineering and Information Systems Engineering. Our platform combines traditional financial data with cutting-edge AI technology to provide comprehensive stock market insights and analysis.
            </Typography>

            {/* Key Features */}
            <Typography variant="h5" mb={2}>
                Key Features
            </Typography>

            <Stack spacing={2} mb={4}>
                <Typography variant="body1">
                    <strong>Personalized Account:</strong> Create your unique profile and customize your stock preferences to receive tailored information and insights about the stocks that matter to you.
                </Typography>

                <Typography variant="body1">
                    <strong>Stock Dashboard:</strong> Access real-time market data including open, high, low, and close information for your selected stocks through an intuitive and comprehensive dashboard.
                </Typography>

                <Typography variant="body1">
                    <strong>News Integration:</strong> Stay informed with the latest news and updates specifically curated for your preferred stocks, ensuring you never miss important market developments.
                </Typography>

                <Typography variant="body1">
                    <strong>AI Chatbot Assistant:</strong> Consult our intelligent chatbot for stock-related queries, market analysis, and investment guidance, available 24/7.
                </Typography>

                <Typography variant="body1">
                    <strong>AI-Powered Reports:</strong> Generate detailed stock analysis reports including Quarterly Reports, News-based Analysis, or comprehensive reports combining both sources using advanced AI technology.
                </Typography>
            </Stack>

            {/* Team Section */}
            <Typography variant="h5" mb={2}>
                Development Team
            </Typography>

            <Stack direction="row" spacing={4} mb={4}>
                <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1">Tomer Lazarovitch</Typography>
                        <Link href="https://www.linkedin.com/in/tomer-lazarovitch-919568263/" target="_blank" color="inherit">
                            <LinkedInIcon />
                        </Link>
                    </Stack>
                </Box>
                <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1">Chay Fadida</Typography>
                        <Link href="https://www.linkedin.com/in/chay-fadida/" target="_blank" color="inherit">
                            <LinkedInIcon />
                        </Link>
                    </Stack>
                </Box>
            </Stack>

            {/* GitHub Link */}
            <Link 
                href="https://github.com/ChayFadida/AIFinancialAdv" 
                target="_blank" 
                sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'inherit', textDecoration: 'none' }}
            >
                <GitHubIcon />
                <Typography>View on GitHub</Typography>
            </Link>
        </Box>
    );
}