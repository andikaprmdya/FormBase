# FormBase - Mobile Data Collection App

A beautiful, modern mobile data collection app built with React Native and Expo. FormBase allows users to design custom forms, collect data, and explore records with an elegant Apple 2025-inspired interface.

## Features

### Core Functionality
- **Form Management**: Create, edit, and delete custom forms
- **Dynamic Field Types**: Support for 5 field types:
  - Text (single-line)
  - Multiline (multi-line text)
  - Dropdown (predefined options)
  - Location (GPS coordinates)
  - Image (camera/photo picker)
- **Record Management**: Fill forms, view, delete, and copy records to clipboard
- **Advanced Filtering**: Build complex queries with AND/OR logic
- **Map Integration**: Visualize all location-based records on an interactive map

### Device APIs
- Camera integration for image capture
- Photo gallery picker
- GPS location services
- Copy to clipboard functionality

### UI/UX
- Glassmorphism design system inspired by Apple's 2025 aesthetic
- Smooth animations using Moti throughout the app
- Clean, intuitive navigation
- Responsive and accessible interface

## Tech Stack

- **Framework**: React Native with Expo (TypeScript)
- **Animation**: Moti
- **Navigation**: React Navigation
- **API**: PostgREST REST API
- **Maps**: React Native Maps
- **Device APIs**: Expo Camera, Image Picker, Location, Clipboard

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Expo Go app on your mobile device (for testing)
- Or Android Studio / Xcode for emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

3. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## Project Structure

```
FormBase/
├── src/
│   ├── components/      # Reusable UI components
│   ├── navigation/      # Navigation configuration
│   ├── screens/         # Screen components
│   ├── services/        # API services
│   ├── theme/          # Theme and styling
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── App.tsx             # Root component
├── app.json            # Expo configuration
└── package.json        # Dependencies
```

## API Configuration

The app connects to a PostgREST API with the following endpoints:

- `GET/POST/PATCH/DELETE /form` - Form metadata
- `GET/POST/PATCH/DELETE /field` - Form fields
- `GET/POST/DELETE /record` - Form records

Authentication is handled via JWT token in the Authorization header.

## Key Screens

1. **Home**: Landing page with navigation to main features
2. **About**: Information about the app and tech stack
3. **Form List**: View and manage all forms
4. **Form Detail**: Hub for adding fields and managing records
5. **Field Create**: Add new fields with type selection
6. **Record Create**: Fill out forms with dynamic field rendering
7. **Record List**: View, copy, and delete records
8. **Filter Builder**: Build complex queries with AND/OR logic
9. **Map**: Visualize location-based records

## Development

### Running TypeScript checks
```bash
npx tsc --noEmit
```

### Code Quality
- Component-level error handling throughout
- Type-safe TypeScript
- Consistent code organization
- Privacy-aware implementation

## Permissions

The app requires the following permissions:
- Camera (for image field type)
- Photo Library (for image selection)
- Location (for GPS coordinates)

These are configured in `app.json` and requested at runtime.

## Design Philosophy

FormBase follows Apple's 2025 design language:
- Glassmorphism with frosted blur effects
- Smooth, organic animations
- Minimalist typography
- High contrast and readability
- Depth through layering and shadows

## Built For

COMP2140 - University of Queensland
2025

## License

This project is for educational purposes.
