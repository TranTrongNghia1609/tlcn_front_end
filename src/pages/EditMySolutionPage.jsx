import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  X, 
  Plus, 
  Edit,
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  ArrowLeft,
  Code2,
  Save
} from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/atom-one-dark.css';
import 'katex/dist/katex.min.css';

import solutionService from '@/services/solutionService';

const EditMySolutionPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const solutionId = searchParams.get('edit');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    approach: 'other',
    complexity: { time: '', space: '' },
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [solution, setSolution] = useState(null);

  const approaches = [
    { value: 'brute-force', label: 'Brute Force' },
    { value: 'greedy', label: 'Greedy' },
    { value: 'dynamic-programming', label: 'Dynamic Programming' },
    { value: 'divide-conquer', label: 'Divide & Conquer' },
    { value: 'backtracking', label: 'Backtracking' },
    { value: 'graph', label: 'Graph' },
    { value: 'tree', label: 'Tree' },
    { value: 'sorting', label: 'Sorting' },
    { value: 'searching', label: 'Searching' },
    { value: 'math', label: 'Math' },
    { value: 'string', label: 'String' },
    { value: 'array', label: 'Array' },
    { value: 'other', label: 'Other' }
  ];

  const languages = [
    'C++', 'Java', 'Python', 'Python3', 'C', 'C#', 'JavaScript', 
    'TypeScript', 'PHP', 'Swift', 'Kotlin', 'Dart', 'Go', 
    'Ruby', 'Scala', 'Rust', 'Racket', 'Erlang', 'Elixir'
  ];

  useEffect(() => {
    if (solutionId) {
      loadSolution();
    } else {
      toast.error('Không tìm thấy solution ID');
      navigate(`/problemset/problem/${id}`);
    }
  }, [solutionId]);

  const loadSolution = async () => {
    try {
      setLoading(true);
      const response = await solutionService.getSolutionById(solutionId);
      const solutionData = response.data;
      
      console.log('✅ Solution loaded for edit:', solutionData);
      
      setSolution(solutionData);
      setFormData({
        title: solutionData.title || '',
        content: solutionData.content || '',
        approach: solutionData.approach || 'other',
        complexity: {
          time: solutionData.complexity?.time || '',
          space: solutionData.complexity?.space || ''
        },
        tags: solutionData.tags || []
      });
    } catch (error) {
      console.error('❌ Load solution error:', error);
      toast.error('Không thể tải solution');
      navigate(`/problemset/problem/${id}`);
    } finally {
      setLoading(false);
    }
  };

  const insertMarkdown = (syntax, placeholder = '') => {
    const textarea = document.getElementById('solution-content');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end) || placeholder;

    let newText = '';
    let cursorOffset = 0;

    switch (syntax) {
      case 'bold':   newText = `**${selectedText}**`; cursorOffset = selectedText ? 2 : 2; break;
      case 'italic': newText = `*${selectedText}*`;   cursorOffset = selectedText ? 1 : 1; break;
      case 'code':   newText = `\`${selectedText}\``; cursorOffset = selectedText ? 1 : 1; break;
      case 'link':   newText = `[${selectedText || 'text'}](url)`; cursorOffset = selectedText ? selectedText.length + 3 : 6; break;
      case 'image':  newText = `![${selectedText || 'alt'}](url)`; cursorOffset = selectedText ? selectedText.length + 4 : 5; break;
      case 'ul':     newText = `\n- ${selectedText || 'item'}\n`; cursorOffset = selectedText ? 4 : 4; break;
      case 'ol':     newText = `\n1. ${selectedText || 'item'}\n`; cursorOffset = selectedText ? 5 : 5; break;
      case 'h1':     newText = `\n# ${selectedText || 'Heading'}\n`; cursorOffset = 3; break;
      case 'h2':     newText = `\n## ${selectedText || 'Heading'}\n`; cursorOffset = 4; break;
      case 'h3':     newText = `\n### ${selectedText || 'Heading'}\n`; cursorOffset = 5; break;
      case 'codeblock':
        newText = `\n\`\`\`cpp\n${selectedText || '// code'}\n\`\`\`\n`;
        cursorOffset = 10;
        break;
      default: return;
    }

    const newContent = formData.content.slice(0, start) + newText + formData.content.slice(end);
    setFormData(prev => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    }, 0);
  };

  const insertLanguageTemplate = (language) => {
    insertMarkdown('codeblock');
    setTimeout(() => {
      const textarea = document.getElementById('solution-content');
      const val = textarea.value;
      const pos = textarea.selectionStart;

      for (let i = pos; i >= 0; i--) {
        if (val.substring(i, i + 3) === '```') {
          const newVal = val.slice(0, i + 3) + language.toLowerCase() + val.slice(i + 3);
          setFormData(prev => ({ ...prev, content: newVal }));
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(i + 3 + language.length + 1, i + 3 + language.length + 1);
          }, 0);
          break;
        }
      }
    }, 10);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề');
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error('Vui lòng nhập nội dung');
      return;
    }
    
    if (!formData.complexity.time || !formData.complexity.space) {
      toast.error('Vui lòng nhập độ phức tạp');
      return;
    }

    try {
      setSubmitting(true);
      
      await solutionService.updateSolution(solutionId, formData);
      
      toast.success('Cập nhật solution thành công!');
      // Navigate to solutions list instead of detail
      navigate(`/problemset/problem/${id}/solutions/${solutionId}`);
    } catch (err) {
      console.error('❌ Update solution error:', err);
      toast.error(err.response?.data?.message || 'Lỗi khi cập nhật solution');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải solution...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-t sticky top-0 z-10 py-0.5">
        <div className="max-w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              className="cursor-pointer"
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(`/problemset/problem/${id}/solutions/${solutionId}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2 " /> Back
            </Button>
            <div className="flex items-center gap-3">
              <Edit className="w-7 h-7 text-blue-500" />
              <h1 className="text-2xl font-bold">Edit My Solution</h1>
              {solution && (
                <Badge variant="outline" className="bg-blue-50">
                  #{solution.problemShortId}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              className="cursor-pointer hover:bg-gray-100"
              variant="outline" 
              onClick={() => navigate(`/problemset/problem/${id}/solutions/${solutionId}`)} 
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Solution
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT - Editor */}
        <div className="w-1/2 overflow-y-auto bg-white border-r">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Title <span className="text-red-500">*</span></Label>
              <Input
                value={formData.title}
                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                placeholder="VD: Two Pointers + Greedy - O(n) time"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Approach <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.approach} 
                  onValueChange={v => setFormData(p => ({ ...p, approach: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {approaches.map(a => (
                      <SelectItem key={a.value} value={a.value}>
                        {a.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time <span className="text-red-500">*</span></Label>
                <Input
                  className="font-mono"
                  placeholder="O(n log n)"
                  value={formData.complexity.time}
                  onChange={e => setFormData(p => ({ 
                    ...p, 
                    complexity: { ...p.complexity, time: e.target.value } 
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Space <span className="text-red-500">*</span></Label>
                <Input
                  className="font-mono"
                  placeholder="O(1)"
                  value={formData.complexity.space}
                  onChange={e => setFormData(p => ({ 
                    ...p, 
                    complexity: { ...p.complexity, space: e.target.value } 
                  }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags (tối đa 5)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập tag rồi nhấn Enter"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button 
                  className="bg-blue-600"
                  type="button" 
                  onClick={handleAddTag} 
                  disabled={formData.tags.length >= 5}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleRemoveTag(tag)} 
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Content <span className="text-red-500">*</span></Label>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-1 items-center">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => insertMarkdown('bold')} 
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => insertMarkdown('italic')} 
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => insertMarkdown('code')} 
                    title="Code"
                  >
                    <Code className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2" 
                    onClick={() => insertMarkdown('h1')}
                  >
                    H1
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2" 
                    onClick={() => insertMarkdown('h2')}
                  >
                    H2
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2" 
                    onClick={() => insertMarkdown('h3')}
                  >
                    H3
                  </Button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => insertMarkdown('ul')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => insertMarkdown('ol')}
                  >
                    <ListOrdered className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => insertMarkdown('link')}
                  >
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => insertMarkdown('image')}
                  >
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <Select onValueChange={insertLanguageTemplate}>
                    <SelectTrigger className="h-8 w-32 text-xs">
                      <SelectValue placeholder="Code block" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(l => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  id="solution-content"
                  className="min-h-96 font-mono text-sm resize-none border-0 focus:ring-0"
                  value={formData.content}
                  onChange={e => setFormData(p => ({ ...p, content: e.target.value }))}
                  placeholder="Viết solution bằng Markdown..."
                />
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT - Preview */}
        <div className="w-1/2 overflow-y-auto bg-white">
          <div className="px-8 py-6">
            <style>{`
              /* Inline code styling */
              .markdown-preview code:not(pre code) {
                background-color: rgba(253, 230, 138, 0.5);
                color: #b45309;
                padding: 0.15rem 0.4rem;
                border-radius: 0.25rem;
                font-size: 0.9em;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-weight: 500;
                border: 1px solid rgba(251, 191, 36, 0.4);
                white-space: nowrap;
              }

              /* Headers styling */
              .markdown-preview h1 {
                font-size: 2rem;
                font-weight: 700;
                margin-top: 2rem;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 3px solid #3b82f6;
                color: #111827;
              }

              .markdown-preview h2 {
                font-size: 1.5rem;
                font-weight: 700;
                margin-top: 1.75rem;
                margin-bottom: 0.75rem;
                padding-bottom: 0.4rem;
                border-bottom: 2px solid #e5e7eb;
                color: #1f2937;
              }

              .markdown-preview h3 {
                font-size: 1.25rem;
                font-weight: 600;
                margin-top: 1.5rem;
                margin-bottom: 0.5rem;
                color: #374151;
              }

              /* Paragraph and text */
              .markdown-preview p {
                margin: 1rem 0;
                line-height: 1.75;
                color: #374151;
              }

              /* Lists */
              .markdown-preview ul, .markdown-preview ol {
                margin: 1rem 0;
                padding-left: 2rem;
                line-height: 1.75;
              }

              .markdown-preview ul {
                list-style-type: disc;
              }

              .markdown-preview ol {
                list-style-type: decimal;
                list-style-position: outside;
              }

              .markdown-preview li {
                margin: 0.5rem 0;
                color: #374151;
                padding-left: 0.5rem;
              }

              .markdown-preview li::marker {
                color: #6b7280;
                font-weight: 600;
              }

              /* Nested lists */
              .markdown-preview ol ol {
                list-style-type: lower-alpha;
                margin-top: 0.25rem;
              }

              .markdown-preview ol ol ol {
                list-style-type: lower-roman;
              }

              .markdown-preview ul ul {
                list-style-type: circle;
                margin-top: 0.25rem;
              }

              .markdown-preview ul ul ul {
                list-style-type: square;
              }

              /* Links */
              .markdown-preview a {
                color: #2563eb;
                text-decoration: underline;
                font-weight: 500;
              }

              .markdown-preview a:hover {
                color: #1d4ed8;
              }

              /* Code blocks with line numbers */
              .code-block-wrapper {
                margin: 1.5rem 0;
                border-radius: 0.5rem;
                overflow: hidden;
                border: 1px solid #e5e7eb;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }

              .code-block-header {
                background: linear-gradient(to right, #1e293b, #334155);
                color: white;
                padding: 0.75rem 1rem;
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                display: flex;
                align-items: center;
                gap: 0.5rem;
              }

              .code-block-content {
                background: #282c34;
                position: relative;
                overflow-x: auto;
              }

              .code-block-content pre {
                margin: 0 !important;
                padding: 0 !important;
                background: transparent !important;
                overflow: visible !important;
                display: flex;
              }

              .line-numbers {
                padding: 1rem 0;
                text-align: right;
                user-select: none;
                color: #636d83;
                background: #21252b;
                border-right: 1px solid #3e4451;
                min-width: 3rem;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 0.875rem;
                line-height: 1.5;
              }

              .line-numbers span {
                display: block;
                padding: 0 0.75rem;
              }

              .code-content {
                flex: 1;
                padding: 1rem;
                overflow-x: auto;
              }

              .code-content code {
                background: transparent !important;
                color: #abb2bf !important;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 0.875rem !important;
                line-height: 1.5 !important;
                display: block;
                white-space: pre;
              }

              /* Table styling */
              .markdown-preview table {
                width: 100%;
                border-collapse: collapse;
                margin: 1.5rem 0;
                border: 1px solid #e5e7eb;
                border-radius: 0.5rem;
                overflow: hidden;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }

              .markdown-preview thead {
                background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
              }

              .markdown-preview th {
                padding: 0.75rem 1rem;
                text-align: left;
                font-weight: 600;
                font-size: 0.875rem;
                color: #374151;
                border-bottom: 2px solid #d1d5db;
                text-transform: uppercase;
                letter-spacing: 0.025em;
              }

              .markdown-preview td {
                padding: 0.75rem 1rem;
                border-bottom: 1px solid #e5e7eb;
                color: #4b5563;
              }

              .markdown-preview tbody tr:hover {
                background-color: #f9fafb;
              }

              .markdown-preview tbody tr:last-child td {
                border-bottom: none;
              }

              /* Blockquote */
              .markdown-preview blockquote {
                border-left: 4px solid #3b82f6;
                padding-left: 1rem;
                margin: 1.5rem 0;
                color: #6b7280;
                font-style: italic;
              }

              /* Images */
              .markdown-preview img {
                max-width: 100%;
                height: auto;
                border-radius: 0.5rem;
                margin: 1.5rem 0;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }

              /* Math (KaTeX) */
              .markdown-preview .katex {
                font-size: 1.1em;
              }

              .markdown-preview .katex-display {
                margin: 1.5rem 0;
                overflow-x: auto;
                overflow-y: hidden;
              }

              /* Horizontal rule */
              .markdown-preview hr {
                border: none;
                border-top: 2px solid #e5e7eb;
                margin: 2rem 0;
              }

              /* Strong and emphasis */
              .markdown-preview strong {
                font-weight: 700;
                color: #111827;
              }

              .markdown-preview em {
                font-style: italic;
              }
            `}</style>

            <div className="markdown-preview">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
                components={{
                  h1({ children }) {
                    return <h1>{children}</h1>;
                  },
                  h2({ children }) {
                    return <h2>{children}</h2>;
                  },
                  h3({ children }) {
                    return <h3>{children}</h3>;
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto">
                        <table>{children}</table>
                      </div>
                    );
                  },
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    
                    if (!inline && match) {
                      const code = String(children).replace(/\n$/, '');
                      const lines = code.split('\n');
                      const lineNumbers = lines.map((_, i) => i + 1);

                      return (
                        <div className="code-block-wrapper">
                          <div className="code-block-header">
                            <Code2 className="w-4 h-4" />
                            {match[1].toUpperCase()}
                          </div>
                          <div className="code-block-content">
                            <pre>
                              <div className="line-numbers">
                                {lineNumbers.map(num => (
                                  <span key={num}>{num}</span>
                                ))}
                              </div>
                              <div className="code-content">
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </div>
                            </pre>
                          </div>
                        </div>
                      );
                    }

                    return inline ? (
                      <code {...props}>{children}</code>
                    ) : (
                      <code className={className} {...props}>{children}</code>
                    );
                  }
                }}
              >
                {formData.content || '*Preview sẽ hiện ở đây khi bạn nhập nội dung...*'}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMySolutionPage;