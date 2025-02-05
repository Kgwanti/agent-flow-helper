
import { format } from "date-fns";
import { DocumentActions } from "./DocumentActions";

interface Document {
  id: string;
  filename: string;
  file_path: string;
  size: number;
  created_at: string;
}

interface DocumentsTableProps {
  documents: Document[] | undefined;
  analyzing: string | null;
  onAnalyze: (documentId: string, action: 'analyze' | 'summarize') => Promise<void>;
  onDelete: () => void;
}

export const DocumentsTable = ({
  documents,
  analyzing,
  onAnalyze,
  onDelete,
}: DocumentsTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Filename
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Size
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Uploaded
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {documents?.map((doc) => (
              <tr key={doc.id} className="border-b">
                <td className="px-6 py-4 text-sm">{doc.filename}</td>
                <td className="px-6 py-4 text-sm">
                  {Math.round(doc.size / 1024)} KB
                </td>
                <td className="px-6 py-4 text-sm">
                  {format(new Date(doc.created_at), "PPp")}
                </td>
                <td className="px-6 py-4">
                  <DocumentActions
                    documentId={doc.id}
                    filePath={doc.file_path}
                    analyzing={analyzing}
                    onDelete={onDelete}
                    onAnalyze={onAnalyze}
                  />
                </td>
              </tr>
            ))}
            {!documents?.length && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-muted-foreground"
                >
                  No documents uploaded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
