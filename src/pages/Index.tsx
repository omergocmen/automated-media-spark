import { useState, useEffect } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { SearchResults } from "@/components/SearchResults";
import { Database, MessageCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sampleData } from "@/data/sampleData";
import { advancedSearch, getSearchSuggestions } from "@/utils/searchUtils";
import { ThemeToggle } from "@/components/ThemeToggle";

interface DataRecord {
  name: string;
  description: string;
  url: string;
  score: number;
}

const Index = () => {
  const [data, setData] = useState<DataRecord[]>(sampleData);
  const [searchResults, setSearchResults] = useState<DataRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  // Skor filtresi için state (tek slider)
  const [minScore, setMinScore] = useState(0);

  useEffect(() => {
    // İlk yüklendiğinde önerileri hazırla
    if (currentQuery.length > 2) {
      const newSuggestions = getSearchSuggestions(data, currentQuery);
      setSuggestions(newSuggestions);
    }
  }, [currentQuery, data]);

  const handleSearch = (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setCurrentQuery(query);
    
    // Simulate search delay for better UX
    setTimeout(() => {
      const results = advancedSearch(data, query);
      setSearchResults(results);
      setIsLoading(false);
    }, 600);
  };

  const loadSampleData = () => {
    setData(sampleData);
  };

  // Skor aralığına göre filtrelenmiş sonuçlar (tek slider: minScore)
  const filteredResults = searchResults.filter(
    (item) => item.score >= minScore
  );

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-lg sticky top-0 z-50 w-full">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow flex-shrink-0">
                <Database className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">Otomasyon Arama Uygulaması</h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">2000+ kayıtta akıllı arama</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <Badge
                variant="outline"
                className="bg-primary/90 text-white border-primary/60 font-semibold shadow-sm dark:bg-white/10 dark:text-white dark:border-primary/60 px-2 py-1 text-xs sm:text-sm"
              >
                Güncel olarak&nbsp;<u> {data.length} </u>&nbsp;kayıt bulunuyor
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-1 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 sm:gap-6 h-auto lg:h-[calc(100vh-200px)]">
          {/* Chat Interface */}
          <div className="lg:col-span-2 w-full mb-6 lg:mb-0">
            <div className="sticky top-20 sm:top-24">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Gelişmiş Arama Motoru
                </span>
              </div>
              <div className="h-[320px] sm:h-[500px]">
                <ChatInterface
                  onSearch={handleSearch}
                  searchResults={searchResults}
                  isLoading={isLoading}
                  suggestions={suggestions}
                />
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3 w-full">
            <div className="h-full overflow-y-auto">
              {/* Skor filtresi arayüzü (tek slider, temaya uygun ve belirgin başlık) */}
              <div className="mb-6 flex flex-col gap-2 animate-fade-in">
                <label className="mb-1 flex items-center gap-2">
                  <span className="text-base font-bold text-foreground tracking-tight drop-shadow-sm">Minimum Skor</span>
                  <span className="ml-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs shadow border border-primary/30 font-semibold">
                    {minScore}+
                  </span>
                </label>
                <div className="flex items-center gap-4 w-full">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={minScore}
                    onChange={e => setMinScore(Number(e.target.value))}
                    className="w-full h-2 bg-primary/30 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow slider-thumb"
                    style={{ accentColor: 'var(--tw-gradient-from, #6366f1)' }}
                  />
                  <span className="text-xs text-foreground font-mono w-8 text-center font-bold">{minScore}</span>
                </div>
                <style>{`
                  input[type=range].slider-thumb::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--tw-gradient-from, #6366f1) 0%, var(--tw-gradient-to, #f472b6) 100%);
                    box-shadow: 0 2px 8px 0 var(--tw-gradient-from, #6366f1aa);
                    border: 3px solid #fff;
                    transition: background 0.3s;
                  }
                  input[type=range].slider-thumb::-moz-range-thumb {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--tw-gradient-from, #6366f1) 0%, var(--tw-gradient-to, #f472b6) 100%);
                    box-shadow: 0 2px 8px 0 var(--tw-gradient-from, #6366f1aa);
                    border: 3px solid #fff;
                    transition: background 0.3s;
                  }
                  input[type=range].slider-thumb::-ms-thumb {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--tw-gradient-from, #6366f1) 0%, var(--tw-gradient-to, #f472b6) 100%);
                    box-shadow: 0 2px 8px 0 var(--tw-gradient-from, #6366f1aa);
                    border: 3px solid #fff;
                    transition: background 0.3s;
                  }
                  input[type=range].slider-thumb:focus::-webkit-slider-thumb {
                    outline: 2px solid var(--tw-gradient-to, #f472b6);
                  }
                `}</style>
              </div>
              {hasSearched && (
                <SearchResults 
                  results={filteredResults}
                  query={currentQuery}
                  totalRecords={data.length}
                />
              )}
              {!hasSearched && (
                <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-primary/10 rounded-full flex items-center justify-center mb-6">
                    <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-primary animate-glow-pulse" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                    Gelişmiş Aramaya Başlayın
                  </h3>
                  <p className="text-muted-foreground max-w-md mb-4 text-xs sm:text-base">
                    Sol taraftaki chat arayüzünden arama yapmaya başlayın. 
                    Fuzzy search, partial matching ve akıllı öneriler ile en doğru sonuçları bulun.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    💡 Örnek aramalar: "n8n workflow", "AI video", "telegram assistant"
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;