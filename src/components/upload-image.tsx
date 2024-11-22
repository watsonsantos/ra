"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

export function ImageUpload() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Valida se o arquivo é uma imagem
      if (!file.type.startsWith("image/")) {
        alert("Por favor, carregue um arquivo de imagem válido.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImageUrl(dataUrl);

        // Gera um identificador único para criar a URL do QR Code
        const uniqueId = Date.now().toString(); // Pode ser substituído por UUID
        const arSceneUrl = `${window.location.origin}/ar-scene?id=${uniqueId}`;
        setQrCodeUrl(arSceneUrl);

        // Simule ou implemente o armazenamento do `dataUrl` associado ao `uniqueId`
        // saveImage(uniqueId, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-4 bg-white shadow-md rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="image" className="font-semibold text-gray-700">
          Upload Image
        </Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="cursor-pointer"
        />
      </div>
      {imageUrl && (
        <div className="space-y-4">
          <div className="aspect-square w-full relative border rounded-lg overflow-hidden">
            <Image
              fill
              src={imageUrl}
              alt="Uploaded preview"
              className="object-contain w-full h-full"
            />
          </div>
          <div className="p-4 bg-gray-100 rounded-lg flex justify-center">
            <QRCodeSVG value={qrCodeUrl} size={256} className="w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
