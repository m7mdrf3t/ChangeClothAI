import React from 'react';
import { Download, Eye } from 'lucide-react';
import { ChangeClothesResponse } from '../types';

interface ResultsDisplayProps {
  results: ChangeClothesResponse;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewImage = (url: string) => {
    window.open(url, '_blank');
  };

  if (results.error) {
    return (
      <div className="card">
        <h2>Error</h2>
        <div className="error">
          {results.error}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Results</h2>
      <div className="results-grid">
        {results.resultImgUrl && (
          <div className="result-card">
            <img src={results.resultImgUrl} alt="Transformed Image" />
            <div className="result-card-content">
              <h3>Transformed Image</h3>
              <p>The final result with the new clothing applied to the model.</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button
                  className="btn"
                  onClick={() => handleViewImage(results.resultImgUrl!)}
                >
                  <Eye size={16} />
                  View Full Size
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleDownload(results.resultImgUrl!, 'transformed-image.jpg')}
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
        
        {results.maskImgUrl && (
          <div className="result-card">
            <img src={results.maskImgUrl} alt="Mask Image" />
            <div className="result-card-content">
              <h3>Mask Image</h3>
              <p>The mask showing the areas where the clothing was applied.</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button
                  className="btn"
                  onClick={() => handleViewImage(results.maskImgUrl!)}
                >
                  <Eye size={16} />
                  View Full Size
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleDownload(results.maskImgUrl!, 'mask-image.jpg')}
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
