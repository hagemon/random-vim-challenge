import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';


function VimEditor({ nextStep, showAnswer, editorRef, code, language, currentStepRef, buffer }) {
    const [defaultValue, setDefaultValue] = useState('// Loading...');
    const [status, setStatus] = useState("normal");

    useEffect(() => {
        setDefaultValue(code)
        if (editorRef.current) {
            editorRef.current.setValue(code);
            editorRef.current.getModel().setLanguage(language);
        }
    }, [code, editorRef, language])

    function handleEditorDidMount(editor) {
        editorRef.current = editor;
        window.require.config({
            paths: {
                "monaco-vim": "https://unpkg.com/monaco-vim/dist/monaco-vim"
            }
        });

        const compositionStart = () => {
            editorRef.current.updateOptions({ readOnly: true });
        }
        const compositionEnd = () => {
            editorRef.current.updateOptions({ readOnly: false });
        }

        editor.onDidCompositionStart(compositionStart);
        editor.onDidCompositionEnd(compositionEnd);

        window.require(["monaco-vim"], function (MonacoVim) {
            const statusNode = document.querySelector(".status-node");
            const mode = MonacoVim.initVimMode(editor, statusNode);

            const handleKeyPress = (key) => {
                if (status === "insert" || !currentStepRef.current) return;
                const answer = currentStepRef.current.command;
                buffer.current = (buffer.current + key).slice(-answer.length);
                console.log(buffer.current, answer)
                if (buffer.current === answer) {
                    nextStep();
                }
            };

            mode.on("vim-mode-change", (mode) => {
                setStatus(mode);
            });
            mode.on("vim-keypress", handleKeyPress);
            // Add a custom command
            MonacoVim.VimMode.Vim.defineEx("help", "h", showAnswer);
            MonacoVim.VimMode.Vim.defineEx("next", "n", nextStep);



            // Add autocomplete off to the status node
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        const statusInput = statusNode.querySelector('input');
                        if (statusInput) {
                            statusInput.setAttribute('autocomplete', 'nope');
                            statusInput.setAttribute('name', 'new-value');
                            observer.disconnect(); // 设置完属性停止观察
                        }
                    }
                });
            });
            const config = { childList: true, subtree: true };
            observer.observe(statusNode, config);
            return () => {

            };
        });
        editor.focus()

    }

    return (
        <div style={{ pointerEvents: 'none' }}>
            <Editor
                height="82vh"
                language="python"
                wrapperClassName='something'
                onMount={handleEditorDidMount}
                defaultValue={defaultValue}
                theme="vs-dark"
                options={{
                    minimap: {
                        enabled: false,
                    },
                    acceptSuggestionOnCommitCharacter: false,
                    acceptSuggestionOnEnter: false,
                    mouseWheelZoom: false,
                    suggestOnTriggerCharacters: false,
                    quickSuggestions: false,
                    readOnly: false,
                    dragAndDrop: false,
                    contextmenu: false,
                    mouseWheelScrollSensitivity: 0,
                    readOnlyMessage: { value: "Only support English input for now" }
                }}
            />
            <div className="status-node"></div>
        </div>
    );
}

export default VimEditor;