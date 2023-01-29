import React from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
export default function ChatBotPage(){
    // all available config props
    const config ={
      width: "400px",
      height: "500px",
      floating: true,
      headerTitle:"HLE E-commere",
        
    };
  // all available props
    const theme = {
        background: '#f5f8fb',
        fontFamily: 'Helvetica Neue',
        headerBgColor: '#17A2B8',
        headerFontColor: '#fff',
        headerFontSize: '18px',
        botBubbleColor: '#1088e9',
        botFontColor: '#fff',
        userBubbleColor: '#fff',
        userFontColor: '#4a4a4a',
    };
    return(
        <ThemeProvider theme={theme}>
        <ChatBot
            steps={[
                {
                id: '1',
                message: 'What help do you need!',
                trigger: '2',
                },
                {
                    id: '2',
                    options: [
                      { value: 1, label: 'Where is the store address ?', trigger: '3' },
                      { value: 2, label: 'How many is the transportation fee ?', trigger: '4' },
                      { value: 3, label: 'What kind of products does the store include?', trigger: '5' },
                      { value: 4, label: 'How to contact our staff?', trigger: '6' },
                    ],
                },
                {
                    id: '3',
                    message: 'Da Nang, Viet Nam',
                    trigger: '2',
                  },
                  {
                    id: '4',
                    message: 'Shipping fee is $1',
                    trigger: '2',
                  },
                  {
                    id:'5',
                    message: 'Tops, Pants and Accessories such as bags, glasses...',
                    trigger: '2'
                  },
                  {
                    id:'6',
                    component:(
                      <a href='https://www.messenger.com/t/BiBoMart.com.vn'>Click here!</a>
                    ),
                    trigger: '2'
                  }
            ]}
            {...config}
            placeholder="Enter message..."
        />
        </ThemeProvider>
    )
}