<div class="hero-icon" align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
</div>

<h1 align="center">
Fitness Tracker
</h1>
<h4 align="center">A web application that empowers users to easily track their fitness goals, monitor progress, and share achievements with friends.</h4>
<h4 align="center">Developed with the software and tools below.</h4>
<div class="badges" align="center">
  <img src="https://img.shields.io/badge/Framework-Next.js-blue" alt="">
  <img src="https://img.shields.io/badge/Frontend-TypeScript,_React,_HTML,_CSS-red" alt="">
  <img src="https://img.shields.io/badge/Backend-Node.js,_Express.js-blue" alt="">
  <img src="https://img.shields.io/badge/Database-PostgreSQL-green" alt="">
</div>
<div class="badges" align="center">
  <img src="https://img.shields.io/github/last-commit/coslynx/Fitness-Tracker?style=flat-square&color=5D6D7E" alt="git-last-commit" />
  <img src="https://img.shields.io/github/commit-activity/m/coslynx/Fitness-Tracker?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
  <img src="https://img.shields.io/github/languages/top/coslynx/Fitness-Tracker?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</div>

## 📑 Table of Contents
- 📍 Overview
- 📦 Features
- 📂 Structure
- 💻 Installation
- 🏗️ Usage
- 🌐 Hosting
- 📄 License
- 👏 Authors

## 📍 Overview
This repository houses the Minimum Viable Product (MVP) for a Fitness Tracker web application, designed to help users set and track their fitness goals, monitor progress, and connect with friends. The application leverages a robust tech stack, including Next.js, React, TypeScript, and Node.js, for a fast, engaging, and user-friendly experience.

