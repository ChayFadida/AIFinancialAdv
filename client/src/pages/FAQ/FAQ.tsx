import React, { useState } from "react";
import { Typography, Box, Paper } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


const faqArray = [
    {
        question: "What is the difference between saving and investing?",
        answer: "Saving involves setting aside money for future use, typically in low-risk accounts with minimal growth, suitable for short-term goals. Investing entails using money to purchase assets like stocks or bonds with the aim of generating returns over time, which is more appropriate for long-term financial objectives."
    },
    {
        question: "How much should I invest?",
        answer: "The amount to invest depends on your financial situation, goals, and risk tolerance. After establishing an emergency fund and managing essential expenses, consider investing as much as you can comfortably afford to achieve your financial objectives."
    },
    {
        question: "What is a stock?",
        answer: "A stock represents a share in the ownership of a company, giving stockholders a claim on part of the company's earnings and assets. Stock prices can fluctuate based on the company's performance and market conditions."
    },
    {
        question: "What is a bond?",
        answer: "A bond is a debt instrument issued by corporations or governments to raise capital. When you purchase a bond, you're lending money to the issuer in exchange for periodic interest payments and the return of the bond's face value at maturity."
    },
    {
        question: "What is diversification, and why is it important?",
        answer: "Diversification involves spreading investments across various asset classes, sectors, or geographies to reduce risk. A diversified portfolio can better withstand market volatility, as the performance of different investments can offset each other."
    },
    {
        question: "Can I time the stock market?",
        answer: "Attempting to time the market—buying low and selling high—is challenging and often unsuccessful. A more effective strategy is to invest regularly and remain invested over the long term, benefiting from the market's overall growth."
    },
    {
        question: "What are mutual funds and ETFs?",
        answer: "Mutual funds are investment vehicles that pool money from multiple investors to purchase a diversified portfolio of stocks, bonds, or other assets, managed by professional fund managers. Exchange-Traded Funds (ETFs) are similar but trade on stock exchanges like individual stocks, often with lower fees and greater flexibility."
    },
    {
        question: "What factors influence stock prices?",
        answer: "Stock prices are affected by various factors, including company performance, economic indicators, interest rates, inflation, political events, and market sentiment. Understanding these factors can help investors make informed decisions."
    },
    {
        question: "How should I track the performance of my investment portfolio?",
        answer: "Regularly monitoring your portfolio is essential. Set clear benchmarks, such as market indices, to compare performance. Utilize tools like spreadsheets or portfolio tracking software to record transactions, dividends, and other relevant information, enabling informed decision-making."
    },
];

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Paper 
            elevation={0}
            sx={{ 
                mb: 2,
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: 'background.paper',
                '&:hover': {
                    backgroundColor: 'action.hover'
                }
            }}
        >
            <Box 
                onClick={() => setIsOpen(!isOpen)}
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    p: 2,
                }}
            >
                <Typography 
                    sx={{ 
                        color: 'text.primary',
                        fontWeight: 500,
                        flex: 1
                    }}
                >
                    {question}
                </Typography>
                {isOpen ? (
                    <RemoveIcon sx={{ color: 'primary.main' }} />
                ) : (
                    <AddIcon sx={{ color: 'primary.main' }} />
                )}
            </Box>
            {isOpen && (
                <Box 
                    sx={{ 
                        p: 2,
                        pt: 0,
                        color: 'text.secondary',
                    }}
                >
                    <Typography>
                        {answer}
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export default function FAQ() {
    return (
        <Box sx={{ 
            maxWidth: 800, 
            margin: '0 auto', 
            padding: 4,
        }}>
            <Typography 
                variant="h4" 
                sx={{ 
                    mb: 1,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    fontWeight: 'bold'
                }}
            >
                Frequently Asked Questions
            </Typography>
            <Typography 
                sx={{ 
                    mb: 4,
                    color: 'text.secondary'
                }}
            >
                Find answers to common questions about stock trading and investments.
            </Typography>
            <Box>
                {faqArray.map((faqItem, index) => (
                    <FAQItem
                        key={index}
                        question={faqItem.question}
                        answer={faqItem.answer}
                    />
                ))}
            </Box>
        </Box>
    );
}