# ChangeClothesAI Web Application

A modern React web application that allows users to transform clothing on photos using the ChangeClothesAI API. This app provides an intuitive interface for uploading model and garment images, selecting clothing categories, and receiving AI-generated results.

## Features

- 🎨 **AI-Powered Clothing Transformation**: Change clothes on photos using advanced AI
- 📁 **Drag & Drop Image Upload**: Easy image upload with drag and drop support
- 🏷️ **Multiple Clothing Categories**: Support for upper body, lower body, and dresses
- 📝 **Optional Descriptions**: Add garment descriptions for better results
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔒 **Secure API Key Management**: Secure handling of API credentials
- 💾 **Download Results**: Download transformed images and masks
- 🎯 **Real-time Preview**: Preview uploaded images before processing

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- ChangeClothesAI API key (included in the app for testing)

## Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd ChangeClothAI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Usage

### 1. API Configuration
- The app includes a working API key for testing
- For production use, replace the hardcoded token in `src/api/changeClothesApi.ts`

### 2. Upload Images
- **Model Image**: Upload a photo of the person wearing clothes
- **Garment Image**: Upload the clothing item you want to try on
- Support for drag and drop or click to upload
- Supported formats: JPG, PNG, GIF (up to 10MB)

### 3. Configure Settings
- **Clothing Category**: Select the appropriate category:
  - Upper Body (Shirts, Jackets, etc.)
  - Lower Body (Pants, Skirts, etc.)
  - Dresses
- **Garment Description** (Optional): Add descriptive text for better results

### 4. Process and View Results
- Click "Transform Clothes" to start the AI processing
- View the transformed image and mask
- Download results or view full-size images

## API Integration

The application integrates with the ChangeClothesAI API using the following endpoint:

```
POST https://changeclothesai.online/api/openapi/change-clothes-ai
```

### Request Format
- **modelImg**: Model image (File, URL, or base64)
- **garmentImg**: Garment image (File, URL, or base64)
- **category**: Clothing category (`upper_body`, `lower_body`, `dresses`)
- **garmentDesc**: Optional garment description

### Response Format
```json
{
  "data": {
    "resultImgUrl": "URL to transformed image",
    "maskImgUrl": "URL to mask image"
  }
}
```

## Project Structure

```
src/
├── api/
│   └── changeClothesApi.ts    # API integration logic
├── components/
│   ├── ImageUpload.tsx        # Image upload component
│   └── ResultsDisplay.tsx     # Results display component
├── types.ts                   # TypeScript type definitions
├── App.tsx                    # Main application component
├── index.tsx                  # Application entry point
└── index.css                  # Global styles
```

## Technologies Used

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe JavaScript
- **Lucide React**: Beautiful icons
- **CSS3**: Modern styling with gradients and animations
- **Fetch API**: HTTP requests to the ChangeClothesAI API

## Best Practices for Results

1. **Image Quality**: Use high-quality, well-lit photos
2. **Model Visibility**: Ensure the person is clearly visible and facing the camera
3. **Clothing Clarity**: Choose clothing items with clear, distinct patterns
4. **Category Selection**: Select the correct clothing category
5. **Descriptions**: Add descriptive text for complex garments

## Error Handling

The application includes comprehensive error handling for:
- Missing API key
- Invalid image uploads
- Network errors
- API response errors
- File format validation

## Development

### Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

### Environment Variables

No environment variables are required for basic functionality. The API key is managed through the UI for user convenience.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For technical support or questions about the ChangeClothesAI API, please visit:
- [ChangeClothesAI Documentation](https://changeclothesai.online)
- [API Documentation](https://changeclothesai.online/api/docs)

## Changelog

### Version 1.0.0
- Initial release
- Basic image upload and processing
- Support for all clothing categories
- Drag and drop functionality
- Responsive design
- Download capabilities
