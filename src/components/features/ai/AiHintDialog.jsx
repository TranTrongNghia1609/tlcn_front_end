import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2, Loader2, Send, Sparkles, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSanitize from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const normalizePlainMarkdown = (segment) =>
  segment
    .replace(/\n{3,}/g, '\n\n')
    .replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2')
    .replace(/([^\n])\n((?:\d+\.|\-|\*|\+)\s)/g, '$1\n\n$2');

const normalizeHintMarkdown = (value) => {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) {
    const joined = value
      .map((item) => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null)
          return item.content ? String(item.content) : JSON.stringify(item, null, 2);
        return String(item || '');
      })
      .filter(Boolean)
      .join('\n\n');
    return normalizeHintMarkdown(joined);
  }
  if (typeof value === 'object') {
    return value.content
      ? normalizeHintMarkdown(value.content)
      : normalizeHintMarkdown(JSON.stringify(value, null, 2));
  }
  const text = String(value || '');
  if (!text) return '';
  const unified = text.replace(/\r\n/g, '\n').replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');
  return unified
    .split(/(```[\s\S]*?```)/g)
    .map((seg) => (seg.startsWith('```') ? seg : normalizePlainMarkdown(seg)))
    .join('')
    .trim();
};

/** Derives message category from type / source fields */
const getMsgType = (msg) =>
  msg.type === 'chat' || msg.source === 'chat_message' ? 'chat' : 'hint';

const MarkdownContent = ({ content }) => (
  <div className="prose max-w-none text-sm">
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeSanitize, rehypeKatex]}>
      {normalizeHintMarkdown(content)}
    </ReactMarkdown>
  </div>
);

