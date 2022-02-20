import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeScreen from 'screen/home/HomeScreen';
import LoginScreen from 'screen/Login/LoginScreen';
import PostScreen from 'screen/Post/PostScreen';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from 'assets/styles/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/post" element={<PostScreen />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
