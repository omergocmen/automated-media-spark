interface DataRecord {
  name: string;
  description: string;
  url: string;
  score: number;
}

// Gelişmiş arama algoritması
export const advancedSearch = (data: DataRecord[], query: string): DataRecord[] => {
  if (!query.trim()) return [];

  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
  
  const results = data.map(item => {
    let relevanceScore = 0;
    const nameWords = item.name.toLowerCase().split(' ');
    const descWords = item.description.toLowerCase().split(' ');
    
    searchTerms.forEach(term => {
      // Tam eşleşme (en yüksek puan)
      if (item.name.toLowerCase().includes(term)) {
        relevanceScore += 100;
      }
      if (item.description.toLowerCase().includes(term)) {
        relevanceScore += 50;
      }
      
      // Kelime başlangıcı eşleşmesi
      nameWords.forEach(word => {
        if (word.startsWith(term)) {
          relevanceScore += 80;
        }
      });
      descWords.forEach(word => {
        if (word.startsWith(term)) {
          relevanceScore += 40;
        }
      });
      
      // Benzer kelimeler (fuzzy matching)
      nameWords.forEach(word => {
        if (word.includes(term) && word !== term) {
          relevanceScore += 60;
        }
      });
      descWords.forEach(word => {
        if (word.includes(term) && word !== term) {
          relevanceScore += 30;
        }
      });
      
      // Yakın kelimeler (edit distance)
      nameWords.forEach(word => {
        if (editDistance(word, term) <= 2 && word.length > 3) {
          relevanceScore += 40;
        }
      });
      descWords.forEach(word => {
        if (editDistance(word, term) <= 2 && word.length > 3) {
          relevanceScore += 20;
        }
      });
    });
    
    // Çoklu kelime araması bonus
    if (searchTerms.length > 1) {
      const foundTerms = searchTerms.filter(term => 
        item.name.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term)
      );
      const termCoverage = foundTerms.length / searchTerms.length;
      relevanceScore *= (1 + termCoverage);
    }
    
    return {
      ...item,
      relevanceScore: relevanceScore + (item.score * 10) // Orijinal skor da önemli
    };
  });
  
  // Sadece belirli bir eşik üzerindeki sonuçları döndür
  return results
    .filter(item => item.relevanceScore > 20)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 50); // Maksimum 50 sonuç
};

// Levenshtein distance algoritması (kelime benzerliği için)
function editDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else if (j === 0) {
        dp[i][j] = i;
      } else if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i][j - 1], dp[i - 1][j], dp[i - 1][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}

// Arama önerileri
export const getSearchSuggestions = (data: DataRecord[], query: string): string[] => {
  if (!query.trim()) return [];
  
  const allWords = new Set<string>();
  
  data.forEach(item => {
    const words = [
      ...item.name.toLowerCase().split(/\W+/),
      ...item.description.toLowerCase().split(/\W+/)
    ];
    words.forEach(word => {
      if (word.length > 2 && word.includes(query.toLowerCase())) {
        allWords.add(word);
      }
    });
  });
  
  return Array.from(allWords)
    .slice(0, 10)
    .sort((a, b) => a.localeCompare(b));
};