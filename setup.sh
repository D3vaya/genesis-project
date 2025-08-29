#!/bin/bash

# Genesis Project Setup Script
# This script helps you quickly set up the development environment

set -e

echo "🚀 Genesis Project - Setup Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
check_node() {
    print_step "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 20.x or later."
        echo "Visit: https://nodejs.org/"
        exit 1
    fi

    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        print_error "Node.js version 20.x or later is required. Current version: $(node --version)"
        exit 1
    fi

    print_success "Node.js $(node --version) is installed"
}

# Check if npm is installed
check_npm() {
    print_step "Checking npm installation..."
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    print_success "npm $(npm --version) is installed"
}

# Install dependencies
install_dependencies() {
    print_step "Installing dependencies..."
    npm install
    print_success "Dependencies installed successfully"
}

# Setup environment variables
setup_env() {
    print_step "Setting up environment variables..."
    if [ ! -f .env.local ]; then
        print_step "Creating .env.local file..."
        cat > .env.local << EOF
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Add other environment variables as needed
# API_BASE_URL="https://api.example.com"
EOF
        print_success ".env.local created with random NEXTAUTH_SECRET"
    else
        print_warning ".env.local already exists, skipping creation"
    fi
}

# Setup database
setup_database() {
    print_step "Setting up database..."
    
    print_step "Generating Prisma client..."
    npm run db:generate
    
    print_step "Running database migrations..."
    npm run db:migrate
    
    print_step "Seeding database with initial data..."
    npm run db:seed
    
    print_success "Database setup completed"
}

# Setup git hooks
setup_git_hooks() {
    print_step "Setting up git hooks..."
    if [ -d .git ]; then
        npm run prepare
        print_success "Git hooks configured with Husky"
    else
        print_warning "Not a git repository, skipping git hooks setup"
        print_warning "Run 'git init' and 'npm run prepare' to set up git hooks later"
    fi
}

# Run initial tests
run_tests() {
    print_step "Running initial tests..."
    npm run test:ci
    print_success "All tests passed"
}

# Final checks
final_checks() {
    print_step "Running final checks..."
    
    print_step "Type checking..."
    npm run type-check
    
    print_step "Linting..."
    npm run lint
    
    print_step "Format checking..."
    npm run format:check
    
    print_success "All checks passed"
}

# Main setup process
main() {
    echo "Starting Genesis Project setup..."
    echo ""
    
    check_node
    check_npm
    install_dependencies
    setup_env
    setup_database
    setup_git_hooks
    
    # Ask if user wants to run tests
    echo ""
    read -p "Do you want to run tests now? (y/N): " run_tests_now
    if [[ $run_tests_now =~ ^[Yy]$ ]]; then
        run_tests
        final_checks
    else
        print_warning "Skipping tests. Run 'npm test' later to verify everything works."
    fi
    
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Start development server: npm run dev"
    echo "  2. Open your browser at: http://localhost:3000"
    echo "  3. View database: npm run db:studio"
    echo ""
    echo "📚 Available commands:"
    echo "  npm run dev          - Start development server"
    echo "  npm run build        - Build for production"
    echo "  npm run test         - Run tests"
    echo "  npm run lint         - Run linting"
    echo "  npm run format       - Format code"
    echo "  npm run db:studio    - Open database GUI"
    echo ""
    echo "📖 For more information, check the README.md file"
    echo ""
    print_success "Happy coding! 🚀"
}

# Run the setup
main "$@"