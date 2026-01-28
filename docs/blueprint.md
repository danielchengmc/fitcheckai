# **App Name**: FitTrackAI

## Core Features:

- User Authentication: Firebase Authentication for secure user accounts.
- Workout Logging: Form to input workout name, exercises, sets, reps, and weight.
- Meal Logging: Use expo-image-picker to take/select a photo of a meal and upload it to Firebase Storage. Gemini Enterprise API powered goals based on calorie
- Calorie/Macro Estimation: Cloud Function triggered on image upload to Firebase Storage; uses the Gemini Enterprise API as a tool to estimate calories/macros and saves the data to Firestore.
- Real-time Data Display: Display the lists of workouts and meals, in real-time using Firestore listeners.
- Firestore Schema: Store workouts and meals under the user document following provided data structure.

## Style Guidelines:

- Primary color: Vibrant purple (#A076F9) to evoke a sense of energy and focus for fitness tracking.
- Background color: Light gray (#F5F5F5) to maintain a clean and neutral backdrop, ensuring readability and visual comfort.
- Accent color: Teal (#45D3C0) to highlight key actions and important information.
- Body and headline font: 'PT Sans', a modern, legible sans-serif for both headings and body text.
- Use a set of consistent and clear icons, provided by React Native Paper or similar icon library, for navigation and feature representation.
- A clean, card-based layout with ample spacing to make the data visually digestible and easy to interact with on smaller screens.
- Subtle transitions and feedback animations to acknowledge user actions and maintain engagement, e.g., when adding a workout or logging a meal.