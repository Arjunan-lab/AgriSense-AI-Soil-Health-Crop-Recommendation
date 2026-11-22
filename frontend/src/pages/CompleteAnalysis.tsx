import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, FileBarChart, RefreshCw, Sprout } from 'lucide-react';
import { PageHeader, SectionCard, EmptyState } from '../components/common/FeedbackStates';
import UploadBox from '../components/Analysis/UploadBox';
import SoilForm from '../components/Analysis/SoilForm';
import PredictionCard from '../components/Analysis/PredictionCard';
import ProbabilityChart from '../components/Analysis/ProbabilityChart';
import HealthCard from '../components/Analysis/HealthCard';
import RecommendationCard from '../components/Analysis/RecommendationCard';
import MetadataCard from '../components/Analysis/MetadataCard';
import LoadingSkeleton from '../components/Analysis/LoadingSkeleton';
import { completeAnalysis } from '../api/analysis';
import { AnalysisResponse, AnalysisFormInputs } from '../types/analysis';
import toast from 'react-hot-toast';

export const CompleteAnalysis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState<number>(0);

  const handleFormSubmit = async (params: AnalysisFormInputs) => {
    if (!selectedFile) {
      toast.error('Please upload a soil image first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await completeAnalysis(selectedFile, params);
      setResult(data);
      toast.success('Soil analysis completed successfully!');
    } catch (err: any) {
      console.error('Soil Analysis Error:', err);
      let readableError = 'An unexpected error occurred. Please try again.';

      if (err.response) {
        const { status, data } = err.response;
        switch (status) {
          case 400:
            readableError = 'Bad Request: The uploaded image is empty, corrupted, or a required parameter is missing.';
            break;
          case 401:
            readableError = 'Unauthorized: Your session has expired. Please log in again.';
            break;
          case 413:
            readableError = 'File Too Large: The soil image exceeds the maximum allowed size of 10 MB.';
            break;
          case 415:
            readableError = 'Unsupported File Format: Only JPG, JPEG, and PNG images are supported.';
            break;
          case 422:
            // Parse default FastAPI validation details
            const detail = data?.detail;
            if (Array.isArray(detail)) {
              const messages = detail.map((d: any) => `${d.loc.join('.')}: ${d.msg}`).join(', ');
              readableError = `Validation Error: ${messages}`;
            } else {
              readableError = 'Validation Error: One or more fields are out of bounds or incorrectly formatted.';
            }
            break;
          case 500:
            readableError = 'Server Inference Error: The AI pipeline encountered an internal error. Please try again later.';
            break;
          default:
            readableError = data?.detail || data?.message || `Server Error (${status}): Unable to process analysis.`;
        }
      } else {
        readableError = err.message || 'Network Error: Unable to connect to the server. Please check your network connection.';
      }

      setError(readableError);
      toast.error(readableError);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setFormKey((prev) => prev + 1); // Triggers re-mount of form to reset fields
    toast.success('Workspace cleared.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Complete Analysis"
        subtitle="Combine AI visual diagnostics and chemical metrics to generate a comprehensive soil health report."
      />

      {/* Main split layout: 50% / 50% split on xl screen, stacked on tablet/mobile */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Input Form and UploadBox */}
        <SectionCard title="Soil Information & Imagery">
          <div className="space-y-6">
            <UploadBox
              selectedFile={selectedFile}
              onFileChange={setSelectedFile}
              disabled={loading}
            />
            
            <hr className="border-slate-100 dark:border-slate-800/80 my-2" />
            
            <SoilForm
              key={formKey}
              onSubmit={handleFormSubmit}
              isLoading={loading}
              isUploading={false}
              hasImage={!!selectedFile}
            />
          </div>
        </SectionCard>

        {/* Right Side: Results Panel */}
        <div className="space-y-6 min-w-0">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                  <RefreshCw className="h-4 w-4 animate-spin text-primary-500" />
                  <span>Processing neural networks & CatBoost algorithms...</span>
                </div>
                <LoadingSkeleton />
              </motion.div>
            )}

            {error && !loading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center p-8 border border-rose-100 dark:border-rose-950/20 rounded-card bg-rose-50/15 dark:bg-rose-950/5 shadow-soft"
              >
                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full mb-4">
                  <AlertTriangle className="h-10 w-10" />
                </div>
                <h3 className="text-base font-bold text-rose-800 dark:text-rose-350 mb-1.5">
                  Analysis Failed
                </h3>
                <p className="text-xs text-rose-600/70 dark:text-rose-450/70 max-w-md leading-relaxed mb-6">
                  {error}
                </p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Clear & Try Again
                </button>
              </motion.div>
            )}

            {result && !loading && !error && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Results Header Action Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-650 dark:text-emerald-400">
                    <FileBarChart className="h-4.5 w-4.5" />
                    <span className="text-xs font-extrabold uppercase tracking-wider">
                      Diagnosis Computed
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center space-x-1 px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Start New Analysis</span>
                  </button>
                </div>

                {/* Dashboard / History results dashboard grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Soil prediction column */}
                  <div className="space-y-6">
                    <PredictionCard
                      predictedSoil={result.predicted_soil}
                      confidence={result.confidence}
                    />
                    <ProbabilityChart probabilities={result.probabilities} />
                  </div>
                  
                  {/* Diagnostics column */}
                  <div className="space-y-6">
                    <HealthCard
                      soilHealthScore={result.soil_health_score}
                      soilHealthClass={result.soil_health_class}
                      soilFertility={result.soil_fertility}
                      nutrientDeficiency={result.nutrient_deficiency}
                    />
                    <RecommendationCard
                      recommendedCrop={result.recommended_crop}
                      cropReason={result.crop_reason}
                      recommendations={result.recommendations}
                    />
                  </div>
                </div>

                {/* Metadata details / PDF exporter card */}
                <MetadataCard
                  analysisId={result.analysis_id}
                  analysisTime={result.analysis_time}
                  processingTimeMs={result.processing_time_ms}
                />
              </motion.div>
            )}

            {!result && !loading && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState
                  title="Awaiting Soil Diagnostics"
                  description="Upload a representative soil image and populate the chemical parameters on the left to start the deep learning analysis pipeline."
                  icon={Sprout}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default CompleteAnalysis;
