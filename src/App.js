import React, { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';
import VimEditor from './editor/editor';
import Header from './header/header';
import Sidebar from './sidebar/sidebar';
import FinishDialog from './editor/dialog';

function App() {
  const [stepShown, setStepShown] = useState(0);
  const [answerShown, setAnswerShown] = useState(-1);
  const [showDialog, setShowDialog] = useState(false);
  const [challengeData, setChallengeData] = useState(null);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState([]);
  const [language, setLanguage] = useState("python");
  const editorRef = useRef(null);
  const dialogRef = useRef(null);
  const sidebarRef = useRef(null);
  const fetchedRef = useRef(false);
  const buffer = useRef("");
  const currentStepRef = useRef(steps[stepShown] !== undefined ? steps[stepShown] : null);
  const stepCountRef = useRef(0);

  const focusEditor = useCallback(() => {
    if (editorRef.current) {
      if (!showDialog) {
        editorRef.current.focus();
      } else if (dialogRef.current) {
        dialogRef.current.focus();
      }
    } else {
      console.log('editor not mounted');
    }
  }, [showDialog, editorRef, dialogRef]);


  useEffect(() => {
    document.addEventListener('click', focusEditor);

    const fetchChallengeData = () => {
      if (fetchedRef.current) return; // Skip if already fetched
      fetchedRef.current = true;
      setCode("Loading...")

      fetch('https://rvc-server.ooonefolder.workers.dev/api/random_challenge')
        .then(response => response.json())
        .then(data => {
          const item = data[0];
          setChallengeData(item);
          setCode(item.code);
          setTitle(item.title);
          const stepsObj = JSON.parse(item.steps);
          setSteps(stepsObj);
          stepCountRef.current = stepsObj.length;
          currentStepRef.current = stepsObj[0];
          setLanguage(item.language);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          fetchedRef.current = false; // Reset on error to allow retry
        });
    };

    fetchChallengeData();

    return () => {
      document.removeEventListener('click', focusEditor);
    }
  }, [challengeData, fetchedRef, focusEditor]); // Empty dependency array

  useEffect(() => {
    if (steps[stepShown] !== undefined) {
      currentStepRef.current = steps[stepShown];
    } else {
      currentStepRef.current = null;
    }
  }, [stepShown, steps]);

  const nextStep = useCallback(() => {
    if (!stepCountRef || stepCountRef.current === 0) return;
    buffer.current = "";
    setStepShown(current => {
      setAnswerShown(current);
      if (current === stepCountRef.current - 1) {
        setShowDialog(true);
      } else if (current === stepCountRef.current) {
        setShowDialog(true)
        return current
      }
      return current + 1;
    });
    setTimeout(() => {
      sidebarRef.current.scrollToBottom()
    }, 0)
  }, [setAnswerShown, setShowDialog, sidebarRef, stepCountRef]);


  const showAnswer = useCallback(() => {
    setStepShown(current => {
      setAnswerShown(current)
      return current
    })
  }, [])

  return (
    <div className="App bg-stone-950 text-white min-h-screen flex flex-col p-4">
      <Header className="w-full h-16" />
      <div className="flex flex-1 p-2 space-x-6 flex-col md:flex-row">
        <div className="w-full md:w-2/3 p-4 rounded-lg bg-[#1e1e1e] mb-4 md:mb-0 max-h-[90vh] overflow-y-auto">
          <VimEditor nextStep={nextStep} showAnswer={showAnswer} editorRef={editorRef} code={code} language={language} currentStepRef={currentStepRef} buffer={buffer} />
        </div>
        <div className="w-full md:w-1/3 p-4 rounded-lg bg-[#1e1e1e] max-h-[90vh] overflow-y-auto">
          <Sidebar ref={sidebarRef} steps={steps} title={title} stepShown={stepShown} answerShown={answerShown} />
        </div>
      </div>
      <FinishDialog showDialog={showDialog} setShowDialog={setShowDialog} dialogRef={dialogRef} />
    </div>
  );
}

export default App;