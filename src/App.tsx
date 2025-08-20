import React, { useState } from 'react';
import { Sparkles, Settings, Info } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import { callChangeClothesApi } from './api/changeClothesApi';
import { uploadImage } from './api/imageUploadApi';
import { AppState, ChangeClothesRequest } from './types';

const initialAppState: AppState = {
  apiKey: '',
  modelImage: { file: null, preview: null, isDragging: false },
  garmentImage: { file: null, preview: null, isDragging: false },
  category: 'upper_body',
  garmentDesc: '',
  isLoading: false,
  results: null,
  error: null,
};

function App() {
  const [state, setState] = useState<AppState>(initialAppState);

  const handleApiKeyChange = (apiKey: string) => {
    setState(prev => ({ ...prev, apiKey }));
  };

  const handleModelImageChange = (modelImage: AppState['modelImage']) => {
    setState(prev => ({ ...prev, modelImage }));
  };

  const handleGarmentImageChange = (garmentImage: AppState['garmentImage']) => {
    setState(prev => ({ ...prev, garmentImage }));
  };

  const handleCategoryChange = (category: AppState['category']) => {
    setState(prev => ({ ...prev, category }));
  };

  const handleGarmentDescChange = (garmentDesc: string) => {
    setState(prev => ({ ...prev, garmentDesc }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.apiKey.trim()) {
      setState(prev => ({ ...prev, error: 'Please enter your API key' }));
      return;
    }

    if (!state.modelImage.file) {
      setState(prev => ({ ...prev, error: 'Please upload a model image' }));
      return;
    }

    if (!state.garmentImage.file) {
      setState(prev => ({ ...prev, error: 'Please upload a garment image' }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      results: null 
    }));

    try {
      // Step 1: Upload model image
      console.log('Uploading model image...');
      const modelUploadResult = await uploadImage(state.modelImage.file);
      if (!modelUploadResult.success) {
        throw new Error(`Failed to upload model image: ${modelUploadResult.error}`);
      }

      // Step 2: Upload garment image
      console.log('Uploading garment image...');
      const garmentUploadResult = await uploadImage(state.garmentImage.file);
      if (!garmentUploadResult.success) {
        throw new Error(`Failed to upload garment image: ${garmentUploadResult.error}`);
      }

      // Step 3: Call ChangeClothesAI API with URLs
      console.log('Calling ChangeClothesAI API...');
      const request: ChangeClothesRequest = {
        modelImg: modelUploadResult.url!,
        garmentImg: garmentUploadResult.url!,
        category: state.category,
        garmentDesc: state.garmentDesc.trim() || undefined,
      };

      const results = await callChangeClothesApi(request, state.apiKey);
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        results 
      }));

      if (results.error) {
        setState(prev => ({ ...prev, error: results.error }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }));
    }
  };

  const handleReset = () => {
    setState(initialAppState);
  };

  const handleTestWithUrls = async () => {
    if (!state.apiKey.trim()) {
      setState(prev => ({ ...prev, error: 'Please enter your API key' }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      results: null 
    }));

    try {
      console.log('Testing with demo URLs...');
      const request: ChangeClothesRequest = {
        modelImg: 'https://persistent.changeclothesai.online/change-clothes-ai/assets/examples/person-tab/women/003.jpg',
        garmentImg: 'https://persistent.changeclothesai.online/change-clothes-ai/assets/examples/garment-tab/dresses/04-01.jpg',
        category: 'dresses',
        garmentDesc: undefined,
      };

      const results = await callChangeClothesApi(request, state.apiKey);
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        results 
      }));

      if (results.error) {
        setState(prev => ({ ...prev, error: results.error }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }));
    }
  };

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <Sparkles size={32} color="white" />
          <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '700' }}>
            ChangeClothesAI
          </h1>
        </div>
        <p style={{ color: 'white', fontSize: '1.2rem', opacity: 0.9 }}>
          Transform your wardrobe with AI-powered clothing changes
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        {/* API Key Section */}
        <div className="card api-key-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Settings size={20} />
            <h2>API Configuration</h2>
          </div>
          <div className="input-group">
            <label htmlFor="apiKey">API Key</label>
            <input
              id="apiKey"
              type="password"
              value={state.apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="Enter your ChangeClothesAI API key"
              required
            />
            <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
              Get your API key from{' '}
              <a 
                href="https://changeclothesai.online" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#667eea', textDecoration: 'none' }}
              >
                changeclothesai.online
              </a>
            </p>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="card">
          <h2>Upload Images</h2>
          
          <ImageUpload
            title="Model Image"
            description="Upload a photo of the person wearing clothes"
            value={state.modelImage}
            onChange={handleModelImageChange}
          />

          <ImageUpload
            title="Garment Image"
            description="Upload the clothing item you want to try on"
            value={state.garmentImage}
            onChange={handleGarmentImageChange}
          />

          <div className="input-group">
            <label htmlFor="category">Clothing Category</label>
            <select
              id="category"
              value={state.category}
              onChange={(e) => handleCategoryChange(e.target.value as AppState['category'])}
            >
              <option value="upper_body">Upper Body (Shirts, Jackets, etc.)</option>
              <option value="lower_body">Lower Body (Pants, Skirts, etc.)</option>
              <option value="dresses">Dresses</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="garmentDesc">Garment Description (Optional)</label>
            <textarea
              id="garmentDesc"
              value={state.garmentDesc}
              onChange={(e) => handleGarmentDescChange(e.target.value)}
              placeholder="Describe the garment for better results (e.g., 'red cotton t-shirt', 'blue denim jeans')"
              rows={3}
            />
          </div>

          {state.isLoading && (
            <div style={{ 
              background: '#f8f9fa', 
              padding: '16px', 
              borderRadius: '8px', 
              marginBottom: '16px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div className="spinner" style={{ width: '16px', height: '16px' }} />
                <strong>Processing...</strong>
              </div>
              <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                Uploading images and processing with AI...
              </p>
            </div>
          )}

          {state.error && (
            <div className="error">
              {state.error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              type="submit"
              className="btn"
              disabled={state.isLoading || !state.apiKey || !state.modelImage.file || !state.garmentImage.file}
            >
              {state.isLoading ? (
                <>
                  <div className="spinner" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Transform Clothes
                </>
              )}
            </button>
            
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={state.isLoading}
            >
              Reset
            </button>
            
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleTestWithUrls}
              disabled={state.isLoading || !state.apiKey}
            >
              Test with Demo URLs
            </button>
          </div>
        </div>
      </form>

      {/* Results Section */}
      {state.results && (
        <ResultsDisplay results={state.results} />
      )}

      {/* Info Section */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Info size={20} />
          <h2>How it works</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          <div>
            <h3 style={{ marginBottom: '8px', color: '#667eea' }}>1. Upload Images</h3>
            <p>Upload a photo of a person and the clothing item you want them to try on.</p>
          </div>
          <div>
            <h3 style={{ marginBottom: '8px', color: '#667eea' }}>2. Select Category</h3>
            <p>Choose the appropriate clothing category for better AI processing.</p>
          </div>
          <div>
            <h3 style={{ marginBottom: '8px', color: '#667eea' }}>3. Get Results</h3>
            <p>Receive the transformed image with the new clothing applied to the model.</p>
          </div>
        </div>
        
        <div style={{ marginTop: '24px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '8px' }}>Tips for best results:</h3>
          <ul style={{ marginLeft: '20px', lineHeight: '1.6' }}>
            <li>Use high-quality, well-lit photos</li>
            <li>Ensure the person is clearly visible and facing the camera</li>
            <li>Choose clothing items with clear, distinct patterns</li>
            <li>Select the correct clothing category</li>
            <li>Add descriptive text for complex garments</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
