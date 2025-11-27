import { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Download, 
  Settings, 
  Maximize2, 
  Minimize2,
  Terminal,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const CodeEditor = ({ 
  initialCode = '', 
  language = 'javascript', 
  theme = 'dark',
  onCodeChange,
  onLanguageChange,
  challenge = null 
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const textareaRef = useRef(null);

  const languages = {
    javascript: { name: 'JavaScript', ext: 'js' },
    python: { name: 'Python', ext: 'py' },
    java: { name: 'Java', ext: 'java' },
    cpp: { name: 'C++', ext: 'cpp' },
    html: { name: 'HTML', ext: 'html' },
    css: { name: 'CSS', ext: 'css' },
    php: { name: 'PHP', ext: 'php' },
    go: { name: 'Go', ext: 'go' },
    rust: { name: 'Rust', ext: 'rs' }
  };

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const spaces = language === 'python' ? '    ' : '  ';
      const newCode = code.substring(0, start) + spaces + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + spaces.length;
      }, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const lines = code.substring(0, start).split('\n');
      const currentLine = lines[lines.length - 1];
      const indent = currentLine.match(/^\s*/)[0];
      
      let extraIndent = '';
      if (currentLine.trim().endsWith('{') || currentLine.trim().endsWith(':')) {
        extraIndent = language === 'python' ? '    ' : '  ';
      }
      
      const newCode = code.substring(0, start) + '\n' + indent + extraIndent + code.substring(start);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 1 + indent.length + extraIndent.length;
      }, 0);
    }
  };

  const executeCode = () => {
    const output = [];
    
    // Decode HTML entities
    const decodeHtml = (html) => {
      const txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    };
    
    switch (language) {
      case 'javascript':
        try {
          // Decode HTML entities in the code
          const decodedCode = decodeHtml(code);
          
          // Create a mock console that captures output
          const mockConsole = {
            log: (...args) => {
              output.push(args.map(arg => String(arg)).join(' '));
            }
          };
          
          // Execute the JavaScript code with mock console
          const executeFunction = new Function('console', decodedCode);
          executeFunction(mockConsole);
          
          return output.length > 0 ? output.join('\n') : 'undefined';
        } catch (err) {
          return `SyntaxError: ${err.message}`;
        }
        
      case 'python':
        try {
          const decodedCode = decodeHtml(code);
          
          const mockPrint = (...args) => {
            output.push(args.map(arg => String(arg).replace(/["']/g, '')).join(' '));
          };
          
          // Convert Python to JavaScript with proper syntax handling
          let jsCode = decodedCode
            // First pass: handle basic syntax
            .replace(/print\(/g, 'mockPrint(')
            .replace(/True/g, 'true')
            .replace(/False/g, 'false')
            .replace(/None/g, 'null')
            .replace(/and/g, '&&')
            .replace(/or/g, '||')
            .replace(/not\s+/g, '!')
            .replace(/#.*/g, '//')
            // Handle variable assignments
            .replace(/(\w+)\s*=\s*([^\n]+)/g, 'let $1 = $2')
            // Handle for loops with string iteration
            .replace(/for\s+(\w+)\s+in\s+(\w+):/g, 'for (let $1 of $2) {')
            // Handle for loops with range
            .replace(/for\s+(\w+)\s+in\s+range\((\d+)\):/g, 'for (let $1 = 0; $1 < $2; $1++) {')
            // Handle if statements
            .replace(/if\s+([^:]+):/g, 'if ($1) {')
            // Handle elif
            .replace(/elif\s+([^:]+):/g, '} else if ($1) {')
            // Handle else
            .replace(/else:/g, '} else {')
            // Handle while loops
            .replace(/while\s+([^:]+):/g, 'while ($1) {')
            // Handle indentation to braces
            .split('\n')
            .map((line, index, lines) => {
              const trimmed = line.trim();
              if (!trimmed || trimmed.startsWith('//')) return '';
              
              const indent = line.match(/^\s*/)[0].length;
              const nextLine = lines[index + 1];
              const nextIndent = nextLine ? nextLine.match(/^\s*/)[0].length : 0;
              
              let result = trimmed;
              
              // Add closing braces when indentation decreases
              if (nextIndent < indent) {
                const diff = Math.floor((indent - nextIndent) / 4);
                result += ' ' + '}'.repeat(diff);
              }
              
              return result;
            })
            .filter(line => line.trim())
            .join('\n')
            // Add final closing braces
            + '}';
          
          // Execute the converted code
          const executeFunction = new Function('mockPrint', jsCode);
          executeFunction(mockPrint);
          
          return output.length > 0 ? output.join('\n') : '';
        } catch (err) {
          return `SyntaxError: ${err.message}`;
        }
        
      case 'java':
        const decodedJavaCode = decodeHtml(code);
        if (!decodedJavaCode.includes('public class') || !decodedJavaCode.includes('public static void main')) {
          return 'Error: Main method not found in class';
        }
        try {
          // Create Java interpreter simulation
          const mockSystemOut = {
            println: (...args) => {
              output.push(args.map(arg => String(arg).replace(/"/g, '')).join(' '));
            }
          };
          
          // Convert Java-like code to JavaScript for execution
          let jsCode = decodedJavaCode
            .replace(/System\.out\.println/g, 'mockSystemOut.println')
            .replace(/public\s+class\s+\w+\s*\{/g, '{')
            .replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{/g, '{')
            .replace(/int\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/String\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/boolean\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/true/g, 'true')
            .replace(/false/g, 'false');
          
          // Execute the converted code
          const executeFunction = new Function('mockSystemOut', jsCode);
          executeFunction(mockSystemOut);
          
          return output.length > 0 ? output.join('\n') : '';
        } catch (err) {
          return `javac: ${err.message}`;
        }
        
      case 'cpp':
        const decodedCppCode = decodeHtml(code);
        if (!decodedCppCode.includes('#include') || !decodedCppCode.includes('int main')) {
          return 'fatal error: no input files\ncompilation terminated.';
        }
        try {
          // Create C++ interpreter simulation
          const mockCout = {
            print: (content) => {
              output.push(String(content).replace(/"/g, ''));
            },
            endl: () => {
              if (output.length > 0 && !output[output.length - 1].endsWith('\n')) {
                output[output.length - 1] += '\n';
              }
            }
          };
          
          // Convert C++-like code to JavaScript for execution
          let jsCode = decodedCppCode
            .replace(/#include\s*<[^>]+>/g, '')
            .replace(/using\s+namespace\s+std;/g, '')
            .replace(/int\s+main\s*\(\)\s*\{/g, '{')
            .replace(/cout\s*<<\s*([^;]+)\s*<<\s*endl/g, (match, content) => {
              return `mockCout.print(${content}); mockCout.endl();`;
            })
            .replace(/cout\s*<<\s*([^;]+)/g, 'mockCout.print($1)')
            .replace(/int\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/string\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/bool\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/return\s+0;/g, '');
          
          // Execute the converted code
          const executeFunction = new Function('mockCout', jsCode);
          executeFunction(mockCout);
          
          return output.length > 0 ? output.join('') : '';
        } catch (err) {
          return `g++: error: ${err.message}`;
        }

      case 'php':
        try {
          const decodedPhpCode = decodeHtml(code);
          
          const mockEcho = (...args) => {
            output.push(args.map(arg => String(arg).replace(/["']/g, '')).join(' '));
          };
          
          let jsCode = decodedPhpCode
            .replace(/<\?php/g, '')
            .replace(/\?>/g, '')
            .replace(/echo\s+([^;]+);/g, 'mockEcho($1);')
            .replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, '$1')
            .replace(/\.\s*=/g, '+=')
            .replace(/\./g, '+');
          
          const executeFunction = new Function('mockEcho', jsCode);
          executeFunction(mockEcho);
          
          return output.length > 0 ? output.join('\n') : 'PHP script executed successfully';
        } catch (err) {
          return `Parse error: ${err.message}`;
        }

      case 'go':
        const decodedGoCode = decodeHtml(code);
        if (!decodedGoCode.includes('package main') || !decodedGoCode.includes('func main')) {
          return 'Error: No main package or function found';
        }
        try {
          const mockFmt = {
            Println: (...args) => {
              output.push(args.map(arg => String(arg).replace(/"/g, '')).join(' '));
            }
          };
          
          let jsCode = decodedGoCode
            .replace(/package\s+main/g, '')
            .replace(/import\s+"fmt"/g, '')
            .replace(/func\s+main\s*\(\)\s*\{/g, '{')
            .replace(/fmt\.Println/g, 'mockFmt.Println')
            .replace(/:=/g, '=')
            .replace(/var\s+(\w+)\s+\w+\s*=/g, 'let $1 =');
          
          const executeFunction = new Function('mockFmt', jsCode);
          executeFunction(mockFmt);
          
          return output.length > 0 ? output.join('\n') : 'Process finished with exit code 0';
        } catch (err) {
          return `Build error: ${err.message}`;
        }

      case 'rust':
        const decodedRustCode = decodeHtml(code);
        if (!decodedRustCode.includes('fn main')) {
          return 'Error: No main function found';
        }
        try {
          const mockPrintln = (...args) => {
            output.push(args.map(arg => String(arg).replace(/"/g, '')).join(' '));
          };
          
          let jsCode = decodedRustCode
            .replace(/fn\s+main\s*\(\)\s*\{/g, '{')
            .replace(/println!\(([^)]+)\)/g, 'mockPrintln($1)')
            .replace(/let\s+mut\s+(\w+)/g, 'let $1')
            .replace(/let\s+(\w+):\s*\w+\s*=/g, 'let $1 =');
          
          const executeFunction = new Function('mockPrintln', jsCode);
          executeFunction(mockPrintln);
          
          return output.length > 0 ? output.join('\n') : 'Process finished with exit code 0';
        } catch (err) {
          return `Compilation error: ${err.message}`;
        }

      case 'html':
        const textContent = code.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                               .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                               .replace(/<[^>]*>/g, ' ')
                               .replace(/\s+/g, ' ')
                               .trim();
        return `HTML Document Rendered\n\nText Content:\n${textContent || 'Empty document'}`;

      case 'css':
        const selectors = code.match(/[^{}]+(?=\{)/g) || [];
        const properties = code.match(/[^{}]*\{([^}]*)\}/g) || [];
        return `CSS Stylesheet Parsed\n\nSelectors: ${selectors.length}\nProperties: ${properties.length}\n\nStatus: Valid`;
        
      default:
        return `Compiler for ${languages[language]?.name || language} not implemented`;
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Compiling...');
    
    setTimeout(() => {
      const result = executeCode();
      setOutput(result);
      setIsRunning(false);
    }, 800);
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput('');
    setTestResults(null);
  };

  const downloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `code.${languages[language]?.ext || 'txt'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className={`bg-slate-900 rounded-lg border border-slate-700 ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <select
            value={language}
            onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
            className="bg-slate-800 text-white px-3 py-1 rounded border border-slate-600 text-sm"
          >
            {Object.entries(languages).map(([key, lang]) => (
              <option key={key} value={key}>{lang.name}</option>
            ))}
          </select>
          <span className="text-slate-400 text-sm">{languages[language]?.ext}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            <Play size={14} />
            <span>{isRunning ? (
              <div className="flex items-center">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                Running...
              </div>
            ) : 'Run'}</span>
          </button>
          
          <button
            onClick={resetCode}
            className="flex items-center space-x-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
          
          <button
            onClick={downloadCode}
            className="flex items-center space-x-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            <Download size={14} />
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            <Settings size={14} />
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center space-x-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-3 border-b border-slate-700 bg-slate-800">
          <div className="flex items-center space-x-4">
            <label className="text-slate-300 text-sm">
              Font Size:
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="ml-2 w-20"
              />
              <span className="ml-2">{fontSize}px</span>
            </label>
          </div>
        </div>
      )}

      {/* Editor and Output Container */}
      <div className="flex h-full">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-4 overflow-hidden">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              className="w-full h-full bg-transparent text-white font-mono resize-none outline-none overflow-auto"
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
              placeholder={`Write your ${languages[language]?.name || language} code here...`}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="w-1/3 border-l border-slate-700 flex flex-col min-w-0">
          <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-800">
            <div className="flex items-center space-x-2">
              <Terminal size={16} className="text-slate-400" />
              <span className="text-slate-300 text-sm font-medium">Output</span>
            </div>
            {testResults && (
              <div className="flex items-center space-x-1">
                {testResults.passed ? (
                  <CheckCircle size={16} className="text-green-500" />
                ) : (
                  <AlertCircle size={16} className="text-red-500" />
                )}
                <span className={`text-sm ${testResults.passed ? 'text-green-500' : 'text-red-500'}`}>
                  {testResults.passed ? 'Tests Passed' : 'Tests Failed'}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4 overflow-auto">
            <pre className="text-slate-300 text-sm font-mono whitespace-pre-wrap break-words">
              {output || 'Run your code to see output here...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;