import { ExternalLink, Star, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  name: string;
  description: string;
  url: string;
  score: number;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  totalRecords: number;
}

export const SearchResults = ({ results, query, totalRecords }: SearchResultsProps) => {
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-accent/30 text-accent-foreground px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return "bg-gradient-secondary text-accent-foreground";
    if (score >= 8) return "bg-primary/80 text-primary-foreground";
    if (score >= 7) return "bg-secondary text-secondary-foreground";
    return "bg-muted text-muted-foreground";
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Sonuç bulunamadı</h3>
        <p className="text-muted-foreground mb-2">
          "{query}" için herhangi bir kayıt bulunamadı.
        </p>
        <p className="text-sm text-muted-foreground">
          💡 Daha genel terimler deneyin: "AI", "automation", "workflow" gibi
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Arama Sonuçları ({results.length})
        </h3>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          "{query}" için sonuçlar
        </Badge>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {results.map((result, index) => (
          <Card 
            key={index} 
            className="p-2 sm:p-6 bg-gradient-card backdrop-blur-lg border border-border/50 hover:shadow-elevated transition-all duration-300 group animate-scale-in rounded-lg sm:rounded-xl w-full max-w-full overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 sm:mb-4 gap-2 sm:gap-0 w-full max-w-full">
              <div className="flex-1 min-w-0 w-full max-w-full">
                <h4 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2 group-hover:text-primary transition-colors truncate w-full max-w-full">
                  {highlightText(result.name, query)}
                </h4>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-3 w-full max-w-full">
                  {highlightText(result.description, query)}
                </p>
              </div>
              <div className="flex items-center space-x-2 sm:ml-4">
                <Badge className={`${getScoreColor(result.score)} flex items-center space-x-1 px-2 py-1 text-xs sm:text-sm`}>
                  <Star className="w-3 h-3" />
                  <span>{result.score}</span>
                </Badge>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 w-full max-w-full">
              <div className="text-xs text-muted-foreground truncate flex-1 mr-0 sm:mr-4 w-full max-w-full">
                {result.url}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary hover:text-primary-foreground transition-all duration-300 px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm"
                onClick={() => window.open(result.url, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Aç
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};