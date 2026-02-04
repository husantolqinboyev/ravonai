import { useState } from 'react';
import { Volume2, Play, Pause, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const TextToSpeech = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const handleSpeak = () => {
    if (!text.trim()) {
      toast({
        title: "Matn kiriting",
        description: "Iltimos, o'qitish uchun matn kiriting",
        variant: "destructive",
      });
      return;
    }

    if (!('speechSynthesis' in window)) {
      toast({
        title: "Qo'llab-quvvatlanmaydi",
        description: "Brauzeringiz matnni o'qishni qo'llab-quvvatlamaydi",
        variant: "destructive",
      });
      return;
    }

    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;

    // Get English voice if available
    const voices = speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en-'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsLoading(false);
      setIsPlaying(false);
      toast({
        title: "Xatolik",
        description: "Matnni o'qishda xatolik yuz berdi",
        variant: "destructive",
      });
    };

    speechSynthesis.speak(utterance);
  };

  const exampleTexts = [
    "Hello, how are you today?",
    "The weather is beautiful today.",
    "I would like to improve my English pronunciation.",
    "Practice makes perfect.",
  ];

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary">
            <Volume2 className="h-4 w-4" />
            <span className="text-sm font-medium">🔊 Matnni Audioga Aylantirish</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Text to Speech
          </h1>
          <p className="text-muted-foreground">
            Inglizcha matnni tinglang va to'g'ri talaffuzni o'rganing
          </p>
        </div>

        {/* Main Input */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Matn kiriting</CardTitle>
            <CardDescription>
              Inglizcha matn yozing yoki nusxalab qo'ying
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your English text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[150px] resize-none"
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {text.length} / 500
              </span>
              <Button
                onClick={handleSpeak}
                disabled={isLoading || !text.trim()}
                className="min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Yuklanmoqda...
                  </>
                ) : isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    To'xtatish
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Tinglash
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Example Texts */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              📝 Namuna matnlar
            </CardTitle>
            <CardDescription>
              Bosing va matnni sinab ko'ring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exampleTexts.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto py-3 px-4 text-left"
                  onClick={() => setText(example)}
                >
                  <span className="text-sm">{example}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              💡 Maslahatlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Diqqat bilan tinglang va takrorlashga harakat qiling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Og'zaki mashq qilgandan so'ng talaffuzni test qiling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Murakkab so'zlarni alohida tinglang</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TextToSpeech;