## 📦 Features
|    | Feature            | Description                                                                                                        |
|----|--------------------|--------------------------------------------------------------------------------------------------------------------|
| 🔐 | **User Authentication** | Users can securely register and log in using their email and password or through social logins (e.g., Google, Facebook). |
| 🎯 | **Goal Setting**        |  Users can create personalized fitness goals with specific titles, targets, and deadlines.                 |
| 📈 | **Progress Tracking**     | Users can log their workouts, including type, duration, and date, to track their progress towards their goals.          |
| 📊 | **Progress Visualization** | The application provides visual representations of progress with charts and graphs, offering insightful data.          |
| 🤝 | **Social Sharing**        | Users can connect with friends, share their achievements, and provide support and motivation.                 |
| ⚙️ | **Architecture**   | The codebase follows a modular architectural pattern, ensuring easier maintenance and scalability.             |
| 📄 | **Documentation**  | The repository includes a README file that provides a detailed overview of the MVP, its dependencies, and usage instructions.|
| 🔗 | **Dependencies**   | The codebase relies on various external libraries and packages such as Next.js, React, Zustand, Prisma ORM, and others, which are essential for building and styling the UI components, managing state, and handling database interactions.|
| 🧩 | **Modularity**     | The modular structure allows for easier maintenance and reusability of the code, with separate directories and files for different functionalities such as background, components, and content.|
| 🧪 | **Testing**        | Unit tests are implemented using frameworks like Jest or React Testing Library to ensure the reliability and robustness of the codebase.       |
| ⚡️  | **Performance**    | Performance optimization is implemented to improve loading times and user experience.  The system can be further optimized based on factors such as the browser and hardware being used.|
| 🔐 | **Security**       | Security is a top priority, with measures like input validation, data encryption, and secure communication protocols implemented.|
| 🔀 | **Version Control**| Utilizes Git for version control with GitHub Actions workflow files for automated build and release processes.|
| 🔌 | **Integrations**   | The application integrates with external services through HTTP requests. It also interacts with browser APIs.           |
| 📶 | **Scalability**    | The system is designed to handle increased user load and data volume, utilizing caching strategies and cloud-based solutions for better scalability.           |
        
        ## 📂 Structure
        ```text
        fitness-tracker/
        ├── public
        │   ├── images
        │   │   └── logo.png
        │   ├── favicon.ico
        │   └── robots.txt
        ├── pages
        │   ├── api
        │   │   ├── auth
        │   │   │   └── [...nextauth].js
        │   │   ├── goals
        │   │   │   └── route.ts
        │   │   └── progress
        │   │       └── route.ts
        │   ├── index.js
        │   ├── dashboard
        │   │   └── page.tsx
        │   ├── goals
        │   │   └── page.tsx
        │   └── profile
        │       └── page.tsx
        ├── components
        │   ├── common
        │   │   ├── Button.tsx
        │   │   ├── Input.tsx
        │   │   └── Modal.tsx
        │   └── layout
        │       ├── Header.tsx
        │       └── Footer.tsx
        ├── lib
        │   ├── api
        │   │   └── client.ts
        │   └── utils
        │       └── formatters.ts
        ├── .eslintrc.js
        ├── next.config.js
        ├── prisma
        │   ├── schema.prisma
        │   ├── migrations
        │   │   └── _Rollbacks
        │   │       └── 20231026123456_init.sql
        │   └── migrations
        │       └── 20231026123456_init
        │           └── migration.sql
        ├── .env
        └── tests
            ├── components
            │   ├── common
            │   │   ├── Button.test.tsx
            │   │   ├── Input.test.tsx
            │   │   └── Modal.test.tsx
            │   └── layout
            │       ├── Header.test.tsx
            │       └── Footer.test.tsx
            ├── pages
            │   ├── index.test.js
            │   ├── dashboard
            │   │   └── page.test.tsx
            │   ├── goals
            │   │   └── page.test.tsx
            │   └── profile
            │       └── page.test.tsx
            ├── lib
            │   ├── api
            │   │   └── client.test.ts
            │   └── utils
            │       └── formatters.test.ts
            ├── services
            │   ├── api.test.ts
            │   └── auth.test.ts
            └── hooks
                └── useAuth.test.ts
        ```
      
        ## 💻 Installation
          ### 🔧 Prerequisites
          - Node.js v18+
          - npm 6+ or yarn
          - PostgreSQL 13+
          
          ### 🚀 Setup Instructions
          1. Clone the repository:
             ```bash
             git clone https://github.com/coslynx/Fitness-Tracker.git
             cd Fitness-Tracker
             ```
          2. Install dependencies:
             ```bash
             npm install
             ```
          3. Set up the database:
             ```bash
             npx prisma generate
             npx prisma db push 
             ```
          4. Configure environment variables:
             ```bash
             cp .env.example .env
             [Instruct to fill in necessary environment variables, including DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, and any other required variables. For example:]
             # NextAuth.js Configuration
             NEXTAUTH_URL=http://localhost:3000
             NEXTAUTH_SECRET=your_strong_secret_key

             # Database Connection
             DATABASE_URL=postgres://username:password@host:port/database
             ```
          
          ## 🏗️ Usage
          ### 🏃‍♂️ Running the MVP
          1. Start the development server:
             ```bash
             npm run dev
             ```
          
          3. Access the application:
             - Web interface: [http://localhost:3000](http://localhost:3000)
             - API endpoint: [http://localhost:3000/api](http://localhost:3000/api)
          
          ### ⚙️ Configuration
          - The primary configuration file is `next.config.js` which contains settings for Next.js, including:
              - Environment variables
              - Image handling
              - Experimental features 
          - Other configuration files such as `tailwind.config.js` for styling and `prisma/schema.prisma` for database schema are also crucial for the project. 
          
          ### 📚 Examples
          Provide specific examples relevant to the MVP's core features. For instance:
          
          - 📝 **User Registration**: 
            ```bash
            curl -X POST http://localhost:3000/api/auth/signup               -H "Content-Type: application/json"               -d '{"email": "user@example.com", "password": "securepass123"}'
            ```
          
          - 📝 **Setting a Fitness Goal**: 
            ```bash
            curl -X POST http://localhost:3000/api/goals               -H "Content-Type: application/json"               -H "Authorization: Bearer YOUR_JWT_TOKEN"               -d '{"title": "Lose 10 lbs", "target": 150, "userId": 1}'
            ```
          
          - 📝 **Logging Progress**: 
            ```bash
            curl -X POST http://localhost:3000/api/progress               -H "Content-Type: application/json"               -H "Authorization: Bearer YOUR_JWT_TOKEN"               -d '{"type": "Running", "date": "2023-06-15", "duration": 30, "goalId": 1, "userId": 1}'
            ```
          
          ## 🌐 Hosting
          ### 🚀 Deployment Instructions
          Provide detailed, step-by-step instructions for deploying to the most suitable platform for this MVP. For example:
          
          #### Deploying to Vercel
          1. Install the Vercel CLI:
             ```bash
             npm install -g vercel
             ```
          2. Login to Vercel:
             ```bash
             vercel login
             ```
          3. Deploy the code:
             ```bash
             vercel
             ```
          4. Set up environment variables:
             ```bash
             vercel env [environment-name] [variable-name]=[value] 
             ```
          5. Run database migrations (if applicable):
             ```bash
             vercel run [environment-name] npm run migrate
             ```
          
          ### 🔑 Environment Variables
          Provide a comprehensive list of all required environment variables, their purposes, and example values:
          
          - `DATABASE_URL`: Connection string for the PostgreSQL database
            Example: `postgresql://user:password@host:port/database`
          - `NEXTAUTH_URL`: The URL of your Next.js application
            Example: `http://localhost:3000`
          - `NEXTAUTH_SECRET`: Secret key for NextAuth.js authentication 
            Example: `your-256-bit-secret`
          - `SENTRY_DSN`: DSN for Sentry error tracking 
            Example: `https://YOUR_DSN@sentry.io/PROJECT_ID`
          - `HOTJAR_ID`: ID for Hotjar user behavior analysis
            Example: `your_hotjar_id`
          
          ## 📜 API Documentation
          ### 🔍 Endpoints
          Provide a comprehensive list of all API endpoints, their methods, required parameters, and expected responses. For example:
          
          - **POST /api/auth/signup**
            - Description: Register a new user
            - Body: `{ "email": string, "password": string }`
            - Response: `{ "id": string, "email": string, "token": string }`
          
          - **POST /api/goals**
            - Description: Create a new fitness goal
            - Headers: `Authorization: Bearer TOKEN`
            - Body: `{ "title": string, "target": number, "userId": number }`
            - Response: `{ "id": string, "title": string, "target": number, "userId": number }`
          
          - **GET /api/goals**
            - Description: Get a list of all goals for the current user
            - Headers: `Authorization: Bearer TOKEN`
            - Response: `[{ "id": string, "title": string, "target": number, "userId": number }]`
          
          - **GET /api/progress**
            - Description: Get a list of user's activities
            - Headers: `Authorization: Bearer TOKEN`
            - Query Parameters:
                - `userId`: User ID
                - `goalId`: (Optional) Goal ID to filter by
                - `startDate`: (Optional) Start date to filter activities (YYYY-MM-DD)
                - `endDate`: (Optional) End date to filter activities (YYYY-MM-DD)
            - Response: `[{ "id": string, "type": string, "date": date, "duration": number, "goalId": number, "userId": number }]`
          
          - **POST /api/progress**
            - Description: Add a new activity log
            - Headers: `Authorization: Bearer TOKEN`
            - Body: `{ "type": string, "date": date, "duration": number, "goalId": number, "userId": number }`
            - Response: `{ "id": string, "type": string, "date": date, "duration": number, "goalId": number, "userId": number }`
          
          ### 🔒 Authentication
          Explain the authentication process in detail:
          
          1. Register a new user or login to receive a JWT token
          2. Include the token in the Authorization header for all protected routes:
             ```
             Authorization: Bearer YOUR_JWT_TOKEN
             ```
          
          ### 📝 Examples
          Provide comprehensive examples of API usage, including request and response bodies:
          
          ```bash
          # Register a new user
          curl -X POST http://localhost:3000/api/auth/signup             -H "Content-Type: application/json"             -d '{"email": "fitnessuser@example.com", "password": "securepass123"}'
          
          # Response
          {
            "id": "user123",
            "email": "fitnessuser@example.com",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          }
          
          # Create a new goal
          curl -X POST http://localhost:3000/api/goals             -H "Content-Type: application/json"             -H "Authorization: Bearer YOUR_JWT_TOKEN"             -d '{"title": "Lose 10 lbs", "target": 150, "userId": 1}'
          
          # Response
          {
            "id": "goal123",
            "title": "Lose 10 lbs",
            "target": 150,
            "userId": 1
          }
          
          # Get a list of goals for the current user
          curl -X GET http://localhost:3000/api/goals             -H "Authorization: Bearer YOUR_JWT_TOKEN"
          
          # Response
          [
            {
              "id": "goal123",
              "title": "Lose 10 lbs",
              "target": 150,
              "userId": 1
            },
            {
              "id": "goal456",
              "title": "Run 5km daily",
              "target": 30,
              "userId": 1
            }
          ]
          
          # Log a new activity
          curl -X POST http://localhost:3000/api/progress             -H "Content-Type: application/json"             -H "Authorization: Bearer YOUR_JWT_TOKEN"             -d '{"type": "Running", "date": "2023-06-15", "duration": 30, "goalId": 1, "userId": 1}'
          
          # Response
          {
            "id": "activity789",
            "type": "Running",
            "date": "2023-06-15",
            "duration": 30,
            "goalId": 1,
            "userId": 1
          }
          ```
          
          ## 📜 License & Attribution

          ### 📄 License
          This Minimum Viable Product (MVP) is licensed under the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) license.
          
          ### 🤖 AI-Generated MVP
          This MVP was entirely generated using artificial intelligence through [CosLynx.com](https://coslynx.com).
          
          No human was directly involved in the coding process of the repository: Fitness-Tracker
        
          ### 📞 Contact
          For any questions or concerns regarding this AI-generated MVP, please contact CosLynx at:
          - Website: [CosLynx.com](https://coslynx.com)
          - Twitter: [@CosLynxAI](https://x.com/CosLynxAI)

          <p align="center">
            <h1 align="center">🌐 CosLynx.com</h1>
          </p>
          <p align="center">
            <em>Create Your Custom MVP in Minutes With CosLynxAI!</em>
          </p>
          <div class="badges" align="center">
          <img src="https://img.shields.io/badge/Developers-Drix10,_Kais_Radwan-red" alt="">
          <img src="https://img.shields.io/badge/Website-CosLynx.com-blue" alt="">
          <img src="https://img.shields.io/badge/Backed_by-Google,_Microsoft_&_Amazon_for_Startups-red" alt="">
          <img src="https://img.shields.io/badge/Finalist-Backdrop_Build_v4,_v6-black" alt="">
          </div>