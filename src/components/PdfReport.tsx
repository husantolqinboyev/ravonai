import { FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  content: string;
  transcript?: string;
  accuracy_score?: number;
  fluency_score?: number;
  completeness_score?: number;
  prosody_score?: number;
  overall_score?: number;
  ai_feedback?: string;
  created_at: string;
}

interface PdfReportProps {
  results: TestResult[];
  userName: string;
}

export function PdfReport({ results, userName }: PdfReportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePdf = async () => {
    if (results.length === 0) {
      toast({
        title: "Ma'lumot yo'q",
        description: "Hisobot yaratish uchun test natijalari kerak",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Calculate average scores
      const avgScores = {
        accuracy: 0,
        fluency: 0,
        completeness: 0,
        prosody: 0,
        overall: 0
      };

      let count = 0;
      results.forEach(r => {
        if (r.overall_score) {
          avgScores.accuracy += r.accuracy_score || 0;
          avgScores.fluency += r.fluency_score || 0;
          avgScores.completeness += r.completeness_score || 0;
          avgScores.prosody += r.prosody_score || 0;
          avgScores.overall += r.overall_score || 0;
          count++;
        }
      });

      if (count > 0) {
        avgScores.accuracy = Math.round(avgScores.accuracy / count);
        avgScores.fluency = Math.round(avgScores.fluency / count);
        avgScores.completeness = Math.round(avgScores.completeness / count);
        avgScores.prosody = Math.round(avgScores.prosody / count);
        avgScores.overall = Math.round(avgScores.overall / count);
      }

      // Generate HTML content
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Talaffuz Hisoboti - ${userName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              padding: 40px; 
              color: #1a1a2e;
              background: #fff;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 3px solid #f4a300;
            }
            .logo { 
              font-size: 32px; 
              font-weight: bold;
              color: #f4a300;
              margin-bottom: 8px;
            }
            .subtitle { color: #666; font-size: 14px; }
            .user-info {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 12px;
              margin-bottom: 30px;
            }
            .user-name { font-size: 24px; font-weight: 600; }
            .date { color: #666; font-size: 14px; margin-top: 4px; }
            
            .summary {
              display: grid;
              grid-template-columns: repeat(5, 1fr);
              gap: 15px;
              margin-bottom: 40px;
            }
            .score-card {
              background: linear-gradient(135deg, #f4a300 0%, #22c55e 100%);
              padding: 20px;
              border-radius: 12px;
              text-align: center;
              color: white;
            }
            .score-card.overall {
              background: linear-gradient(135deg, #1a1a2e 0%, #374151 100%);
            }
            .score-value { font-size: 32px; font-weight: bold; }
            .score-label { font-size: 12px; opacity: 0.9; margin-top: 4px; }
            
            .results-title {
              font-size: 20px;
              font-weight: 600;
              margin-bottom: 20px;
              color: #1a1a2e;
            }
            .result-item {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 12px;
              margin-bottom: 15px;
              border-left: 4px solid #f4a300;
            }
            .result-content { 
              font-size: 16px; 
              font-weight: 500;
              margin-bottom: 10px;
              color: #1a1a2e;
            }
            .result-transcript {
              color: #666;
              font-size: 14px;
              margin-bottom: 10px;
              font-style: italic;
            }
            .result-scores {
              display: flex;
              gap: 15px;
              flex-wrap: wrap;
              margin-bottom: 10px;
            }
            .mini-score {
              background: white;
              padding: 8px 12px;
              border-radius: 8px;
              font-size: 13px;
            }
            .mini-score span { font-weight: 600; color: #f4a300; }
            .result-feedback {
              background: #e8f5e9;
              padding: 12px;
              border-radius: 8px;
              font-size: 14px;
              color: #2e7d32;
              margin-top: 10px;
            }
            .result-date { 
              color: #999; 
              font-size: 12px; 
              margin-top: 10px;
            }
            
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #999;
              font-size: 12px;
            }
            
            @media print {
              body { padding: 20px; }
              .result-item { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🎯 Ravon AI</div>
            <div class="subtitle">Ingliz tili talaffuz tahlil tizimi</div>
          </div>
          
          <div class="user-info">
            <div class="user-name">${userName}</div>
            <div class="date">Hisobot sanasi: ${new Date().toLocaleDateString('uz-UZ', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>
          </div>
          
          <div class="summary">
            <div class="score-card">
              <div class="score-value">${avgScores.accuracy}%</div>
              <div class="score-label">To'g'rilik</div>
            </div>
            <div class="score-card">
              <div class="score-value">${avgScores.fluency}%</div>
              <div class="score-label">Ravonlik</div>
            </div>
            <div class="score-card">
              <div class="score-value">${avgScores.completeness}%</div>
              <div class="score-label">To'liqlik</div>
            </div>
            <div class="score-card">
              <div class="score-value">${avgScores.prosody}%</div>
              <div class="score-label">Ohang</div>
            </div>
            <div class="score-card overall">
              <div class="score-value">${avgScores.overall}%</div>
              <div class="score-label">Umumiy</div>
            </div>
          </div>
          
          <div class="results-title">Test natijalari (${results.length} ta)</div>
          
          ${results.map(r => `
            <div class="result-item">
              <div class="result-content">"${r.content}"</div>
              ${r.transcript ? `<div class="result-transcript">Aytilgan: "${r.transcript}"</div>` : ''}
              <div class="result-scores">
                <div class="mini-score">To'g'rilik: <span>${r.accuracy_score || 0}%</span></div>
                <div class="mini-score">Ravonlik: <span>${r.fluency_score || 0}%</span></div>
                <div class="mini-score">To'liqlik: <span>${r.completeness_score || 0}%</span></div>
                <div class="mini-score">Ohang: <span>${r.prosody_score || 0}%</span></div>
                <div class="mini-score">Umumiy: <span>${r.overall_score || 0}%</span></div>
              </div>
              ${r.ai_feedback ? `<div class="result-feedback">💡 ${r.ai_feedback}</div>` : ''}
              <div class="result-date">${new Date(r.created_at).toLocaleString('uz-UZ')}</div>
            </div>
          `).join('')}
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Ravon AI - Talaffuz tahlil tizimi</p>
            <p>Bu hisobot avtomatik yaratilgan</p>
          </div>
        </body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Open in new window for printing
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }

      toast({
        title: "Tayyor!",
        description: "Hisobot yaratildi. PDF sifatida saqlash uchun 'Save as PDF' tanlang."
      });

    } catch (err) {
      console.error('PDF generation error:', err);
      toast({
        title: "Xatolik",
        description: "Hisobot yaratishda xatolik",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={generatePdf}
      disabled={isGenerating || results.length === 0}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4 mr-2" />
      )}
      PDF Hisobot
    </Button>
  );
}
