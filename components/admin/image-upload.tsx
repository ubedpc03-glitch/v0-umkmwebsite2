"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
  disabled?: boolean
  className?: string
}

export function ImageUpload({ value, onChange, onRemove, disabled, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      onChange(data.url)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Gagal mengupload gambar")
    } finally {
      setIsUploading(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          disabled={disabled || isUploading}
          className="w-full bg-transparent"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Mengupload..." : "Upload Gambar"}
        </Button>
        {value && (
          <Button type="button" variant="outline" size="icon" onClick={onRemove} disabled={disabled}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {value && (
        <div className="relative w-full h-64 border rounded-lg overflow-hidden">
          <img src={value || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}

      {!value && (
        <div className="w-full h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Belum ada gambar</p>
          </div>
        </div>
      )}
    </div>
  )
}
