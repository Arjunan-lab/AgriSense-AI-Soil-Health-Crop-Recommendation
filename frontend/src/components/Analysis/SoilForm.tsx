import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Beaker,
  Sparkles,
  Zap,
  Gauge,
  Leaf,
  Activity,
  Thermometer,
  Droplets,
  Sprout
} from 'lucide-react';
import Input from '../common/Input';
import { Spinner } from '../common/Loader';
import { AnalysisFormInputs } from '../../types/analysis';

const soilFormSchema = z.object({
  nitrogen: z.coerce.number({ invalid_type_error: 'Nitrogen content is required' })
    .min(0, 'Nitrogen must be between 0 and 500')
    .max(500, 'Nitrogen must be between 0 and 500'),
  phosphorus: z.coerce.number({ invalid_type_error: 'Phosphorus content is required' })
    .min(0, 'Phosphorus must be between 0 and 500')
    .max(500, 'Phosphorus must be between 0 and 500'),
  potassium: z.coerce.number({ invalid_type_error: 'Potassium content is required' })
    .min(0, 'Potassium must be between 0 and 500')
    .max(500, 'Potassium must be between 0 and 500'),
  ph: z.coerce.number({ invalid_type_error: 'pH value is required' })
    .min(0, 'pH must be between 0 and 14')
    .max(14, 'pH must be between 0 and 14'),
  organic_carbon: z.coerce.number({ invalid_type_error: 'Organic Carbon is required' })
    .min(0, 'Organic Carbon must be between 0 and 10')
    .max(10, 'Organic Carbon must be between 0 and 10'),
  electrical_conductivity: z.coerce.number({ invalid_type_error: 'Electrical Conductivity is required' })
    .min(0, 'EC must be between 0 and 10')
    .max(10, 'EC must be between 0 and 10'),
  temperature: z.coerce.number({ invalid_type_error: 'Temperature is required' })
    .min(-20, 'Temperature must be between -20 and 60')
    .max(60, 'Temperature must be between -20 and 60'),
  humidity: z.coerce.number({ invalid_type_error: 'Humidity is required' })
    .min(0, 'Humidity must be between 0 and 100')
    .max(100, 'Humidity must be between 0 and 100'),
});

interface SoilFormProps {
  onSubmit: (data: AnalysisFormInputs) => void;
  isLoading: boolean;
  isUploading: boolean;
  hasImage: boolean;
}

export const SoilForm: React.FC<SoilFormProps> = ({
  onSubmit,
  isLoading,
  isUploading,
  hasImage,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AnalysisFormInputs>({
    resolver: zodResolver(soilFormSchema),
    mode: 'onChange',
  });

  const isSubmitDisabled = !hasImage || isUploading || isLoading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nitrogen Input */}
        <Input
          {...register('nitrogen')}
          type="number"
          step="any"
          label="Nitrogen (N) - kg/ha"
          placeholder="e.g. 150"
          icon={Beaker}
          error={errors.nitrogen}
          disabled={isLoading}
          required
        />

        {/* Phosphorus Input */}
        <Input
          {...register('phosphorus')}
          type="number"
          step="any"
          label="Phosphorus (P) - kg/ha"
          placeholder="e.g. 80"
          icon={Sparkles}
          error={errors.phosphorus}
          disabled={isLoading}
          required
        />

        {/* Potassium Input */}
        <Input
          {...register('potassium')}
          type="number"
          step="any"
          label="Potassium (K) - kg/ha"
          placeholder="e.g. 200"
          icon={Zap}
          error={errors.potassium}
          disabled={isLoading}
          required
        />

        {/* pH Input */}
        <Input
          {...register('ph')}
          type="number"
          step="any"
          label="pH Level"
          placeholder="e.g. 6.5"
          icon={Gauge}
          error={errors.ph}
          disabled={isLoading}
          required
        />

        {/* Organic Carbon Input */}
        <Input
          {...register('organic_carbon')}
          type="number"
          step="any"
          label="Organic Carbon (%)"
          placeholder="e.g. 2.5"
          icon={Leaf}
          error={errors.organic_carbon}
          disabled={isLoading}
          required
        />

        {/* Electrical Conductivity Input */}
        <Input
          {...register('electrical_conductivity')}
          type="number"
          step="any"
          label="Electrical Conductivity (dS/m)"
          placeholder="e.g. 1.2"
          icon={Activity}
          error={errors.electrical_conductivity}
          disabled={isLoading}
          required
        />

        {/* Temperature Input */}
        <Input
          {...register('temperature')}
          type="number"
          step="any"
          label="Temperature (°C)"
          placeholder="e.g. 27.5"
          icon={Thermometer}
          error={errors.temperature}
          disabled={isLoading}
          required
        />

        {/* Humidity Input */}
        <Input
          {...register('humidity')}
          type="number"
          step="any"
          label="Relative Humidity (%)"
          placeholder="e.g. 65.0"
          icon={Droplets}
          error={errors.humidity}
          disabled={isLoading}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className={`
          w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-card font-extrabold text-sm shadow-soft transition-all duration-200
          ${isSubmitDisabled
            ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
            : 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white cursor-pointer'}
        `}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="text-white" />
            <span>Analyzing Soil...</span>
          </>
        ) : (
          <>
            <Sprout className="h-4.5 w-4.5 shrink-0" />
            <span>Analyze Soil</span>
          </>
        )}
      </button>

      {!hasImage && (
        <p className="text-center text-xs font-semibold text-rose-500/80 mt-2">
          Please upload a soil image to enable analysis.
        </p>
      )}
    </form>
  );
};

export default SoilForm;
