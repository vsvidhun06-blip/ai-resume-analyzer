import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface UploadZoneProps {
  onFileAccepted: (file: File) => void;
  isLoading?: boolean;
}

export default function UploadZone({ onFileAccepted, isLoading }: UploadZoneProps) {
  const [acceptedFile, setAcceptedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          setError("File too large. Maximum 10MB.");
        } else {
          setError("Invalid file type. Please upload PDF or DOCX.");
        }
        return;
      }
      if (acceptedFiles.length > 0) {
        setAcceptedFile(acceptedFiles[0]);
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: isLoading,
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer
          transition-all duration-300 group
          ${isDragActive
            ? "border-lime-400 bg-lime-400/5 scale-[1.01]"
            : acceptedFile
            ? "border-lime-400/60 bg-lime-400/5"
            : "border-ink-600 hover:border-ink-400 bg-ink-900/40"
          }
          ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-lime-400/40 rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-lime-400/40 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-lime-400/40 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-lime-400/40 rounded-br-lg" />

        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          <div className={`
            w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
            ${acceptedFile ? "bg-lime-400/20 text-lime-400"
              : isDragActive ? "bg-lime-400/20 text-lime-400 scale-110"
              : "bg-ink-800 text-ink-400 group-hover:bg-ink-700 group-hover:text-ink-200"}
          `}>
            {acceptedFile ? <CheckCircle size={28} />
              : isDragActive ? <Upload size={28} className="animate-bounce" />
              : <FileText size={28} />}
          </div>

          {acceptedFile ? (
            <div>
              <p className="text-base font-medium text-lime-400">{acceptedFile.name}</p>
              <p className="text-sm text-ink-400 mt-1">{formatSize(acceptedFile.size)}</p>
            </div>
          ) : isDragActive ? (
            <p className="text-lg font-medium text-lime-400">Drop it here!</p>
          ) : (
            <div>
              <p className="text-base font-medium text-ink-100">
                Drop your resume here, or{" "}
                <span className="text-lime-400 underline underline-offset-2">browse</span>
              </p>
              <p className="text-sm text-ink-400 mt-1.5">PDF or DOCX · Up to 10MB</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-400">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}