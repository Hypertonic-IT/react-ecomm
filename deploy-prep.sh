#!/bin/bash

# 🚀 cPanel Deployment Preparation Script
# This script helps prepare your React e-commerce app for cPanel deployment

echo "=================================="
echo "🚀 cPanel Deployment Prep Tool"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR"

echo "Project Root: $PROJECT_ROOT"
echo ""

# Function to show menu
show_menu() {
    echo "What would you like to prepare?"
    echo ""
    echo "1) Prepare Backend for Deployment"
    echo "2) Build Frontend for Production"
    echo "3) Create Backend Deployment Package"
    echo "4) Create Frontend Deployment Package"
    echo "5) Create Both Packages (Backend + Frontend)"
    echo "6) Test Frontend Build Locally"
    echo "7) Exit"
    echo ""
}

# Function to prepare backend
prepare_backend() {
    echo -e "${YELLOW}📦 Preparing Backend...${NC}"
    
    cd "$PROJECT_ROOT/backend"
    
    # Update package.json start script
    echo "Updating package.json start script..."
    
    # Create backup
    cp package.json package.json.backup
    
    # Update start script (using sed)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' 's/"start": "nodemon server.js"/"start": "node server.js"/' package.json
    else
        # Linux
        sed -i 's/"start": "nodemon server.js"/"start": "node server.js"/' package.json
    fi
    
    echo -e "${GREEN}✅ Backend package.json updated${NC}"
    echo ""
    
    # Remind about .env
    echo -e "${YELLOW}⚠️  REMINDER: Update your .env file with production values before deploying!${NC}"
    echo ""
}

# Function to build frontend
build_frontend() {
    echo -e "${YELLOW}🏗️  Building Frontend...${NC}"
    
    cd "$PROJECT_ROOT"
    
    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        echo -e "${RED}⚠️  .env.production not found!${NC}"
        echo "Creating template .env.production file..."
        
        cat > .env.production << EOF
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
EOF
        
        echo -e "${YELLOW}⚠️  Please update .env.production with your actual values!${NC}"
        echo ""
        read -p "Press Enter to continue after updating .env.production..."
    fi
    
    # Build
    echo "Running npm run build..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Frontend build successful!${NC}"
        echo "Build files are in: $PROJECT_ROOT/build"
    else
        echo -e "${RED}❌ Frontend build failed!${NC}"
        return 1
    fi
    
    echo ""
}

# Function to create backend package
create_backend_package() {
    echo -e "${YELLOW}📦 Creating Backend Deployment Package...${NC}"
    
    cd "$PROJECT_ROOT"
    
    # Remove old package if exists
    if [ -f "backend-deploy.zip" ]; then
        rm backend-deploy.zip
        echo "Removed old backend-deploy.zip"
    fi
    
    # Create zip excluding unnecessary files
    echo "Creating zip file..."
    zip -r backend-deploy.zip backend \
        -x "backend/node_modules/*" \
        -x "backend/.env" \
        -x "backend/*.md" \
        -x "backend/test_*.js" \
        -x "backend/check*.js" \
        -x "backend/seed*.js" \
        -x "backend/create*.js" \
        -x "backend/fix*.js" \
        -x "backend/reset*.js" \
        -x "backend/update-*.js" \
        -x "backend/.DS_Store" \
        -x "backend/package.json.backup"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backend package created: backend-deploy.zip${NC}"
        echo "Size: $(du -h backend-deploy.zip | cut -f1)"
    else
        echo -e "${RED}❌ Failed to create backend package!${NC}"
        return 1
    fi
    
    echo ""
}

# Function to create frontend package
create_frontend_package() {
    echo -e "${YELLOW}📦 Creating Frontend Deployment Package...${NC}"
    
    cd "$PROJECT_ROOT"
    
    # Check if build folder exists
    if [ ! -d "build" ]; then
        echo -e "${RED}❌ Build folder not found! Please build the frontend first.${NC}"
        return 1
    fi
    
    # Remove old package if exists
    if [ -f "frontend-deploy.zip" ]; then
        rm frontend-deploy.zip
        echo "Removed old frontend-deploy.zip"
    fi
    
    # Create .htaccess for React Router
    echo "Creating .htaccess for React Router..."
    cat > build/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>
EOF
    
    # Create zip
    echo "Creating zip file..."
    cd build
    zip -r ../frontend-deploy.zip .
    cd ..
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Frontend package created: frontend-deploy.zip${NC}"
        echo "Size: $(du -h frontend-deploy.zip | cut -f1)"
    else
        echo -e "${RED}❌ Failed to create frontend package!${NC}"
        return 1
    fi
    
    echo ""
}

# Function to test frontend build
test_frontend_build() {
    echo -e "${YELLOW}🧪 Testing Frontend Build Locally...${NC}"
    
    cd "$PROJECT_ROOT"
    
    if [ ! -d "build" ]; then
        echo -e "${RED}❌ Build folder not found! Please build the frontend first.${NC}"
        return 1
    fi
    
    echo "Starting local server on http://localhost:3000"
    echo "Press Ctrl+C to stop the server"
    echo ""
    
    npx serve -s build
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice [1-7]: " choice
    echo ""
    
    case $choice in
        1)
            prepare_backend
            ;;
        2)
            build_frontend
            ;;
        3)
            create_backend_package
            ;;
        4)
            create_frontend_package
            ;;
        5)
            prepare_backend
            build_frontend
            if [ $? -eq 0 ]; then
                create_backend_package
                create_frontend_package
                echo -e "${GREEN}🎉 Both packages created successfully!${NC}"
                echo ""
                echo "Next steps:"
                echo "1. Upload backend-deploy.zip to cPanel ~/backend"
                echo "2. Upload frontend-deploy.zip to cPanel ~/public_html"
                echo "3. Follow the deployment guide: .agent/workflows/cpanel-deployment.md"
                echo ""
            fi
            ;;
        6)
            test_frontend_build
            ;;
        7)
            echo "Goodbye! 👋"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option. Please try again.${NC}"
            echo ""
            ;;
    esac
    
    read -p "Press Enter to continue..."
    echo ""
    echo ""
done
