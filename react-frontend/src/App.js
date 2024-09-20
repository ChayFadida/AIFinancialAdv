import React from 'react';
import { MantineProvider, Container, Paper, Text, Button, Stack, Box } from '@mantine/core';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HeaderMenu } from './components/HeaderMenu.tsx';
import { ChatBot } from './components/ChatBot.tsx';

function App() {
  return (
    <MantineProvider theme={{ colorScheme: 'light' }}>
      <Router>
        <HeaderMenu />
        <Routes>
          <Route path="/" element={
            <Container>
              <Stack h={300}
                    bg="var(--mantine-color-body)"
                    align="stretch"
                    justify="center"
                    gap="xl">
                <Paper padding="xl" shadow="xl">
                  <Text size="xl" weight={500}>Welcome to the App</Text>
                  <Text size="xl" color="dimmed">This is a sample application using Mantine components.</Text>
                  <Box mt="xl">
                    <Button variant="filled">Get Started</Button>
                  </Box>
                </Paper>
              </Stack>
            </Container>
          } />
          <Route path="/chatbot" element={<ChatBot />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;