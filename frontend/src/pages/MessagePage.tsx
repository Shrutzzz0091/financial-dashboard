import React, { useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
  {
    question: 'How to reset my password?',
    answer: 'To reset your password, go to the login page and click on "Forgot Password". Follow the instructions sent to your email.'
  },
  {
    question: 'How to update my email address?',
    answer: 'Go to Personal Settings > Profile Information and update your email address. Save your profile to apply changes.'
  },
  {
    question: 'How to contact customer support?',
    answer: 'You can use the Customer Care Chat below or email support@yourapp.com.'
  }
];

export default function MessagePage() {
  const [expanded, setExpanded] = useState<string | false>(false);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>Message Center</Typography>
      <Typography variant="h5" sx={{ color: 'white', mb: 1 }}>Email & Password Concerns</Typography>
      <Typography sx={{ color: '#ccc', mb: 3 }}>
        If you have issues with your email or password, please use the FAQ below or contact support.
      </Typography>
      <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>Frequently Asked Questions</Typography>
      <Box sx={{ mb: 4 }}>
        {faqs.map((faq, idx) => (
          <Accordion
            key={faq.question}
            expanded={expanded === faq.question}
            onChange={() => setExpanded(expanded === faq.question ? false : faq.question)}
            sx={{ bgcolor: '#23243a', color: 'white', mb: 1, boxShadow: 'none' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography sx={{ color: 'white', fontWeight: 500 }}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: '#ccc' }}>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>Customer Care Chat</Typography>
      <Paper sx={{ bgcolor: '#23243a', p: 3, minHeight: 200 }}>
        <Box sx={{ mb: 2, display: 'flex' }}>
          <Box sx={{ bgcolor: '#444a3a', color: 'white', px: 2, py: 1, borderRadius: 2, fontWeight: 500 }}>
            Hello! How can I assist you today?
          </Box>
        </Box>
        {/* Future: Add chat input and messages here */}
      </Paper>
    </Box>
  );
} 