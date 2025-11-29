import React from 'react';
import { Link } from 'react-router-dom';

const CommentContentWithMentions = ({ content }) => {
  const parseMentions = (text) => {
    // Match @mention cho đến khi gặp 1 khoảng trắng + chữ cái thường/số/ký tự đặc biệt
    // Hoặc kết thúc chuỗi, hoặc dấu câu
    const mentionRegex = /@([^\s]+(?:\s+[A-Z][^\s]*)*)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      // Add text before mention
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }

      // Add mention
      const mentionText = match[1].trim();
      parts.push({
        type: 'mention',
        content: `@${mentionText}`,
        displayName: mentionText
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }

    return parts;
  };

  const parts = parseMentions(content);

  return (
    <div className="text-gray-800 whitespace-pre-wrap break-words">
      {parts.map((part, index) => {
        if (part.type === 'mention') {
          return (
            <span
              key={index}
              className="text-blue-600 font-medium cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
              }}
              title={`Mention: ${part.displayName}`}
            >
              {part.content}
            </span>
          );
        }
        return <span key={index}>{part.content}</span>;
      })}
    </div>
  );
};

export default CommentContentWithMentions;