# **App Name**: EquiTrack

## Core Features:

- QR Code Scanner Interface: Utilize the device's camera to scan QR codes for asset identification and automated actions such as Check-in/Check-out. The scanner component allows manual entry if the scan fails.
- Manual Check-In/Out Forms: Allow for manual asset and employee ID entry using a form, if the QR scanner component has failed. Display relevant information in real time.
- Real-time Inventory Dashboard: Monitor the status of assets across different categories.
- User Authentication: Secure the app with Firebase Authentication, enabling email/password, and protected routes.
- Transaction History Log: Log transactions to maintain the provenance of assets, tracking Check-In and Check-Out activity for each asset.
- Condition Assessment: The user must provide the current condition of an item at check-in by choosing one of a fixed set of allowed options: Excellent, Good, Fair, or Poor.
- Intelligent Data Validation Tool: Leverage an AI tool to check all the required asset properties are available at asset registration and report missing fields. Based on asset name, AI will generate missing parameters like model name, manufacture date or type of the asset.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to convey trust and security in asset management. It reflects a professional and reliable environment, avoiding the overused association of money with the color green.
- Background color: Light grayish-blue (#ECEFF1) as a neutral backdrop. This enhances focus on the content, ensures readability, and supports the dark color scheme.
- Accent color: A vibrant purple (#9C27B0), for interactive elements like buttons and active states. This contrast ensures elements are easily identifiable.
- Body and headline font: 'Inter', sans-serif, for a clean, modern and professional feel. Inter provides excellent readability and supports a range of weights suitable for both headlines and body text.
- Use Lucide React icons for a consistent, minimalist aesthetic, ensuring each icon is easily understandable at a glance.
- Implement a modular layout system. Each module must be separated clearly for clarity.
- Incorporate subtle animations upon QR scan or Check-In/Out actions, providing immediate feedback to the user and enhancing user experience. The subtle animation needs to give user assurance.