import { ImageUpload } from "@/components/upload-image"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">AR Image Viewer</h1>
          <p className="text-muted-foreground">
            Upload an image to generate a QR code. Scan the QR code with your phone to view the image in AR.
          </p>
        </div>
        <ImageUpload />
      </div>
    </main>
  )
}
