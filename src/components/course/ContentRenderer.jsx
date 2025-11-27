import React from 'react';

const ContentRenderer = ({ content }) => {
  if (!content) return null;

  const parseContent = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Code blocks
      if (trimmedLine.startsWith('```')) {
        const language = trimmedLine.slice(3);
        const codeLines = [];
        i++;
        
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]); // Preserve original indentation
          i++;
        }
        
        elements.push({
          type: 'code',
          language: language || 'javascript',
          content: codeLines.join('\n'),
          key: `code-${elements.length}`
        });
        i++;
        continue;
      }
      
      // Headers
      if (trimmedLine.startsWith('# ')) {
        elements.push({
          type: 'h1',
          content: trimmedLine.slice(2),
          key: `h1-${elements.length}`
        });
      } else if (trimmedLine.startsWith('## ')) {
        elements.push({
          type: 'h2',
          content: trimmedLine.slice(3),
          key: `h2-${elements.length}`
        });
      } else if (trimmedLine.startsWith('### ')) {
        elements.push({
          type: 'h3',
          content: trimmedLine.slice(4),
          key: `h3-${elements.length}`
        });
      }
      // Lists with preserved indentation
      else if (trimmedLine.startsWith('- ')) {
        const listItems = [];
        while (i < lines.length && lines[i].trim().startsWith('- ')) {
          const indent = lines[i].length - lines[i].trimStart().length;
          listItems.push({ text: lines[i].trim().slice(2), indent });
          i++;
        }
        elements.push({
          type: 'ul',
          items: listItems,
          key: `ul-${elements.length}`
        });
        continue;
      }
      // Paragraphs with preserved indentation
      else if (trimmedLine) {
        const indent = line.length - line.trimStart().length;
        const processedContent = trimmedLine.replace(/`([^`]+)`/g, '<code>$1</code>');
        elements.push({
          type: 'p',
          content: processedContent,
          indent: indent,
          key: `p-${elements.length}`
        });
      }
      // Empty lines
      else {
        elements.push({
          type: 'br',
          key: `br-${elements.length}`
        });
      }
      
      i++;
    }
    
    return elements;
  };

  const renderElement = (element) => {
    switch (element.type) {
      case 'h1':
        return (
          <h1 key={element.key} className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            {element.content}
          </h1>
        );
      case 'h2':
        return (
          <h2 key={element.key} className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
            {element.content}
          </h2>
        );
      case 'h3':
        return (
          <h3 key={element.key} className="text-sm sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
            {element.content}
          </h3>
        );
      case 'p':
        return (
          <p 
            key={element.key} 
            className="text-gray-600 dark:text-gray-300 mb-2 sm:mb-3 leading-relaxed text-xs sm:text-sm"
            style={{ paddingLeft: `${(element.indent || 0) * (window.innerWidth < 640 ? 4 : 8)}px` }}
            dangerouslySetInnerHTML={{ __html: element.content }}
          />
        );
      case 'ul':
        return (
          <ul key={element.key} className="list-disc text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 space-y-1 text-xs sm:text-sm">
            {element.items.map((item, index) => (
              <li key={index} style={{ marginLeft: `${item.indent * (window.innerWidth < 640 ? 4 : 8)}px` }} className="list-inside">
                {item.text}
              </li>
            ))}
          </ul>
        );
      case 'br':
        return <div key={element.key} className="mb-2"></div>;
      case 'code':
        return (
          <div key={element.key} className="mb-3 sm:mb-4">
            <div className="bg-gray-800 rounded-t-lg px-2 sm:px-4 py-2 flex items-center justify-between">
              <span className="text-gray-300 text-xs sm:text-sm font-medium">{element.language}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(element.content)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded"
              >
                Copy
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-2 sm:p-4 rounded-b-lg">
              <code className="text-xs sm:text-sm font-mono whitespace-pre-wrap break-words">{element.content}</code>
            </pre>
          </div>
        );
      default:
        return null;
    }
  };

  const elements = parseContent(content);

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      {elements.map(renderElement)}
    </div>
  );
};

export default ContentRenderer;