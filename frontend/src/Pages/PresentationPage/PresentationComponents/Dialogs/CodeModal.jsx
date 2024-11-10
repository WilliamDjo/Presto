import { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Slider,
  Typography,
  Alert
} from '@mui/material';
// import { useDispatch } from 'react-redux';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-c';
import 'prismjs/themes/prism.css';


const addCodeElement = (codeData) => ({
  type: 'presentations/addCodeElement',
  payload: codeData
});

export default function CodeModal({ open, handleClose }) {
//   const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    width: 0.5,
    height: 0.5,
    code: '',
    fontSize: 1
  });
  
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  
  // Detect programming language based on code content
  const detectLanguage = (code) => {
    // Common language indicators
    const indicators = {
      python: {
        keywords: ['def ', 'import ', 'class ', 'print(', '__init__', 'if __name__'],
        syntax: [':', '    ', '#'],
      },
      javascript: {
        keywords: ['function', 'const ', 'let ', 'var ', '=>', 'console.log'],
        syntax: [';', '===', '}}'],
      },
      c: {
        keywords: ['#include', 'int main', 'void', 'printf', 'scanf'],
        syntax: ['{', '};', '#define'],
      }
    };
  
    let scores = {
      python: 0,
      javascript: 0,
      c: 0
    };
  
    // Calculate scores based on indicators
    Object.entries(indicators).forEach(([lang, { keywords, syntax }]) => {
      keywords.forEach(keyword => {
        if (code.includes(keyword)) scores[lang] += 2;
      });
      syntax.forEach(symbol => {
        if (code.includes(symbol)) scores[lang] += 1;
      });
    });
  
    // Get language with highest score
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return null;
      
    return Object.entries(scores).find(([_, score]) => score === maxScore)[0];
  };
  
  // Update preview with syntax highlighting
  useEffect(() => {
    if (formData.code) {
      const language = detectLanguage(formData.code) || 'javascript';
      setDetectedLanguage(language);
        
      const highlighted = Prism.highlight(
        formData.code,
        Prism.languages[language],
        language
      );
        
      setPreview(highlighted);
    } else {
      setPreview('');
      setDetectedLanguage(null);
    }
  }, [formData.code]);
  
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };
  
  const handleSliderChange = (field) => (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      [field]: newValue
    }));
  };
  
  const handleSubmit = () => {
    if (!formData.code.trim()) {
      setError('Please enter some code');
      return;
    }
  
    // dispatch(addCodeElement({
    //   elementSize: {
    //     x: formData.width,
    //     y: formData.height
    //   },
    //   code: formData.code,
    //   fontSize: formData.fontSize,
    //   language: detectedLanguage || 'javascript'
    // }));
  
    handleClose();
    // Reset form
    // setFormData({
    //   width: 0.5,
    //   height: 0.5,
    //   code: '',
    //   fontSize: 1
    // });
    setDetectedLanguage(null);
    setPreview('');
    setError('');
  };
  
  return (
    <div>CodeModal</div>
  )
}