// ---------------------------------------------------------------------------
// ChatBubble
// ---------------------------------------------------------------------------
const ChatBubble = ({ message, formatTime, highlight }) => {
  const isUser = message.role === 'user';
  const type = getMsgType(message);

  return (
    <div
      className={`flex gap-2 transition-all duration-300 ${isUser ? 'flex-row-reverse' : 'flex-row'} ${
        highlight ? 'rounded-lg ring-2 ring-amber-300 ring-offset-1' : ''
      }`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
          isUser ? 'border-amber-300 bg-amber-100 text-amber-700' : 'border-blue-200 bg-blue-50 text-blue-600'
        }`}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>
      <div className={`max-w-[80%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Type badge */}
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
              type === 'chat'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {isUser
              ? type === 'chat' ? 'Câu hỏi' : 'Yêu cầu gợi ý'
              : type === 'chat' ? 'AI Chat' : 'AI Gợi ý'}
          </span>
          {message.errorType && (
            <span className="text-[10px] rounded-full bg-red-100 px-1.5 py-0.5 text-red-600">
              {message.errorType}
            </span>
          )}
        </div>
        {/* Bubble */}
        <div
          className={`rounded-xl px-3 py-2 text-sm leading-relaxed ${
            isUser
              ? 'bg-amber-500 text-white'
              : 'border border-gray-200 bg-white text-gray-800 shadow-sm'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownContent content={message.content} />
          )}
        </div>
        {message.createdAt && (
          <span className="px-1 text-[10px] text-gray-400">{formatTime(message.createdAt)}</span>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sidebar item
// ---------------------------------------------------------------------------
const SidebarItem = ({ msg, index, isSelected, onClick, formatTime }) => {
  const isUser = msg.role === 'user';
  const type = getMsgType(msg);
  const preview = String(msg.content || '').replace(/[#*`>\-_]/g, '').trim().slice(0, 55);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg px-2.5 py-2 text-left transition-colors border ${
        isSelected
          ? 'border-amber-300 bg-amber-50'
          : 'border-transparent hover:border-gray-200 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <div
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
            isUser ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
          }`}
        >
          {isUser ? <User className="h-2.5 w-2.5" /> : <Bot className="h-2.5 w-2.5" />}
        </div>
        <span
          className={`text-[10px] font-semibold rounded px-1 ${
            type === 'chat' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-700'
          }`}
        >
          {isUser
            ? type === 'chat' ? 'Hỏi' : 'Yêu cầu'
            : type === 'chat' ? 'Chat' : 'Gợi ý'}
        </span>
        <span className="ml-auto text-[10px] text-gray-400 shrink-0">
          {formatTime(msg.createdAt)}
        </span>
      </div>
      <p className="text-xs text-gray-500 leading-snug line-clamp-2 pl-5">
        {preview || '(Trống)'}
      </p>
    </button>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const AiHintDialog = ({
  isOpen,
  onOpenChange,
  // Legacy props kept for WorkSpace compat
  problemHintHistory = [],
  selectedHint,
  setSelectedHintKey,
  formatHintTime,
  onRequestMoreHint,
  isRequestingMoreHint = false,
  isHintPending = false,
  isAiHintEnabled = true,
  canRequestMoreHint = false,
  cooldownRemaining = 0,
  isProblemSolved = false,
  // Full conversation
  conversationMessages = [],
  conversationId = null,
  // Chat props
  onSendChatMessage,
  isSendingChat = false,
  chatCooldownRemaining = 0,
  canChat = false,
}) => {
  const [chatInput, setChatInput] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(null);
  // Local pending messages — shown immediately when user sends, cleared when parent prop updates
  const [pendingMessages, setPendingMessages] = useState([]);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const messageRefs = useRef({});

  // Combine DB messages + locally pending ones for display
  const allMessages = [...conversationMessages, ...pendingMessages];

  // When parent updates conversationMessages (after socket refresh from DB), clear pending
  useEffect(() => {
    setPendingMessages([]);
  }, [conversationMessages]);

  const hasMessages = allMessages.length > 0;
  const hasReceivedHint = allMessages.some((m) => m.role === 'assistant');

  const isRequestButtonDisabled =
    isProblemSolved || !canRequestMoreHint || isRequestingMoreHint || isHintPending || cooldownRemaining > 0;
  const shouldShowLoading = isRequestingMoreHint || isHintPending;
  const requestButtonLabel = isProblemSolved
    ? 'Đã hoàn thành bài này'
    : cooldownRemaining > 0
      ? `Đợi ${cooldownRemaining}s`
      : isHintPending
        ? 'AI đang xử lý...'
        : isRequestingMoreHint
          ? 'Đang gửi yêu cầu...'
          : 'Xin thêm gợi ý';

  // Auto-scroll on new messages (allMessages changes when pending is added)
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages.length, isSendingChat]);

  const handleSidebarClick = (idx) => {
    setSelectedIdx(idx);
    messageRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSend = () => {
    const trimmed = chatInput.trim();
    if (!trimmed || isSendingChat || chatCooldownRemaining > 0) return;

    // 1. Immediately add to local pending so dialog shows message right away
    setPendingMessages((prev) => [
      ...prev,
      {
        role: 'user',
        type: 'chat',
        content: trimmed,
        source: 'chat_message',
        createdAt: new Date().toISOString(),
      },
    ]);

    // 2. Notify parent to send to API
    onSendChatMessage?.(trimmed);
    setChatInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-5xl">
        <DialogHeader className="border-b px-6 pt-5 pb-4">
          <DialogTitle className="flex items-center gap-2 text-amber-700">
            <Sparkles className="h-5 w-5" />
            Gợi ý của AI
          </DialogTitle>
          <DialogDescription>
            Gợi ý định hướng
          </DialogDescription>
        </DialogHeader>

        <div className="grid h-[min(78vh,620px)] min-h-0 md:grid-cols-[260px_minmax(0,1fr)]">

          {/* ── LEFT: Conversation info card ── */}
          <div className="flex min-h-0 flex-col border-r bg-gray-50">
            <div className="border-b px-3 py-2.5">
              <p className="text-sm font-semibold text-gray-700">Cuộc trò chuyện</p>
              <p className="text-xs text-gray-400 mt-0.5">Thông tin phiên làm việc với AI</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* Conversation ID */}
              <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">ID cuộc trò chuyện</p>
                {conversationId ? (
                  <div className="flex items-center gap-1.5">
                    <code className="flex-1 rounded bg-gray-100 px-2 py-1 text-[11px] font-mono text-gray-700 break-all leading-relaxed">
                      {conversationId}
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(conversationId);
                      }}
                      title="Copy ID"
                      className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">Chưa có cuộc trò chuyện</p>
                )}
              </div>

              {/* Stats */}
              {allMessages.length > 0 && (() => {
                const hintCount = allMessages.filter(
                  (m) => m.role === 'assistant' && getMsgType(m) === 'hint'
                ).length;
                const chatCount = allMessages.filter(
                  (m) => m.role === 'assistant' && getMsgType(m) === 'chat'
                ).length;
                const userChatCount = allMessages.filter(
                  (m) => m.role === 'user' && getMsgType(m) === 'chat'
                ).length;
                const firstMsg = allMessages[0];
                const lastMsg = allMessages[allMessages.length - 1];

                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm space-y-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Thống kê</p>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-amber-400" />
                          <span className="text-xs text-gray-600">Gợi ý từ AI</span>
                        </div>
                        <span className="text-xs font-semibold text-amber-700">{hintCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-blue-400" />
                          <span className="text-xs text-gray-600">Phản hồi chat</span>
                        </div>
                        <span className="text-xs font-semibold text-blue-700">{chatCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-gray-300" />
                          <span className="text-xs text-gray-600">Câu hỏi của bạn</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-600">{userChatCount}</span>
                      </div>
                    </div>

                    <div className="border-t pt-2 space-y-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Thời gian</p>
                      {firstMsg?.createdAt && (
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Bắt đầu: </span>
                          {formatHintTime(firstMsg.createdAt)}
                        </p>
                      )}
                      {lastMsg?.createdAt && lastMsg !== firstMsg && (
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Cuối: </span>
                          {formatHintTime(lastMsg.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}

              {!conversationId && (
                <div className="rounded-md border border-dashed border-gray-200 px-3 py-4 text-center text-xs text-gray-400">
                  Yêu cầu gợi ý để bắt đầu cuộc trò chuyện.
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Unified conversation thread ── */}
          <div className="flex min-h-0 flex-col">
            {/* Action bar */}
            {isAiHintEnabled && !isProblemSolved && (
              <div className="shrink-0 flex items-center justify-between border-b px-4 py-2">
                {isProblemSolved ? (
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Đã hoàn thành bài này
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">
                    {hasMessages
                      ? 'Cuộn xuống để xem toàn bộ cuộc trò chuyện'
                      : 'Nhấn "Xin thêm gợi ý" để bắt đầu'}
                  </span>
                )}
                <button
                  type="button"
                  onClick={onRequestMoreHint}
                  disabled={isRequestButtonDisabled}
                  className="inline-flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {shouldShowLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {requestButtonLabel}
                </button>
              </div>
            )}

            {/* Messages — single scrollable thread */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {isProblemSolved && (
                <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Bạn đã hoàn thành bài này. Không thể yêu cầu thêm gợi ý.</span>
                </div>
              )}

              {allMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-center text-sm text-gray-400 gap-2">
                  <Sparkles className="h-8 w-8 text-amber-300" />
                  <p>Chưa có cuộc trò chuyện nào.</p>
                  <p className="text-xs">Yêu cầu gợi ý để bắt đầu.</p>
                </div>
              )}

              {allMessages.map((msg, idx) => {
                // Insert divider when switching from hint to chat section
                const prevMsg = allMessages[idx - 1];
                const showDivider =
                  idx > 0 &&
                  getMsgType(msg) === 'chat' &&
                  getMsgType(prevMsg) === 'hint';

                return (
                  <React.Fragment key={idx}>
                    {showDivider && (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="shrink-0 rounded-full border border-gray-200 bg-white px-2 py-0.5">
                          Chat với AI
                        </span>
                        <div className="h-px flex-1 bg-gray-200" />
                      </div>
                    )}
                    <div ref={(el) => (messageRefs.current[idx] = el)}>
                      <ChatBubble
                        message={msg}
                        formatTime={formatHintTime}
                        highlight={selectedIdx === idx}
                      />
                    </div>
                  </React.Fragment>
                );
              })}

              {/* Typing indicator */}
              {isSendingChat && (
                <div className="flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat input — pinned bottom */}
            {hasReceivedHint && isAiHintEnabled && !isProblemSolved && (
              <div className="shrink-0 border-t bg-white px-4 py-3">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      chatCooldownRemaining > 0
                        ? `Đợi ${chatCooldownRemaining}s trước khi gửi tiếp...`
                        : !canChat
                          ? 'Bạn cần có ít nhất 1 gợi ý để chat...'
                          : 'Hỏi AI về bài này (Enter để gửi, Shift+Enter xuống dòng)...'
                    }
                    disabled={!canChat || chatCooldownRemaining > 0 || isSendingChat}
                    rows={1}
                    className="flex-1 resize-none rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-1 focus:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ minHeight: '38px', maxHeight: '96px' }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!chatInput.trim() || !canChat || chatCooldownRemaining > 0 || isSendingChat}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSendingChat ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
                {chatCooldownRemaining > 0 && (
                  <p className="mt-1 text-[11px] text-amber-600">
                    Đợi {chatCooldownRemaining}s trước khi gửi tin nhắn tiếp theo
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AiHintDialog;
