# How to Push to GitHub from Local Machine

1. **Download your project files**:
   - Click the download button in WebContainer's file explorer
   - Or use the export functionality if available

2. **On your local machine**:
   ```bash
   # Unzip the downloaded files
   unzip sports-genius.zip
   cd sports-genius

   # Initialize Git
   git init
   git add .
   git commit -m "Initial commit"

   # Connect to GitHub (replace with your repo URL)
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

3. **Alternative - Manual Upload**:
   - Create a new repository on GitHub.com
   - Use the "Upload files" button
   - Drag-and-drop all files except:
     - node_modules/
     - .env
     - any build artifacts
