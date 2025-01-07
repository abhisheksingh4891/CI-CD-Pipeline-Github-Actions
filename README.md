1 -- clone github repo
git clone <repository_url>
cd <repository_name>

2 -- Add a GitHub Actions Workflow and steps are
2.1 -- Create the workflow folder
mkdir .github/workflows

2.2 -- Create a workflow YAML file
echo. > .github\workflows\ci-cd.yml --- for windows
touch .github/workflows/ci-cd.yml  --- for linux/unix

2.3 -- add sample line of workflow in .yml created
name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-22.04

    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Build Project
        run: npm run build

      - name: Upload production-ready build files
        uses: actions/upload-artifact@v2
        with:
          name: production-files
          path: ./build

deploy:
  name: Deploy
  needs: build
  runs-on: ubuntu-22.04

  steps:
    - name: Deploy to Github Pages
      run: echo "Deploying the project!"

 
2.4 -- then push the code to git repo


### new workflow

name: Build & Deploy

on:
  push:
    branches:
      - main
      
env:
  CI: false

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 16

      - name: Install dependencies
        uses: npm install

      - name: Build project
        run: npm run build

      - name: Debug Working Directory
        run: ls -alh

      - name: Debug .next Directory
        run: ls -R .next || echo ".next directory not found"

      - name: Debug Out Directory
        run: ls -R out || echo "out directory not found"

      - name: Upload production-ready build files
        uses: actions/upload-artifact@v3
        with:
          name: production-files
          path: ./build

  deploy:
    name: Deploy
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Download artifact
        uses: actions/download-artifact@v2
        with:
          name: production-files
          path: ./build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.TOKEN }}
          publish_dir: ./build