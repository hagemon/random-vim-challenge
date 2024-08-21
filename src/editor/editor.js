import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

function VimEditor({ nextStep, showAnswer, editorRef }) {
    const [defaultValue, setDefaultValue] = useState('// Loading...');


    useEffect(() => {
        fetch('demo.json')
            .then(response => response.text())
            .then(text => setDefaultValue(text))
            .catch(error => console.error('Error loading default file:', error));
    }, []);

    function handleEditorDidMount(editor) {
        editorRef.current = editor;
        window.require.config({
            paths: {
                "monaco-vim": "https://unpkg.com/monaco-vim/dist/monaco-vim"
            }
        });

        // Add global input method event listeners
        const handleCompositionStart = () => {
            if (editorRef.current) {
                editorRef.current.updateOptions({ readOnly: true });
            }
        };

        const handleCompositionEnd = () => {
            if (editorRef.current) {
                editorRef.current.updateOptions({ readOnly: false });
            }
        };

        document.addEventListener('compositionstart', handleCompositionStart);
        document.addEventListener('compositionend', handleCompositionEnd);


        window.require(["monaco-vim"], function (MonacoVim) {
            const statusNode = document.querySelector(".status-node");
            MonacoVim.initVimMode(editor, statusNode);

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
                            observer.disconnect(); // 设置完属性后停止观察
                        }
                    }
                });
            });
            const config = { childList: true, subtree: true };
            observer.observe(statusNode, config);
            return () => {
                document.removeEventListener('compositionstart', handleCompositionStart);
                document.removeEventListener('compositionend', handleCompositionEnd);
            };
        });
        editor.focus()

    }

    return (
        <div style={{ pointerEvents: 'none' }}>
            <Editor
                height="82vh"
                language="json"
                wrapperClassName='something'
                onMount={handleEditorDidMount}
                defaultValue={defaultValue}
                theme="vs-dark"
                onCompositionStart={() => { console.log('compositionstart') }}
                onCompositionEnd={() => { console.log('compositionend') }}
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
                }}
            />
            <div className="status-node"></div>
        </div>
    );
}

export default VimEditor;