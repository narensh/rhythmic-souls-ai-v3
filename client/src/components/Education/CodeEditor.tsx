import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Play, Clock, Database } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const defaultCode = `# AI Chatbot Example
import openai

def chat_response(message):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": message}]
    )
    return response.choices[0].message.content

print(chat_response("Hello, AI!"))`;

export function CodeEditor() {
  const [code, setCode] = useState(defaultCode);
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [executionStats, setExecutionStats] = useState({
    executionTime: '',
    memoryUsage: ''
  });
  const { toast } = useToast();

  const executeCodeMutation = useMutation({
    mutationFn: async (data: { code: string; language: string }) => {
      const response = await apiRequest('POST', '/api/execute-code', data);
      return response.json();
    },
    onSuccess: (data) => {
      setOutput(data.output);
      setExecutionStats({
        executionTime: data.executionTime,
        memoryUsage: data.memoryUsage
      });
    },
    onError: (error) => {
      toast({
        title: "Execution Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRunCode = () => {
    executeCodeMutation.mutate({ code, language });
  };

  return (
    <section id="education" className="py-20 bg-slate-50 dark:bg-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Interactive Learning Platform</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Learn AI and programming with our hands-on code editor
          </p>
        </div>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Code Editor */}
            <div className="p-6">
              <CardHeader className="px-0 pt-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Code Editor</CardTitle>
                  <div className="flex space-x-2">
                    <Badge 
                      variant={language === 'python' ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => setLanguage('python')}
                    >
                      Python
                    </Badge>
                    <Badge 
                      variant={language === 'javascript' ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => setLanguage('javascript')}
                    >
                      JavaScript
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-0">
                <div className="bg-slate-900 rounded-lg overflow-hidden">
                  <div className="flex items-center space-x-2 p-3 bg-slate-800">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="min-h-64 bg-slate-900 text-green-400 font-mono text-sm border-0 resize-none focus:ring-0"
                    placeholder="Enter your code here..."
                  />
                </div>
                <Button 
                  onClick={handleRunCode}
                  disabled={executeCodeMutation.isPending}
                  className="w-full mt-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {executeCodeMutation.isPending ? 'Running...' : 'Run Code'}
                </Button>
              </CardContent>
            </div>

            {/* Output/Results */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-lg">Output</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 min-h-48">
                  <div className="text-green-600 font-mono text-sm whitespace-pre-wrap">
                    {output || '> Ready to execute code...'}
                  </div>
                </div>
                {executionStats.executionTime && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-slate-600 dark:text-slate-400">
                        <Clock className="h-4 w-4 mr-1" />
                        Execution Time:
                      </span>
                      <span className="text-green-600">{executionStats.executionTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-slate-600 dark:text-slate-400">
                        <Database className="h-4 w-4 mr-1" />
                        Memory Usage:
                      </span>
                      <span className="text-blue-600">{executionStats.memoryUsage}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
