import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ChatInterface } from "@/components/ChatInterface";
import { SearchResults } from "@/components/SearchResults";
import { Database, MessageCircle } from "lucide-react";

interface DataRecord {
  name: string;
  description: string;
  url: string;
  score: number;
}

const Index = () => {
  const [data, setData] = useState<DataRecord[]>([]);
  const [searchResults, setSearchResults] = useState<DataRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleDataLoaded = (loadedData: any[]) => {
    const formattedData = loadedData.map(item => ({
      name: item.name || "",
      description: item.description || "",
      url: item.url || "",
      score: parseFloat(item.score) || 0,
    }));
    setData(formattedData);
  };

  const handleSearch = (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate search delay for better UX
    setTimeout(() => {
      const filtered = data.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      
      // Sort by score descending, then by relevance
      const sorted = filtered.sort((a, b) => {
        const aRelevance = (a.name.toLowerCase().includes(query.toLowerCase()) ? 2 : 0) +
                          (a.description.toLowerCase().includes(query.toLowerCase()) ? 1 : 0);
        const bRelevance = (b.name.toLowerCase().includes(query.toLowerCase()) ? 2 : 0) +
                          (b.description.toLowerCase().includes(query.toLowerCase()) ? 1 : 0);
        
        if (aRelevance !== bRelevance) return bRelevance - aRelevance;
        return b.score - a.score;
      });
      
      setSearchResults(sorted);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Database className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Excel Arama Uygulaması</h1>
              <p className="text-sm text-muted-foreground">Verilerinizde akıllı arama yapın</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {data.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Excel Verilerinizi Yükleyin
              </h2>
              <p className="text-muted-foreground text-lg">
                2200 kayıtlı Excel dosyanızı yükleyerek başlayın
              </p>
            </div>
            <FileUpload onDataLoaded={handleDataLoaded} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-6 h-[calc(100vh-200px)]">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <div className="flex items-center space-x-2 mb-4">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.length} kayıt yüklendi
                  </span>
                </div>
                <div className="h-[500px]">
                  <ChatInterface
                    onSearch={handleSearch}
                    searchResults={searchResults}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="lg:col-span-3">
              <div className="h-full overflow-y-auto">
                {hasSearched && (
                  <SearchResults 
                    results={searchResults} 
                    query={""} // You might want to track the current query
                  />
                )}
                {!hasSearched && (
                  <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                    <div className="w-24 h-24 bg-gradient-primary/10 rounded-full flex items-center justify-center mb-6">
                      <MessageCircle className="w-12 h-12 text-primary animate-glow-pulse" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Aramaya Başlayın
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                      Sol taraftaki chat arayüzünden arama yapmaya başlayın. 
                      Sonuçlar burada görünecek.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
