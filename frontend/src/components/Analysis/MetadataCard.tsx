import React, { useState } from 'react';
import { Card } from '../common/Card';
import { formatDate } from '../../utils/formatters';
import { downloadReport } from '../../api/analysis';
import { FileDown, Cpu, Calendar, Hash } from 'lucide-react';
import { Spinner } from '../common/Loader';
import toast from 'react-hot-toast';

interface MetadataCardProps {
  analysisId: string;
  analysisTime: string;
  processingTimeMs: number;
}

export const MetadataCard: React.FC<MetadataCardProps> = ({
  analysisId,
  analysisTime,
  processingTimeMs,
}) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const filename = `Soil_Analysis_Report_${analysisId}.pdf`;
      await downloadReport(analysisId, filename);
      toast.success('Report downloaded successfully!');
    } catch (err: any) {
      console.error('Failed to download report:', err);
      toast.error('Could not download the PDF report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card animate delay={0.3} className="border-slate-200/50 dark:border-slate-800/60">
      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
        
        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 flex-1 min-w-0">
          {/* Analysis ID */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-lg shrink-0">
              <Hash className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 uppercase block tracking-wider">
                Analysis ID
              </span>
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 truncate block">
                {analysisId}
              </span>
            </div>
          </div>

          {/* Analysis Time */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-lg shrink-0">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 uppercase block tracking-wider">
                Completed At
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate block">
                {formatDate(analysisTime)}
              </span>
            </div>
          </div>

          {/* Processing Time */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-lg shrink-0">
              <Cpu className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 uppercase block tracking-wider">
                Processing Speed
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate block">
                {processingTimeMs.toFixed(0)} ms
              </span>
            </div>
          </div>

        </div>

        {/* Download PDF Button */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className={`
              w-full md:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-card font-extrabold text-xs shadow-soft transition-all duration-200 cursor-pointer
              ${downloading
                ? 'bg-slate-100 text-slate-400 dark:bg-slate-850 dark:text-slate-500 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600 text-white'}
            `}
          >
            {downloading ? (
              <>
                <Spinner size="sm" className="text-slate-450" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4 shrink-0" />
                <span>Download Report</span>
              </>
            )}
          </button>
        </div>

      </div>
    </Card>
  );
};

export default MetadataCard;
