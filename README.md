1 -- clone github repo
git clone <repository_url>
cd <repository_name>

2 -- Add a GitHub Actions Workflow and steps are
2.1 -- Create the workflow folder
##
mkdir .github/workflows

2.2 -- Create a workflow YAML file
##
echo. > .github\workflows\ci-cd.yml --- for windows
touch .github/workflows/ci-cd.yml  --- for linux/unix

2.3 -- add sample line of workflow in .yml created
##
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

 
3 -- Go to Your Repository on GitHub
3.1 -- Create a Pull Request
-- Navigate to the Pull Requests tab on your repository page.
-- Click the New Pull Request button.
-- In the "base" dropdown, select the main branch (this is where you want to merge the changes).
-- In the "compare" dropdown, select the master branch (this is the branch you're merging from).

3.2 -- Review the Changes

3.3 -- Create the Pull Request
-- Once you're ready, click the Create Pull Request button.
-- Fill in a title and description for your pull request (optional).
-- You can assign reviewers if you want others to approve the changes.

3.4 -- Resolve Conflicts (If Any)

3.5 -- Merge the Pull Request

3.6 -- Update Your Local Repositories
-- After merging the PR, make sure you pull the latest changes from main into your local repositories:
##
git checkout main
git pull origin main

3.7 -- Now merge that branch to main branch
##
git merge branch_name_to_be_merged



### new workflow
name: CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-22.04

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test -- --passWithNoTests

      - name: Build Project
        run: npm run build

      - name: Debug Working Directory
        run: ls -alh

      - name: Debug .next Directory
        run: ls -R .next || echo ".next directory not found"

      - name: Debug Out Directory
        run: ls -R out || echo "out directory not found"

      - name: Upload production-ready build files
        uses: actions/upload-artifact@v4
        with:
          name: production-files
          path: ./out  # Use the 'out' directory for static export

  deploy:
    name: Deploy
    needs: build
    runs-on: ubuntu-22.04

    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: production-files
          path: ./out  # Download the 'out' directory

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.TOKEN }}
          publish_dir: ./out  # Deploy the 'out' directory to GitHub Pages
