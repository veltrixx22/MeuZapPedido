import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, Image as ImageIcon } from 'lucide-react';

interface ImagePickerProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ImagePicker({ value, onChange, label }: ImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimensions
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress as JPEG
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        onChange(compressedBase64);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-medium leading-none">{label}</label>}
      
      <div 
        className="group relative w-full aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden cursor-pointer transition-all hover:border-primary/50"
        onClick={triggerInput}
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white font-bold flex items-center gap-2">
                <Camera className="w-5 h-5" /> Trocar Foto
              </p>
            </div>
            <Button 
              size="icon" 
              variant="destructive" 
              className="absolute top-4 right-4 rounded-full h-10 w-10 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              <X className="w-5 h-5" />
            </Button>
          </>
        ) : (
          <div className="text-center flex flex-col items-center gap-4 p-6">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-lg">Tirar foto do produto</p>
              <p className="text-sm text-muted-foreground underline">ou selecione da galeria</p>
            </div>
          </div>
        )}
      </div>
      
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <p className="text-[10px] text-zinc-500 text-center italic">
        * A foto será salva diretamente no catálogo.
      </p>
    </div>
  );
}
