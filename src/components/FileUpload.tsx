import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface FileUploadProps {
  onDataLoaded: (data: any[]) => void;
}

export const FileUpload = ({ onDataLoaded }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        onDataLoaded(jsonData);
        setIsLoaded(true);
        setIsUploading(false);
        
        toast({
          title: "Dosya başarıyla yüklendi!",
          description: `Güncel olarak ${jsonData.length} kayıt bulundu`,
        });
      } catch (error) {
        setIsUploading(false);
        toast({
          title: "Hata",
          description: "Dosya yüklenirken bir hata oluştu",
          variant: "destructive",
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <div 
        className="relative bg-gradient-card backdrop-blur-lg rounded-xl border border-border/50 p-8 shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer group"
        onClick={triggerFileUpload}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            {isLoaded ? (
              <CheckCircle className="w-16 h-16 text-accent animate-scale-in" />
            ) : (
              <div className="relative">
                <FileSpreadsheet className="w-16 h-16 text-muted-foreground group-hover:text-primary transition-colors" />
                <Upload className="w-6 h-6 text-primary absolute -top-1 -right-1 animate-glow-pulse" />
              </div>
            )}
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isLoaded ? "Dosya Yüklendi!" : "Excel Dosyasını Yükle"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isUploading 
                ? "Yükleniyor..." 
                : isLoaded 
                  ? fileName
                  : ".xlsx veya .xls formatında dosyanızı seçin"
              }
            </p>
          </div>
          
          {!isLoaded && (
            <Button 
              variant="outline" 
              className="mt-4 bg-gradient-primary text-primary-foreground border-none hover:bg-gradient-primary/90"
              disabled={isUploading}
            >
              {isUploading ? "Yükleniyor..." : "Dosya Seç"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};