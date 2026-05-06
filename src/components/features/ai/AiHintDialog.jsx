import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSanitize from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const normalizePlainMarkdown = (segment) => {
  return segment
    .replace(/\n{3,}/g, '\n\n')
    .replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2')
    .replace(/([^\n])\n((?:\d+\.|\-|\*|\+)\s)/g, '$1\n\n$2');
};

/**
 * Chuyển đổi giá trị hint thành string markdown hợp lệ.
 * Xử lý trường hợp value là Array (từ conversation context) hoặc Object.
 */
const normalizeHintMarkdown = (value) => {
  if (value === null || value === undefined) return '';

  // Handle Array content
  if (Array.isArray(value)) {
    const joined = value
      .map((item) => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          // Conversation context item: { role, content, createdAt }
          if (item.content) return String(item.content);
          return JSON.stringify(item, null, 2);
        }
        return String(item || '');
      })
      .filter(Boolean)
      .join('\n\n');
    return normalizeHintMarkdown(joined);
  }

  // Handle Object content
  if (typeof value === 'object') {
    if (value.content) return normalizeHintMarkdown(value.content);
    return normalizeHintMarkdown(JSON.stringify(value, null, 2));
  }

  const text = String(value || '');
  if (!text) return '';

  const withUnifiedNewLines = text
    .replace(/\r\n/g, '\n')
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n');

  const segments = withUnifiedNewLines.split(/(```[\s\S]*?```)/g);
  return segments
    .map((segment) => (segment.startsWith('```') ? segment : normalizePlainMarkdown(segment)))
    .join('')
    .trim();
};

const AiHintDialog = ({
  isOpen,
  onOpenChange,
  problemHintHistory,
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
}) => {
  const normalizedHint = normalizeHintMarkdown(selectedHint?.hint);
  const isRequestButtonDisabled = isProblemSolved || !canRequestMoreHint || isRequestingMoreHint || isHintPending || cooldownRemaining > 0;
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-hidden p-0 sm:max-w-5xl">
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-amber-700">
            <Sparkles className="h-5 w-5" />
            Gợi ý của AI
          </DialogTitle>
          <DialogDescription>
            Gợi ý chỉ định hướng cách giải
          </DialogDescription>
        </DialogHeader>

        <div className="grid h-[min(70vh,560px)] min-h-0 md:grid-cols-[280px_minmax(0,1fr)]">
          <div className="min-h-0 overflow-y-auto border-b border-r bg-gray-50 p-3 md:border-b-0">
            <div className="mb-2 text-sm font-semibold text-gray-700">Lịch sử gợi ý</div>
            <div className="space-y-2 pr-1">
              {problemHintHistory.length === 0 ? (
                <div className="rounded-md border border-dashed border-gray-300 px-3 py-4 text-sm text-gray-500">
                  Chưa có gợi ý cho bài này.
                </div>
              ) : (
                problemHintHistory.map((hintItem, index) => {
                  const isActive =
                    selectedHint?.hintKey === hintItem.hintKey;

                  return (
                    <button
                      key={hintItem.hintKey || `${hintItem.submissionId || 'hint'}-${index}`}
                      type="button"
                      onClick={() => setSelectedHintKey(hintItem.hintKey)}
                      className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
                        isActive
                          ? 'border-amber-300 bg-amber-50'
                          : 'border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50/50'
                      }`}
                    >
                      <div className="text-xs font-semibold text-gray-700">
                        {hintItem.submissionId
                          ? `Submission #${String(hintItem.submissionId || '').slice(-6)}`
                          : `Follow-up Hint #${problemHintHistory.length - index}`}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {formatHintTime(hintItem.receivedAt || hintItem.generatedAt)}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto px-6 py-5">
            {isProblemSolved && (
              <div className="mb-4 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Bạn đã hoàn thành bài này. Không thể yêu cầu thêm gợi ý.</span>
              </div>
            )}

            {isAiHintEnabled && !isProblemSolved && (
              <div className="mb-4 flex items-center justify-end">
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

            {selectedHint?.hint ? (
              <>
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                  
                  {selectedHint.errorType && (
                    <span className="rounded-full bg-red-100 px-2 py-1 text-red-700">
                      {selectedHint.errorType}
                    </span>
                  )}
                </div>
                <div className="prose max-w-none text-sm">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeSanitize, rehypeKatex]}
                  >
                    {normalizedHint}
                  </ReactMarkdown>
                </div>
              </>
            ) : (
              <div className="rounded-md border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                Chọn một gợi ý trong danh sách để xem nội dung.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AiHintDialog;

