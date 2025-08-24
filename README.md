# Website Backend

A comprehensive NestJS backend application with authentication, file storage, AWS/GCP integration, and more.

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control
  - Email verification
  - Password reset functionality
  - Local and JWT strategies

- 📁 **File Management**
  - File upload and storage
  - AWS S3 integration
  - Google Cloud Storage integration
  - Image thumbnail generation
  - File type validation

- 📧 **Email Services**
  - SMTP email sending
  - EJS template rendering
  - Welcome emails
  - Password reset emails
  - Email verification

- 📱 **WhatsApp Integration**
  - Twilio WhatsApp API
  - Message sending
  - Template messages
  - QR code generation

- 🗄️ **Database**
  - PostgreSQL with TypeORM
  - User management
  - Data validation
  - Migration support

- 🛡️ **Security**
  - Password hashing with bcrypt
  - Rate limiting
  - CORS configuration
  - Helmet security headers
  - Input validation

- 📊 **API Documentation**
  - Swagger/OpenAPI documentation
  - Comprehensive API endpoints
  - Request/response examples

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: Passport.js, JWT
- **File Storage**: AWS S3, Google Cloud Storage
- **Email**: Nodemailer, EJS templates
- **WhatsApp**: Twilio
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Linting**: ESLint, Prettier

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd website_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp backend.env.example backend.env
   ```
   
   Update the `backend.env` file with your configuration:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=website_backend
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   
   # Email
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   
   # AWS (optional)
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your-s3-bucket
   
   # GCP (optional)
   GCP_PROJECT_ID=your-gcp-project-id
   GCP_STORAGE_BUCKET=your-gcp-bucket
   GCP_KEY_FILE_PATH=./google_credentials.json
   
   # WhatsApp/Twilio (optional)
   TWILIO_ACCOUNT_SID=your-twilio-account-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb website_backend
   
   # Run migrations (if using migrations)
   npm run migration:run
   ```

5. **Start the application**
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm run build
   npm run start:prod
   ```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api/docs
```

## Project Structure

```
backend/
├── 📁 dist/                          # Compiled TypeScript output
├── 📁 node_modules/                  # Node.js dependencies
├── 📁 environments/                  # Environment-specific configurations
├── 📁 thumbnails/                    # Thumbnail storage
├── 📁 libs/                          # Shared libraries
│   └── 📁 common/                    # Common utilities and modules
│       ├── 📁 src/
│       │   ├── 📁 aws/              # AWS integration
│       │   ├── 📁 config/           # Configuration files
│       │   ├── 📁 datetime-zone/    # Timezone utilities
│       │   ├── 📁 decorators/       # Custom decorators
│       │   ├── 📁 dtos/             # Data Transfer Objects
│       │   ├── 📁 enums/            # Enum definitions
│       │   ├── 📁 exceptions/       # Custom exceptions
│       │   ├── 📁 gcp/              # Google Cloud Platform
│       │   ├── 📁 guards/           # Authentication guards
│       │   ├── 📁 interceptors/     # HTTP interceptors
│       │   ├── 📁 interfaces/       # TypeScript interfaces
│       │   ├── 📁 jwt/              # JWT utilities
│       │   ├── 📁 mail/             # Email services
│       │   ├── 📁 storage/          # File storage utilities
│       │   ├── 📁 utils/            # General utilities
│       │   ├── 📁 whatsapp/         # WhatsApp integration
│       │   └── index.ts             # Main export file
│       └── tsconfig.lib.json        # TypeScript config for library
├── 📁 src/                          # Main application source code
│   ├── 📁 auth/                     # Authentication module
│   │   ├── auth.controller.spec.ts  # Auth controller tests
│   │   ├── auth.controller.ts       # Auth controller
│   │   ├── auth.module.ts           # Auth module
│   │   └── 📁 strategies/           # Auth strategies
│   │       ├── jwt.strategy.ts      # JWT strategy
│   │       └── local.strategy.ts    # Local strategy
│   ├── 📁 profile/                  # User profile management
│   │   ├── profile.controller.spec.ts
│   │   ├── profile.controller.ts
│   │   └── profile.module.ts
│   ├── 📁 utils/                     # Utility functions
│   ├── app.controller.ts             # Main app controller
│   ├── app.module.ts                 # Main app module
│   ├── app.service.ts                # Main app service
│   └── main.ts                       # Application entry point
├── 📁 views/                         # EJS template views
│   └── confirm_email.ejs            # Email confirmation template
├── 📄 backend.env                    # Environment variables
├── 📄 google_credentials.json       # Google Cloud credentials
├── 📄 Dockerfile                     # Docker configuration
├── 📄 ecosystem.config.js           # PM2 ecosystem config
├── 📄 tsconfig.build.json           # TypeScript build config
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 nest-cli.json                 # NestJS CLI configuration
├── 📄 .dockerignore                  # Docker ignore file
├── 📄 .eslintrc.js                  # ESLint configuration
├── 📄 .prettierrc                   # Prettier configuration
├── 📄 README.md                     # Project documentation
├── 📄 package.json                  # Node.js dependencies
└── 📄 package-lock.json             # Locked dependencies
```

## Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage

## Docker

Build and run with Docker:

```bash
# Build the image
docker build -t website-backend .

# Run the container
docker run -p 3000:3000 website-backend
```

## PM2 Deployment

For production deployment with PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start ecosystem.config.js --env production

# Monitor the application
pm2 monit

# View logs
pm2 logs
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.
