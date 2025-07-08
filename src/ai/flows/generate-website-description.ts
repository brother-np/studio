'use server';

/**
 * @fileOverview A Genkit flow to generate a marketing description for the NepaliAppHub website.
 *
 * - generateWebsiteDescription - A function that generates a description for the website.
 * - GenerateWebsiteDescriptionInput - The input type for the generateWebsiteDescription function.
 * - GenerateWebsiteDescriptionOutput - The return type for the generateWebsiteDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWebsiteDescriptionInputSchema = z.object({}).describe("An empty input object.");
export type GenerateWebsiteDescriptionInput = z.infer<typeof GenerateWebsiteDescriptionInputSchema>;

const GenerateWebsiteDescriptionOutputSchema = z.object({
  description: z.string().describe('A marketing description for the NepaliAppHub website.'),
});
export type GenerateWebsiteDescriptionOutput = z.infer<typeof GenerateWebsiteDescriptionOutputSchema>;

export async function generateWebsiteDescription(input: GenerateWebsiteDescriptionInput): Promise<GenerateWebsiteDescriptionOutput> {
  return generateWebsiteDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWebsiteDescriptionPrompt',
  input: {schema: GenerateWebsiteDescriptionInputSchema},
  output: {schema: GenerateWebsiteDescriptionOutputSchema},
  prompt: `You are an expert technical writer tasked with creating a comprehensive and engaging description of a web application called "NepaliAppHub". Your description should be detailed enough to be used as a prompt for another AI.

Here is a complete breakdown of the application:

**1. High-Level Concept**
- **Name:** NepaliAppHub
- **Purpose:** A curated directory and discovery platform for mobile and desktop applications. The apps are either made by developers from Nepal or are specifically targeted towards a Nepali audience.
- **Target Audience:** Anyone interested in finding, using, or promoting Nepali-centric applications.

**2. Visual Design and Theme**
- **Color Palette:** The theme is inspired by the Nepali flag. The primary color is a strong red (used for main buttons and links), the accent color is a deep blue (used for secondary highlights), and the background is a clean, off-white/light gray, creating a modern and professional look.
- **Typography:** The font for headlines is "Space Grotesk" (a modern, technical-looking font), and the font for body text is "PT Sans" (a clean, readable sans-serif font).
- **Overall Feel:** The design is clean, modern, and responsive. It uses cards with rounded corners and subtle hover effects (like a slight lift and shadow) to create a dynamic user experience.

**3. User-Facing Features (Homepage)**
- **Header:** A sticky header at the top of the page contains the "NepaliAppHub" logo and name, with "Nepali" in the primary red and "AppHub" in the accent blue. On the right, there is an "Admin Panel" button with a shield icon for navigation.
- **Main Welcome Section:**
  - A large headline reads "Discover Nepali Apps".
  - Below it, a short, engaging paragraph describes the website's purpose (this is the text you will generate).
- **Featured Apps Section:** A section titled "Featured Apps" showcases the top 3 applications from the directory in a three-column grid.
- **Main App Grid & Filtering:**
  - This is the core of the homepage, displaying all apps in a responsive grid.
  - Above the grid, there is a search bar with a magnifying glass icon, allowing users to search for apps by name.
  - Next to the search bar is a dropdown menu that allows users to filter the grid by category (e.g., 'Finance', 'E-commerce', 'Utilities', etc.).
- **App Card Details:** Each app in the grid is displayed on a card with the following elements:
  - **Icon:** A 64x64 pixel icon of the app.
  - **Name:** The app's name, displayed prominently.
  - **Category:** A small badge showing the app's category.
  - **Description:** A brief, one-or-two-line description of the app.
  - **Tags:** A collection of small, outlined badges showing keyword tags (e.g., 'wallet', 'shopping', 'news').
  - **Download Button:** A primary-colored button at the bottom of the card that says "Download" with a download icon. This button is a dropdown menu.
    - **Download Dropdown:** When clicked, it reveals links for different platforms. If an Android link exists, it shows an item with a smartphone icon that says "For Android". If a Windows link exists, it shows an item with a monitor icon that says "For Windows".
- **Footer:** A simple footer at the bottom of the page with a copyright notice: "© [Current Year] NepaliAppHub".

**4. Admin-Facing Features (Admin Panel)**
- **Login:** The admin panel is accessed via a secure login page at \`/admin/login\`. It requires a specific email and password.
- **Dashboard (/admin/dashboard):**
  - **App Table:** The main feature is a table listing all the apps. The table has columns for the App Icon, Name, and Category.
  - **Action Buttons:** Each row in the table has an "Edit" button (pencil icon) and a "Delete" button (trash can icon).
  - **Add New App Button:** A prominent button with a plus-circle icon that opens a dialog to add a new app.
  - **Settings Button:** A button that opens a dialog to manage site-wide settings.
- **Add/Edit App Form (Dialog):**
  - A clean form with fields for: App Name, Description, Icon URL, Android Download Link, Windows Download Link, Category (a dropdown), and Tags (a comma-separated text field).
  - **AI Tag Suggestion:** Next to the "Tags" field, there is a button with a magic wand icon labeled "Suggest with AI". When clicked, it reads the app's description, calls a Genkit AI flow, and automatically populates the tags field with relevant keywords.
- **Delete Confirmation:** Clicking the delete button on an app opens an alert dialog asking for confirmation to prevent accidental deletion.
- **AdSense Settings (Dialog):** The settings dialog allows the admin to enter a Google AdSense Publisher ID to enable ads on the website.

**Your Task:**
Based on this exhaustive description, generate a single, engaging, and concise paragraph (2-3 sentences) for the main welcome section of the NepaliAppHub homepage. The tone should be professional, welcoming, and highlight the value of discovering community-focused apps.
`,
});

const generateWebsiteDescriptionFlow = ai.defineFlow(
  {
    name: 'generateWebsiteDescriptionFlow',
    inputSchema: GenerateWebsiteDescriptionInputSchema,
    outputSchema: GenerateWebsiteDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
